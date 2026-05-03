import * as vscode from 'vscode';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import { BaseService } from './BaseService';
import { MCPHub } from './MCPHub';

const execAsync = promisify(exec);

export interface SystemContext {
  platform: string;
  arch: string;
  tools: {
    node?: string;
    npm?: string;
    python?: string;
    pip?: string;
    git?: string;
  };
}

export class ContextEngine extends BaseService {
  private watcher?: vscode.FileSystemWatcher;
  private mcpHub?: MCPHub;
  private cachedContext?: SystemContext;

  async init() {
    this.watcher = vscode.workspace.createFileSystemWatcher('**/*');
    
    this.watcher.onDidCreate(uri => this.handleEvent('Created', uri));
    this.watcher.onDidDelete(uri => this.handleEvent('Deleted', uri));
    this.watcher.onDidChange(uri => this.handleEvent('Changed', uri));

    // Pre-warm the cache
    this.getSystemContext().catch(err => this.log(`Failed to pre-warm context: ${err}`));

    this.log("Context Engine Active.");
  }

  setMCPHub(mcpHub: MCPHub) {
    this.mcpHub = mcpHub;
  }

  async getSystemContext(): Promise<SystemContext> {
    if (this.cachedContext) return this.cachedContext;

    const context: SystemContext = {
      platform: os.platform(),
      arch: os.arch(),
      tools: {}
    };

    const checkTool = async (cmd: string): Promise<string | undefined> => {
      try {
        const { stdout } = await execAsync(`${cmd} --version`);
        return stdout.trim();
      } catch {
        // For python, sometimes it's just 'python' or 'python3'
        if (cmd === 'python') {
          try {
            const { stdout } = await execAsync(`python3 --version`);
            return stdout.trim();
          } catch {
            return undefined;
          }
        }
        return undefined;
      }
    };

    const [node, npm, python, pip, git] = await Promise.all([
      checkTool('node'),
      checkTool('npm'),
      checkTool('python'),
      checkTool('pip'),
      checkTool('git')
    ]);

    context.tools = { node, npm, python, pip, git };
    this.cachedContext = context;
    return context;
  }

  private handleEvent(type: string, uri: vscode.Uri) {
    this.log(`File ${type}: ${uri.fsPath}`);
  }

  dispose() {
    this.watcher?.dispose();
  }
}

