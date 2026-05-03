import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { BaseService } from './BaseService';
import { ResourceArbitrator } from './ResourceArbitrator';

export interface RetryContext {
  error: string;
  attemptedFixes: string[];
  fileContext?: string;
}

export class RetryAdvisor extends BaseService {
  private historyPath: string;

  constructor(
    output: vscode.OutputChannel,
    private arbitrator: ResourceArbitrator
  ) {
    super('RetryAdvisor', output);
    // Path: c:\challenges\forge\brain\retry_history.json
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '.';
    this.historyPath = path.join(workspaceRoot, 'brain', 'retry_history.json');
  }

  async init(): Promise<void> {
    const dir = path.dirname(this.historyPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.log('Retry Advisor initialized with persistent history.');
  }

  async advise(ctx: RetryContext): Promise<string> {
    this.log(`Advising on error: ${ctx.error.substring(0, 100)}...`);
    
    // 1. Load and update history
    let history: RetryContext[] = [];
    if (fs.existsSync(this.historyPath)) {
      try {
        history = JSON.parse(fs.readFileSync(this.historyPath, 'utf8'));
      } catch (err) {
        this.log(`Error parsing history: ${err}`);
      }
    }

    // Fingerprint error (first 100 chars + unique lines)
    const fingerprint = ctx.error.replace(/\d+/g, 'X').substring(0, 200);
    const similarErrors = history.filter(h => h.error.replace(/\d+/g, 'X').substring(0, 200) === fingerprint);
    const repeatCount = similarErrors.length + 1;

    history.push({ ...ctx, timestamp: new Date().toISOString() } as any);
    // Keep last 100 errors
    if (history.length > 100) history.shift();
    
    fs.writeFileSync(this.historyPath, JSON.stringify(history, null, 2));

    // 2. Build prompt
    let patternAlert = '';
    if (repeatCount >= 2) {
      patternAlert = `\nPATTERN ALERT: This specific error pattern has appeared ${repeatCount} times in this session/history. The previous fixes did NOT work.\n`;
    }

    const prompt = `You are a Debugging Specialist. An agent is stuck in an error loop.
${patternAlert}
Error:
${ctx.error}

Attempted Fixes (FAILED):
${ctx.attemptedFixes.map(f => `- ${f}`).join('\n')}

${ctx.fileContext ? `Relevant Code:\n${ctx.fileContext}` : ''}

Task:
1. Diagnose why the previous fixes failed.
2. Provide ONE concrete, specific next step to resolve this.
3. If this looks like a circular dependency or an environment issue, state it clearly.

Be direct and decisive.`;

    this.log('Sending to Llama-70B for recovery advice...');
    return await this.arbitrator.executeTask({ task: prompt });
  }

  dispose(): void {}
}
