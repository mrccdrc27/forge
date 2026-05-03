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
    this.log('Build Engine initialized with Template Library support.');
  }

  async build(request: BuildRequest): Promise<BuildResult> {
    try {
      const { name, type, description, targetPath: requestedTargetPath } = request;
      const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '.';
      const targetPath = requestedTargetPath 
        ? (path.isAbsolute(requestedTargetPath) ? requestedTargetPath : path.join(workspaceRoot, requestedTargetPath))
        : path.join(workspaceRoot, name);

      const templatesDir = path.join(workspaceRoot, 'templates');
      this.log(`Scaffolding "${name}" using library at ${templatesDir}`);

      const availableTemplates = this.getAvailableTemplates(templatesDir);
      this.log(`Library discovery: ${availableTemplates.length} templates found.`);
      if (availableTemplates.length === 0) {
        throw new Error(`Template library is empty or missing at ${templatesDir}`);
      }

      const mapperPrompt = `You are a Senior Project Architect.
Library of available scaffolding templates:
${availableTemplates.map(t => `- ${t}`).join('\n')}

User Requirements: "${description}"
Type Hint: "${type}"

Your task: Match the requirements to the most appropriate template(s) in the library.
- If it's a fullstack request (e.g. "React + FastAPI"), return an array with BOTH templates: ["react/vite", "python/fastapi"].
- If it's a single framework request, return a single-item array.
- If multiple frameworks are requested but one is a subset or superseded by another, pick the most specific one.
- Return ONLY the JSON array. No explanations.

Format: ["path/to/template", ...]`;

      this.log(`Mapping requirements to library...`);
      const mappingResult = await this.arbitrator.executeTask({ task: mapperPrompt });
      let selectedTemplates: string[] = [];
      
      try {
        // More robust JSON extraction: find the first '[' and last ']'
        const start = mappingResult.indexOf('[');
        const end = mappingResult.lastIndexOf(']');
        if (start !== -1 && end !== -1 && end > start) {
          const jsonStr = mappingResult.substring(start, end + 1);
          selectedTemplates = JSON.parse(jsonStr);
        }
      } catch (err) {
        this.log(`JSON Parse failed for mapping result: ${mappingResult}`);
      }

      // Fuzzy matching fallback if LLM fails or returns garbage
      if (selectedTemplates.length === 0) {
        this.log(`LLM mapping failed. Attempting fuzzy fallback...`);
        const lowerDesc = description.toLowerCase();
        selectedTemplates = availableTemplates.filter(t => {
          const parts = t.toLowerCase().split('/');
          return parts.some(p => lowerDesc.includes(p));
        });
      }

      // Final validation: Ensure selected templates actually exist in our available list
      selectedTemplates = selectedTemplates.filter(t => availableTemplates.includes(t));

      if (selectedTemplates.length === 0) {
        throw new Error(`No matching templates found for: ${description}`);
      }

      this.log(`Selected templates: ${selectedTemplates.join(', ')}`);

      // Phase 2: File Gathering
      const filesToWrite: { [key: string]: string } = {};
      
      for (const template of selectedTemplates) {
        const templatePath = path.join(templatesDir, template);
        if (!fs.existsSync(templatePath)) continue;

        // Determine subfolder (frontend/backend) if multiple templates
        let subFolder = "";
        if (selectedTemplates.length > 1) {
          if (template.includes('react') || template.includes('vite') || template.includes('next')) {
            subFolder = "frontend";
          } else if (template.includes('python') || template.includes('node') || template.includes('express')) {
            subFolder = "backend";
          } else {
            subFolder = template.split('/').pop() || template;
          }
        }

        this.gatherFiles(templatePath, "", filesToWrite, subFolder);
      }

      // Phase 3: Final Write
      this.log(`Writing ${Object.keys(filesToWrite).length} files to disk...`);
      await this.writer.bulkWrite(targetPath, filesToWrite);

      return {
        summary: `Successfully scaffolded ${name} using [${selectedTemplates.join(', ')}] at ${targetPath}`,
        fileCount: Object.keys(filesToWrite).length,
        targetPath
      };
    } catch (err: any) {
      this.log(`BUILD ERROR: ${err.message}`);
      throw err;
    }
  }

  private getAvailableTemplates(baseDir: string, currentRel = ""): string[] {
    const templates: string[] = [];
    if (!fs.existsSync(baseDir)) return [];

    const entries = fs.readdirSync(baseDir, { withFileTypes: true });
    
    // If it contains a seed file, it's a template
    const hasSeed = entries.some(e => e.name.startsWith('seed.'));
    if (hasSeed) {
      return [currentRel];
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subTemplates = this.getAvailableTemplates(
          path.join(baseDir, entry.name),
          currentRel ? `${currentRel}/${entry.name}` : entry.name
        );
        templates.push(...subTemplates);
      }
    }
    return templates;
  }

  private gatherFiles(srcDir: string, relPath: string, fileMap: { [key: string]: string }, subFolder: string) {
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const entry of entries) {
      const entryRelPath = relPath ? path.join(relPath, entry.name) : entry.name;
      const targetRelPath = subFolder ? path.join(subFolder, entryRelPath) : entryRelPath;
      
      if (entry.isDirectory()) {
        this.gatherFiles(path.join(srcDir, entry.name), entryRelPath, fileMap, subFolder);
      } else {
        const content = fs.readFileSync(path.join(srcDir, entry.name), 'utf8');
        fileMap[targetRelPath] = content;
      }
    }
  }

  dispose(): void {
    this.log('Build Engine disposed.');
  }
}
