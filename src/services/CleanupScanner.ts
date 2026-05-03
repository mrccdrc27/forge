import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { BaseService } from './BaseService';
import { ResourceArbitrator } from './ResourceArbitrator';
import { ConfigManager } from './ConfigManager';

export class CleanupScanner extends BaseService {
  constructor(
    output: vscode.OutputChannel,
    private arbitrator: ResourceArbitrator,
    private config: ConfigManager
  ) {
    super('CleanupScanner', output);
  }

  async init(): Promise<void> {
    this.log('Cleanup Scanner initialized.');
  }

  async scan(filePaths: string[]): Promise<string> {
    this.log(`Scanning ${filePaths.length} files for cleanup...`);
    
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!workspaceRoot) throw new Error('No workspace folder found.');

    const scannerConfig = this.config.getConfig().cleanupScanner;
    const staticFindings: string[] = [];
    const contents: string[] = [];

    for (const relPath of filePaths.slice(0, scannerConfig.maxFilesToScan || 20)) {
      const fullPath = path.join(workspaceRoot, relPath);
      if (!fs.existsSync(fullPath)) continue;

      const content = fs.readFileSync(fullPath, 'utf8');
      contents.push(`--- File: ${relPath} ---\n${content}`);

      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        // console.log
        if (line.match(/console\.(log|error|warn|debug|info)/)) {
          staticFindings.push(`${relPath}:${idx + 1}: Leftover console.${line.match(/console\.(log|error|warn|debug|info)/)![1]}`);
        }
        // TODO/FIXME
        if (line.match(/\/\/\s*(TODO|FIXME|HACK|DEBUG)/i)) {
          staticFindings.push(`${relPath}:${idx + 1}: Unresolved ${line.match(/(TODO|FIXME|HACK|DEBUG)/i)![0]}`);
        }
        // Potential hardcoded values
        if (line.match(/['"](test@|password|127\.0\.0\.1|localhost:)/i)) {
          staticFindings.push(`${relPath}:${idx + 1}: Potential hardcoded dev/test value: ${line.trim().substring(0, 50)}...`);
        }
      });
    }

    if (scannerConfig.staticOnly) {
      return `Static Cleanup Scan Results:\n${staticFindings.length > 0 ? staticFindings.join('\n') : 'No obvious cleanup items found.'}`;
    }

    const prompt = `You are a Code Quality Reviewer. 
The following files were recently modified. Scan them for anything that shouldn't ship to production.

Known Static Findings:
${staticFindings.join('\n')}

File Contents:
${contents.join('\n\n')}

Task:
Provide a prioritized list of cleanup items. Include line numbers and specific file names.
Check for:
1. Dead code or unused imports.
2. Temporary variables or hardcoded test emails/passwords.
3. Leftover console logs or debug artifacts.
4. TODO comments that should be resolved before completion.

Return a bulleted list of actionable items.`;

    this.log('Sending to Granite-8B for cleanup analysis...');
    return await this.arbitrator.executeTask({ task: prompt });
  }

  dispose(): void {}
}
