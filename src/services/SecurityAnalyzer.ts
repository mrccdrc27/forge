import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { BaseService } from './BaseService';
import { ResourceArbitrator } from './ResourceArbitrator';
import { ConfigManager } from './ConfigManager';

export interface SecurityIssue {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  id: string;
  title: string;
  file: string;
  line?: number;
  description: string;
  recommendation?: string;
}

export interface SecurityReport {
  generated: string;
  target: string;
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  issues: SecurityIssue[];
}

export class SecurityAnalyzer extends BaseService {
  constructor(
    output: vscode.OutputChannel,
    private arbitrator: ResourceArbitrator,
    private config: ConfigManager
  ) {
    super('SecurityAnalyzer', output);
  }

  async init(): Promise<void> {
    this.log('Security Analyzer initialized.');
  }

  /**
   * Performs a one-shot security analysis on the specified target
   * @param target - Path to file, directory, or 'diff' for git changes
   * @returns Formatted security report as a string
   */
  async analyze(target: string): Promise<string> {
    this.log(`Starting security analysis for: ${target}`);
    
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!workspaceRoot) {
      throw new Error('No workspace folder found for security analysis.');
    }

    // Determine what to scan
    let filesToScan: string[] = [];
    let targetDescription = target;

    if (target === 'diff' || target === 'changes') {
      // Scan git changes
      filesToScan = await this.getChangedFiles(workspaceRoot);
      targetDescription = 'Recent Changes (Git Diff)';
    } else {
      // Scan specific path
      const targetPath = path.isAbsolute(target) ? target : path.join(workspaceRoot, target);
      filesToScan = await this.getFilesFromPath(targetPath);
      targetDescription = path.relative(workspaceRoot, targetPath);
    }

    if (filesToScan.length === 0) {
      return this.formatEmptyReport(targetDescription);
    }

    this.log(`Found ${filesToScan.length} files to analyze for security issues.`);

    // Collect code context
    const codeContext = await this.collectCodeContext(filesToScan, workspaceRoot);

    // Generate security analysis using LLM
    const report = await this.performSecurityAnalysis(codeContext, targetDescription);

    return this.formatReport(report);
  }

  private async getChangedFiles(workspaceRoot: string): Promise<string[]> {
    try {
      const output = execSync('git diff --name-only HEAD', { 
        cwd: workspaceRoot,
        encoding: 'utf8'
      });
      
      const files = output.trim().split('\n')
        .filter((f: string) => f && this.isCodeFile(f))
        .map((f: string) => path.join(workspaceRoot, f));
      
      return files;
    } catch (err) {
      this.log(`Failed to get git changes: ${err}`);
      return [];
    }
  }

  private async getFilesFromPath(targetPath: string): Promise<string[]> {
    const stats = fs.statSync(targetPath);
    
    if (stats.isFile()) {
      return [targetPath];
    }

    // Directory - scan recursively
    const files: string[] = [];
    const scan = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          // Skip common ignore patterns
          if (!['node_modules', 'dist', 'build', '.git', 'coverage'].includes(entry.name)) {
            scan(fullPath);
          }
        } else if (entry.isFile() && this.isCodeFile(entry.name)) {
          files.push(fullPath);
        }
      }
    };

    scan(targetPath);
    return files.slice(0, 15); // Limit to 15 files to prevent LLM timeouts
  }

  private isCodeFile(filename: string): boolean {
    const codeExtensions = ['.ts', '.js', '.tsx', '.jsx', '.py', '.java', '.go', '.rs', '.php', '.rb', '.cs'];
    return codeExtensions.some(ext => filename.endsWith(ext));
  }

  private async collectCodeContext(files: string[], workspaceRoot: string): Promise<string> {
    let context = '';
    let totalChars = 0;
    const charBudget = 8000; // Reduced budget to prevent LLM timeouts

    for (const file of files) {
      if (totalChars >= charBudget) break;

      try {
        const content = fs.readFileSync(file, 'utf8');
        const relPath = path.relative(workspaceRoot, file);
        const snippet = content.substring(0, 3000); // Max 3000 chars per file
        
        context += `\n--- File: ${relPath} ---\n${snippet}\n`;
        totalChars += snippet.length;
      } catch (err) {
        this.log(`Failed to read file ${file}: ${err}`);
      }
    }

    return context;
  }

  private async performSecurityAnalysis(codeContext: string, target: string): Promise<SecurityReport> {
    const prompt = `You are a Security Expert performing a comprehensive security audit. Analyze the following code for security vulnerabilities.

TARGET: ${target}

SECURITY CATEGORIES TO CHECK:
1. SQL Injection - Raw queries, string concatenation with user input
2. Authentication/Authorization - Missing auth checks, weak auth, exposed endpoints
3. PII/Sensitive Data - Exposed credentials, API keys, personal data in logs/responses
4. Input Validation - Missing sanitization, unvalidated user input
5. Rate Limiting - Missing rate limits on critical endpoints
6. Information Disclosure - Internal IDs, stack traces, debug info in production
7. Cryptography - Weak algorithms, hardcoded secrets, insecure random
8. XSS/Injection - Unescaped output, eval usage, command injection
9. CORS/Security Headers - Missing security headers, overly permissive CORS
10. Dependency Vulnerabilities - Known vulnerable packages

CODE TO ANALYZE:
${codeContext}

INSTRUCTIONS:
1. Identify ALL security issues found in the code
2. Classify each by severity: CRITICAL, HIGH, MEDIUM, or LOW
3. For each issue provide: file path, line number (if identifiable), description, and recommendation
4. Return ONLY valid JSON matching this exact schema:

{
  "issues": [
    {
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "title": "Brief title",
      "file": "relative/path/to/file.ext",
      "line": 42,
      "description": "Very brief explanation",
      "recommendation": "Very brief fix"
    }
  ]
}

CRITICAL INSTRUCTION: Return ONLY the JSON object. Keep text extremely brief. Do not add any conversational text or formatting outside the JSON array.
If no issues found, return: {"issues": []}`;

    try {
      const response = await this.arbitrator.executeTask({ 
        task: prompt,
        forceModel: 'execution'
      });
      
      // Extract JSON from response using balanced-brace matching
      const parsed = this.extractJSON(response);
      
      // Build report
      const issues: SecurityIssue[] = (parsed.issues || []).map((issue: any, idx: number) => ({
        severity: issue.severity || 'MEDIUM',
        id: `${issue.severity?.[0] || 'M'}${idx + 1}`,
        title: issue.title || 'Security Issue',
        file: issue.file || 'unknown',
        line: issue.line,
        description: issue.description || 'No description provided',
        recommendation: issue.recommendation
      }));

      const summary = {
        critical: issues.filter(i => i.severity === 'CRITICAL').length,
        high: issues.filter(i => i.severity === 'HIGH').length,
        medium: issues.filter(i => i.severity === 'MEDIUM').length,
        low: issues.filter(i => i.severity === 'LOW').length
      };

      return {
        generated: new Date().toISOString(),
        target,
        summary,
        issues
      };
    } catch (err) {
      this.log(`Security analysis failed: ${err}`);
      throw new Error(`Failed to perform security analysis: ${err}`);
    }
  }

  private formatReport(report: SecurityReport): string {
    const lines: string[] = [];
    
    lines.push('═══════════════════════════════════════════════════════════');
    lines.push('              SECURITY ANALYSIS REPORT');
    lines.push('═══════════════════════════════════════════════════════════');
    lines.push(`Generated: ${new Date(report.generated).toLocaleString()}`);
    lines.push(`Target: ${report.target}`);
    lines.push('');
    lines.push('SUMMARY');
    lines.push('───────────────────────────────────────────────────────────');
    lines.push(`  CRITICAL: ${report.summary.critical}`);
    lines.push(`  HIGH:     ${report.summary.high}`);
    lines.push(`  MEDIUM:   ${report.summary.medium}`);
    lines.push(`  LOW:      ${report.summary.low}`);
    lines.push('');

    if (report.issues.length === 0) {
      lines.push('✓ No security issues detected.');
      lines.push('');
      lines.push('═══════════════════════════════════════════════════════════');
      return lines.join('\n');
    }

    // Group by severity
    const bySeverity = {
      CRITICAL: report.issues.filter(i => i.severity === 'CRITICAL'),
      HIGH: report.issues.filter(i => i.severity === 'HIGH'),
      MEDIUM: report.issues.filter(i => i.severity === 'MEDIUM'),
      LOW: report.issues.filter(i => i.severity === 'LOW')
    };

    for (const [severity, issues] of Object.entries(bySeverity)) {
      if (issues.length === 0) continue;

      lines.push(`${severity} (${issues.length})`);
      lines.push('───────────────────────────────────────────────────────────');
      
      for (const issue of issues) {
        lines.push(`[${issue.id}] ${issue.title}`);
        lines.push(`     File: ${issue.file}${issue.line ? `:${issue.line}` : ''}`);
        lines.push(`     ${issue.description}`);
        if (issue.recommendation) {
          lines.push(`     → Fix: ${issue.recommendation}`);
        }
        lines.push('');
      }
    }

    lines.push('═══════════════════════════════════════════════════════════');
    lines.push(`Total Issues: ${report.issues.length}`);
    lines.push('═══════════════════════════════════════════════════════════');

    return lines.join('\n');
  }

  private formatEmptyReport(target: string): string {
    return `═══════════════════════════════════════════════════════════
              SECURITY ANALYSIS REPORT
═══════════════════════════════════════════════════════════
Generated: ${new Date().toLocaleString()}
Target: ${target}

⚠ No files found to analyze.

═══════════════════════════════════════════════════════════`;
  }

  /**
   * Extracts a JSON object from an LLM response using balanced-brace matching.
   * Unlike a greedy regex, this correctly isolates the first complete JSON object
   * even when the model appends trailing prose or extra braces.
   */
  private extractJSON(text: string): any {
    const start = text.indexOf('{');
    if (start === -1) {
      throw new Error('No JSON found in LLM response');
    }

    let depth = 0;
    let inString = false;
    let escape = false;

    for (let i = start; i < text.length; i++) {
      const ch = text[i];

      if (escape) {
        escape = false;
        continue;
      }

      if (ch === '\\' && inString) {
        escape = true;
        continue;
      }

      if (ch === '"') {
        inString = !inString;
        continue;
      }

      if (inString) continue;

      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) {
          return JSON.parse(text.substring(start, i + 1));
        }
      }
    }

    throw new Error(`Incomplete JSON object in LLM response (length: ${text.length}). Start: ${text.substring(0, 50)}... End: ...${text.substring(text.length - 50)}`);
  }

  dispose(): void {}
}

// Made with Bob
