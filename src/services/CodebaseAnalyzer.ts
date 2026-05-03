import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { BaseService } from './BaseService';
import { ResourceArbitrator } from './ResourceArbitrator';
import { ConfigManager } from './ConfigManager';

export class CodebaseAnalyzer extends BaseService {
  constructor(
    output: vscode.OutputChannel,
    private arbitrator: ResourceArbitrator,
    private config: ConfigManager
  ) {
    super('CodebaseAnalyzer', output);
  }

  async init(): Promise<void> {
    this.log('Codebase Analyzer initialized.');
  }

  async analyze(query: string): Promise<string> {
    this.log(`Analyzing codebase for query: ${query}`);
    
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!workspaceRoot) {
      throw new Error('No workspace folder found for analysis.');
    }

    const analyzerConfig = this.config.getConfig().codebaseAnalyzer;
    const ignorePatterns = await this.getIgnorePatterns(workspaceRoot);
    
    // Scan for files
    const files = await vscode.workspace.findFiles(
      '**/*.{ts,js,py,json,md,html,css}',
      `{${ignorePatterns.join(',')}}`,
      analyzerConfig.maxFilesToScan || 200
    );

    this.log(`Found ${files.length} files to consider.`);

    // Simple heuristic to pick most relevant files
    const scoredFiles = files.map(uri => {
      const relPath = path.relative(workspaceRoot, uri.fsPath);
      let score = 0;
      
      // Match query keywords in path
      const keywords = query.toLowerCase().split(/\s+/);
      keywords.forEach(kw => {
        if (relPath.toLowerCase().includes(kw)) score += 10;
      });

      // Prefer entry points and configs
      if (relPath.match(/(index|main|app|server|config|auth|api|service|controller|model|entity)/i)) score += 5;
      
      // Prefer shallow files
      score += Math.max(0, 10 - relPath.split(path.sep).length);

      return { uri, score, relPath };
    }).sort((a, b) => b.score - a.score);

    const topFiles = scoredFiles.slice(0, 10); // Take top 10 for detailed scan
    let context = '';
    let totalChars = 0;
    const charBudget = analyzerConfig.totalCharBudget || 12000;

    for (const file of topFiles) {
      if (totalChars >= charBudget) break;
      
      try {
        const content = fs.readFileSync(file.uri.fsPath, 'utf8');
        const snippet = content.substring(0, analyzerConfig.maxCharsPerFile || 3000);
        context += `\n--- File: ${file.relPath} ---\n${snippet}\n`;
        totalChars += snippet.length;
      } catch (err) {
        this.log(`Failed to read file ${file.relPath}: ${err}`);
      }
    }

    const prompt = `You are an expert Software Architect. Below is a snapshot of relevant files from the codebase.
Your task is to analyze the architecture and answer the following question: "${query}"

Guidelines:
1. Explain the high-level flow related to the question.
2. Identify key files, classes, or functions.
3. If the answer isn't fully clear from the snippets, provide your best deduction and mention what's missing.
4. Keep the summary technical but concise.

Codebase Context:
${context}

Question: ${query}`;

    this.log('Sending context to Llama-70B for analysis...');
    return await this.arbitrator.executeTask({ task: prompt });
  }

  private async getIgnorePatterns(workspaceRoot: string): Promise<string[]> {
    const forgeIgnorePath = path.join(workspaceRoot, '.forgeignore');
    const defaultExcludes = this.config.getConfig().codebaseAnalyzer.excludePatterns || ['**/node_modules/**', '**/dist/**', '**/.git/**'];
    
    if (fs.existsSync(forgeIgnorePath)) {
      try {
        const content = fs.readFileSync(forgeIgnorePath, 'utf8');
        const patterns = content.split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#'));
        
        this.log(`Loaded ${patterns.length} patterns from .forgeignore`);
        return [...new Set([...defaultExcludes, ...patterns])];
      } catch (err) {
        this.log(`Error reading .forgeignore: ${err}`);
      }
    }
    
    return defaultExcludes;
  }

  dispose(): void {}
}
