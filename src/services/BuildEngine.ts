import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { BaseService } from './BaseService';
import { ResourceArbitrator } from './ResourceArbitrator';
import { AtomicWriter } from './AtomicWriter';
import { ConfigManager } from './ConfigManager';

export interface BuildRequest {
  name: string;
  type: string;
  description: string;
  targetPath?: string;
}

export interface BuildResult {
  summary: string;
  fileCount: number;
  targetPath: string;
}

export class BuildEngine extends BaseService {
  private _onEvent = new vscode.EventEmitter<{ type: string; payload: any }>();
  public readonly onEvent = this._onEvent.event;

  constructor(
    output: vscode.OutputChannel,
    private arbitrator: ResourceArbitrator,
    private writer: AtomicWriter,
    private config: ConfigManager
  ) {
    super('BuildEngine', output);
  }

  async init(): Promise<void> {
    this.log('Build Engine initialized.');
  }

  async build(request: BuildRequest): Promise<BuildResult> {
    try {
      const { name, type, description, targetPath: requestedTargetPath } = request;
      const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '.';
      const targetPath = requestedTargetPath 
        ? (path.isAbsolute(requestedTargetPath) ? requestedTargetPath : path.join(workspaceRoot, requestedTargetPath))
        : path.join(workspaceRoot, name);

      // Validate absolute paths if not allowed
      const buildConfig = this.config.getConfig().build;
      if (path.isAbsolute(targetPath) && !buildConfig?.allowAbsolutePaths && !targetPath.startsWith(workspaceRoot)) {
        throw new Error(`Absolute paths outside workspace are not allowed: ${targetPath}`);
      }

      this.log(`Starting build for "${name}" (type: ${type}) in ${targetPath}`);

      // Load template if exists
      let files: { [key: string]: string } = {};
      const templatePath = path.join(__dirname, '..', 'templates', `${type}.json`);
      if (fs.existsSync(templatePath)) {
        const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
        for (const [filePath, content] of Object.entries(template.files as { [key: string]: string })) {
          files[filePath] = content.replace(/{{name}}/g, name).replace(/{{description}}/g, description);
        }
        this.log(`Loaded template: ${type}`);
      } else {
        const genericPath = path.join(__dirname, '..', 'templates', 'generic.json');
        if (fs.existsSync(genericPath)) {
          const template = JSON.parse(fs.readFileSync(genericPath, 'utf8'));
          for (const [filePath, content] of Object.entries(template.files as { [key: string]: string })) {
            files[filePath] = content.replace(/{{name}}/g, name).replace(/{{description}}/g, description);
          }
        }
      }

      // Phase 1: Planning (Llama-70B)
      const architectPrompt = `You are a Senior Project Architect. Your task is to plan the file structure for a new project.
Project Name: ${name}
Type: ${type}
Description: ${description}
Existing Files (from template): ${Object.keys(files).join(', ')}

Provide a structured JSON list of files that should be created or updated. 
For each file, provide the relative path and a brief "intent" description of what the file should contain.
Be concise but thorough. Ensure the structure follows industry best practices for the given stack.

CRITICAL: Return ONLY a valid JSON object. Do not include any conversational text before or after the JSON.
Format:
{
  "blueprint": [
    { "path": "src/index.ts", "intent": "Entry point with basic setup" }
  ]
}`;

      const blueprintResult = await this.arbitrator.executeTask({ task: architectPrompt });
      let blueprint: { path: string, intent: string }[] = [];
      
      try {
        this.log(`Received architect response. Attempting to parse blueprint...`);
        
        // Attempt to extract JSON from markdown code blocks first
        let jsonStr = '';
        const codeBlockMatch = blueprintResult.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        
        if (codeBlockMatch) {
          jsonStr = codeBlockMatch[1];
        } else {
          // Fallback to searching for the first { and last }
          const firstBrace = blueprintResult.indexOf('{');
          const lastBrace = blueprintResult.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            jsonStr = blueprintResult.substring(firstBrace, lastBrace + 1);
          }
        }

        if (jsonStr) {
          const parsed = JSON.parse(jsonStr);
          blueprint = parsed.blueprint || [];
          
          if (!Array.isArray(blueprint)) {
            throw new Error("Parsed JSON does not contain a 'blueprint' array");
          }
        } else {
          this.log(`FAILED TO FIND JSON IN RESPONSE: ${blueprintResult}`);
          throw new Error("Could not find a valid JSON object in architect response");
        }
      } catch (err: any) {
        this.log(`PARSE ERROR: ${err.message}`);
        this.log(`RAW ARCHITECT OUTPUT: ${blueprintResult}`);
        
        this._onEvent.fire({
          type: 'UPDATE_SUBAGENT',
          payload: { 
            id: 'architect-phase', 
            patch: { status: 'failed', error: `Parsing failed: ${err.message}. Check Forge output logs for details.` } 
          }
        });
        
        throw new Error(`Failed to generate project blueprint: ${err.message}`);
      }

      // Cap files for safety
      const maxFiles = buildConfig?.maxFilesPerBuild || 50;
      if (blueprint.length > maxFiles) {
        this.log(`Blueprint too large (${blueprint.length} files). Capping to ${maxFiles}.`);
        blueprint = blueprint.slice(0, maxFiles);
      }

      // Phase 2: Generation (Granite-8B)
      this.log(`Phase 2: Generating ${blueprint.length} files...`);
      const generationPromises = blueprint.map(async (file) => {
        const genPrompt = `You are a Senior Software Engineer. Generate the source code for the following file based on the project context.
Project Name: ${name}
Description: ${description}
File Path: ${file.path}
Intent: ${file.intent}

Return ONLY the raw source code for this file. No markdown, no explanations.`;

        const content = await this.arbitrator.executeTask({ task: genPrompt });
        return { path: file.path, content };
      });

      const generatedFiles = await Promise.all(generationPromises);
      for (const file of generatedFiles) {
        files[file.path] = file.content;
      }

      // Final Write
      this.log(`Writing ${Object.keys(files).length} files to disk...`);
      await this.writer.bulkWrite(targetPath, files);

      return {
        summary: `Successfully built ${name} with ${Object.keys(files).length} files at ${targetPath}`,
        fileCount: Object.keys(files).length,
        targetPath
      };
    } catch (err: any) {
      this.log(`BUILD ERROR: ${err.message}`);
      throw err;
    }
  }

  dispose(): void {
    this.log('Build Engine disposed.');
  }
}
