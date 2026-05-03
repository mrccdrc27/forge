import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { BaseService } from './BaseService';
import { ResourceArbitrator } from './ResourceArbitrator';
import { ConfigManager } from './ConfigManager';

export interface CodeSuggestion {
  category: 'CODE_QUALITY' | 'BEST_PRACTICES' | 'ARCHITECTURE' | 'PERFORMANCE';
  id: string;
  title: string;
  file: string;
  line?: number;
  description: string;
  recommendation?: string;
}

export interface SuggestionReport {
  generated: string;
  target: string;
  summary: {
    codeQuality: number;
    bestPractices: number;
    architecture: number;
    performance: number;
  };
  suggestions: CodeSuggestion[];
}

export class CodeSuggestionAnalyzer extends BaseService {
  constructor(
    output: vscode.OutputChannel,
    private arbitrator: ResourceArbitrator,
    private config: ConfigManager
  ) {
    super('CodeSuggestionAnalyzer', output);
  }

  async init(): Promise<void> {
    this.log('Code Suggestion Analyzer initialized.');
  }

  /**
   * Performs a one-shot code suggestion analysis on the specified target
   * @param target - Path to file, directory, or 'diff' for git changes
   * @returns Formatted suggestion report as a string
   */
  async analyze(target: string): Promise<string> {
    this.log(`Starting code suggestion analysis for: ${target}`);
    
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!workspaceRoot) {
      throw new Error('No workspace folder found for code suggestion analysis.');
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

    this.log(`Found ${filesToScan.length} files to analyze for code suggestions.`);

    // Collect code context
    const codeContext = await this.collectCodeContext(filesToScan, workspaceRoot);

    // Generate code suggestion analysis using LLM
    const report = await this.performSuggestionAnalysis(codeContext, targetDescription);

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
    return files.slice(0, 50); // Limit to 50 files for performance
  }

  private isCodeFile(filename: string): boolean {
    const codeExtensions = ['.ts', '.js', '.tsx', '.jsx', '.py', '.java', '.go', '.rs', '.php', '.rb', '.cs'];
    return codeExtensions.some(ext => filename.endsWith(ext));
  }

  private async collectCodeContext(files: string[], workspaceRoot: string): Promise<string> {
    let context = '';
    let totalChars = 0;
    const charBudget = 15000; // Budget for code context

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

  private async performSuggestionAnalysis(codeContext: string, target: string): Promise<SuggestionReport> {
    const prompt = `You are a Senior Software Engineer performing a comprehensive code review. Analyze the following code and provide actionable suggestions across four categories.

TARGET: ${target}

CATEGORIES TO ANALYZE:

1. CODE QUALITY
   - Function length (>50 lines should be split)
   - Single Responsibility Principle violations
   - Code duplication (DRY principle)
   - Magic numbers/strings (should be constants)
   - Naming clarity and intent
   - Comment quality and necessity

2. BEST PRACTICES
   - Error handling completeness
   - Logging practices (appropriate levels, structured logs)
   - Input validation and sanitization
   - Resource management (timeouts, cleanup)
   - Configuration management (hardcoded values)
   - Testing considerations

3. ARCHITECTURE
   - Separation of concerns
   - Layer violations (business logic in wrong places)
   - Dependency management
   - Module cohesion
   - Interface design
   - Scalability considerations

4. PERFORMANCE
   - Inefficient algorithms or data structures
   - Unnecessary computations
   - Database query optimization (N+1, missing indexes)
   - Memory leaks or excessive allocations
   - Blocking operations
   - Caching opportunities

CODE TO ANALYZE:
${codeContext}

INSTRUCTIONS:
1. Identify ALL improvement opportunities across the four categories
2. Focus on actionable, specific suggestions
3. For each suggestion provide: category, file path, line number (if identifiable), description, and recommendation
4. Return ONLY valid JSON matching this exact schema:

{
  "suggestions": [
    {
      "category": "CODE_QUALITY|BEST_PRACTICES|ARCHITECTURE|PERFORMANCE",
      "title": "Brief title",
      "file": "relative/path/to/file.ext",
      "line": 42,
      "description": "Detailed explanation of the issue",
      "recommendation": "How to improve it"
    }
  ]
}

If no suggestions found, return: {"suggestions": []}`;

    try {
      const response = await this.arbitrator.executeTask({ task: prompt });
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in LLM response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Build report
      const suggestions: CodeSuggestion[] = (parsed.suggestions || []).map((suggestion: any, idx: number) => ({
        category: suggestion.category || 'CODE_QUALITY',
        id: `${this.getCategoryPrefix(suggestion.category)}${idx + 1}`,
        title: suggestion.title || 'Code Suggestion',
        file: suggestion.file || 'unknown',
        line: suggestion.line,
        description: suggestion.description || 'No description provided',
        recommendation: suggestion.recommendation
      }));

      const summary = {
        codeQuality: suggestions.filter(s => s.category === 'CODE_QUALITY').length,
        bestPractices: suggestions.filter(s => s.category === 'BEST_PRACTICES').length,
        architecture: suggestions.filter(s => s.category === 'ARCHITECTURE').length,
        performance: suggestions.filter(s => s.category === 'PERFORMANCE').length
      };

      return {
        generated: new Date().toISOString(),
        target,
        summary,
        suggestions
      };
    } catch (err) {
      this.log(`Code suggestion analysis failed: ${err}`);
      throw new Error(`Failed to perform code suggestion analysis: ${err}`);
    }
  }

  private getCategoryPrefix(category: string): string {
    const prefixes: Record<string, string> = {
      'CODE_QUALITY': 'Q',
      'BEST_PRACTICES': 'B',
      'ARCHITECTURE': 'A',
      'PERFORMANCE': 'P'
    };
    return prefixes[category] || 'S';
  }

  private formatReport(report: SuggestionReport): string {
    const lines: string[] = [];
    
    lines.push('═══════════════════════════════════════════════════════════');
    lines.push('           CODEBASE SUGGESTION REPORT');
    lines.push('═══════════════════════════════════════════════════════════');
    lines.push(`Generated: ${new Date(report.generated).toLocaleString()}`);
    lines.push(`Target: ${report.target}`);
    lines.push('');
    lines.push('SUMMARY');
    lines.push('───────────────────────────────────────────────────────────');
    lines.push(`  CODE QUALITY:    ${report.summary.codeQuality}`);
    lines.push(`  BEST PRACTICES:  ${report.summary.bestPractices}`);
    lines.push(`  ARCHITECTURE:    ${report.summary.architecture}`);
    lines.push(`  PERFORMANCE:     ${report.summary.performance}`);
    lines.push('');

    if (report.suggestions.length === 0) {
      lines.push('✓ No suggestions found. Code looks good!');
      lines.push('');
      lines.push('═══════════════════════════════════════════════════════════');
      return lines.join('\n');
    }

    // Group by category
    const byCategory = {
      CODE_QUALITY: report.suggestions.filter(s => s.category === 'CODE_QUALITY'),
      BEST_PRACTICES: report.suggestions.filter(s => s.category === 'BEST_PRACTICES'),
      ARCHITECTURE: report.suggestions.filter(s => s.category === 'ARCHITECTURE'),
      PERFORMANCE: report.suggestions.filter(s => s.category === 'PERFORMANCE')
    };

    const categoryLabels: Record<string, string> = {
      CODE_QUALITY: 'CODE QUALITY',
      BEST_PRACTICES: 'BEST PRACTICES',
      ARCHITECTURE: 'ARCHITECTURE',
      PERFORMANCE: 'PERFORMANCE'
    };

    for (const [category, suggestions] of Object.entries(byCategory)) {
      if (suggestions.length === 0) continue;

      lines.push(`${categoryLabels[category]} (${suggestions.length})`);
      lines.push('───────────────────────────────────────────────────────────');
      
      for (const suggestion of suggestions) {
        lines.push(`[${suggestion.id}] ${suggestion.file}${suggestion.line ? `:${suggestion.line}` : ''}`);
        lines.push(`     ${suggestion.description}`);
        if (suggestion.recommendation) {
          lines.push(`     → ${suggestion.recommendation}`);
        }
        lines.push('');
      }
    }

    lines.push('═══════════════════════════════════════════════════════════');
    lines.push(`Total Suggestions: ${report.suggestions.length}`);
    lines.push('═══════════════════════════════════════════════════════════');

    return lines.join('\n');
  }

  private formatEmptyReport(target: string): string {
    return `═══════════════════════════════════════════════════════════
            CODEBASE SUGGESTION REPORT
═══════════════════════════════════════════════════════════
Generated: ${new Date().toLocaleString()}
Target: ${target}

⚠ No files found to analyze.

═══════════════════════════════════════════════════════════`;
  }

  dispose(): void {}
}

// Made with Bob