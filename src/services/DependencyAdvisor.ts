import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { BaseService } from './BaseService';
import { ResourceArbitrator } from './ResourceArbitrator';
import { ConfigManager } from './ConfigManager';

export class DependencyAdvisor extends BaseService {
  constructor(
    output: vscode.OutputChannel,
    private arbitrator: ResourceArbitrator,
    private config: ConfigManager
  ) {
    super('DependencyAdvisor', output);
  }

  async init(): Promise<void> {
    this.log('Dependency Advisor initialized.');
  }

  async analyze(pkgName: string, targetVersion: string, currentVersion?: string): Promise<string> {
    this.log(`Analyzing impact of upgrading ${pkgName} to v${targetVersion}`);
    
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!workspaceRoot) throw new Error('No workspace folder found.');

    // 1. Detect current version if not provided
    let detectedCurrent = currentVersion;
    if (!detectedCurrent) {
      const packageJsonPath = path.join(workspaceRoot, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        detectedCurrent = pkg.dependencies?.[pkgName] || pkg.devDependencies?.[pkgName];
        // Clean version string (remove ^ or ~)
        detectedCurrent = detectedCurrent?.replace(/[\^~]/, '');
      }
    }

    // 2. Fetch package info from registry
    let changelogSnippet = 'Could not fetch changelog from registry.';
    try {
      const registryUrl = this.config.getConfig().dependencyAdvisor.registryUrl || 'https://registry.npmjs.org';
      const response = await axios.get(`${registryUrl}/${pkgName}`);
      const data = response.data;
      
      // Try to find release notes in the README or version description
      const latestVersion = data['dist-tags'].latest;
      const targetVersionData = data.versions[targetVersion] || data.versions[latestVersion];
      
      // Use README as a fallback for changelog info
      changelogSnippet = data.readme || 'No README found.';
      if (changelogSnippet.length > 8000) {
        changelogSnippet = changelogSnippet.substring(0, 8000) + '... [truncated]';
      }
    } catch (err: any) {
      this.log(`Failed to fetch from registry: ${err.message}`);
    }

    // 3. Scan workspace for usages
    this.log(`Scanning for usages of "${pkgName}"...`);
    // Simple grep-like search for package name in imports or direct calls
    const usages: string[] = [];
    const files = await vscode.workspace.findFiles('**/*.{ts,js,tsx,jsx}', '**/node_modules/**');
    
    for (const file of files.slice(0, 100)) { // Cap file scan
      const content = fs.readFileSync(file.fsPath, 'utf8');
      if (content.includes(pkgName)) {
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes(pkgName)) {
            const relPath = path.relative(workspaceRoot, file.fsPath);
            usages.push(`${relPath}:${idx + 1}: ${line.trim()}`);
          }
        });
      }
      if (usages.length > 50) break;
    }

    // 4. Ask LLM to cross-reference
    const prompt = `You are a Dependency Migration Expert. 
The user wants to upgrade the package "${pkgName}" from v${detectedCurrent || 'unknown'} to v${targetVersion}.

Registry Info/README:
${changelogSnippet}

Actual usages in this codebase:
${usages.join('\n')}

Task:
Analyze the impact of this upgrade. Identify potential breaking changes based on the usages provided.
Provide a clear migration report with:
1. Impact Summary (High/Medium/Low)
2. Breaking Changes found (with file:line references)
3. Step-by-step Migration Checklist.

Keep it standard and non-complex.`;

    this.log('Sending to Llama-70B for impact analysis...');
    return await this.arbitrator.executeTask({ task: prompt });
  }

  dispose(): void {}
}
