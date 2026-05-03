import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { BaseService } from './BaseService';
import { ResourceArbitrator } from './ResourceArbitrator';

export class DocumentationEngine extends BaseService {
  constructor(
    output: vscode.OutputChannel,
    private arbitrator: ResourceArbitrator
  ) {
    super('DocumentationEngine', output);
  }

  async init(): Promise<void> {
    this.log('Documentation Engine initialized.');
  }

  async document(modulePath: string): Promise<string> {
    this.log(`Generating documentation for: ${modulePath}`);
    
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!workspaceRoot) throw new Error('No workspace folder found.');

    const fullPath = path.isAbsolute(modulePath) ? modulePath : path.join(workspaceRoot, modulePath);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Path does not exist: ${modulePath}`);
    }

    // Read files in the directory
    let context = '';
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      const files = fs.readdirSync(fullPath).filter(f => f.match(/\.(ts|js|py|tsx|jsx)$/));
      for (const file of files.slice(0, 15)) { // Cap at 15 files for module documentation
        const content = fs.readFileSync(path.join(fullPath, file), 'utf8');
        context += `\n--- File: ${file} ---\n${content.substring(0, 4000)}\n`;
      }
    } else {
      const content = fs.readFileSync(fullPath, 'utf8');
      context += `\n--- File: ${path.basename(fullPath)} ---\n${content.substring(0, 10000)}\n`;
    }

    const prompt = `You are a Technical Writer and Senior Developer. 
Your task is to generate comprehensive developer documentation for the following module/files.

Context:
${context}

Documentation Requirements:
1. **Overview**: What does this module actually do end-to-end?
2. **Entry Points**: Which files/functions are the primary triggers?
3. **Internal Data Flow**: How does data move through these components?
4. **Key Functions & Logic**: Summarize the critical algorithms or business rules.
5. **Side Effects**: Mention external API calls, DB writes, or state changes.
6. **Error Handling**: How are failures managed?

Write the documentation in a clear, narrative, plain-English style. Avoid just repeating function signatures.`;

    this.log('Sending to Llama-70B for documentation generation...');
    return await this.arbitrator.executeTask({ task: prompt });
  }

  dispose(): void {}
}
