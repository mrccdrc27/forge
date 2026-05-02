import * as vscode from 'vscode';
import { BaseService } from './BaseService';
import { MCPHub } from './MCPHub';

export class ContextEngine extends BaseService {
  private watcher?: vscode.FileSystemWatcher;
  private mcpHub?: MCPHub;

  async init() {
    this.watcher = vscode.workspace.createFileSystemWatcher('**/*');
    
    this.watcher.onDidCreate(uri => this.handleEvent('Created', uri));
    this.watcher.onDidDelete(uri => this.handleEvent('Deleted', uri));
    this.watcher.onDidChange(uri => this.handleEvent('Changed', uri));

    this.log("Context Engine Active.");
  }

  setMCPHub(mcpHub: MCPHub) {
    this.mcpHub = mcpHub;
  }

  private handleEvent(type: string, uri: vscode.Uri) {
    this.log(`File ${type}: ${uri.fsPath}`);
  }

  dispose() {
    this.watcher?.dispose();
  }
}
