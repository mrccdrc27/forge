import * as vscode from 'vscode';
import { BaseService } from './BaseService';

export class ContextEngine extends BaseService {
  private watcher?: vscode.FileSystemWatcher;

  async init() {
    this.watcher = vscode.workspace.createFileSystemWatcher('**/*');
    
    this.watcher.onDidCreate(uri => this.log(`File Created: ${uri.fsPath}`));
    this.watcher.onDidDelete(uri => this.log(`File Deleted: ${uri.fsPath}`));
    this.watcher.onDidChange(uri => this.log(`File Changed: ${uri.fsPath}`));

    this.log("Context Engine Active.");
  }

  dispose() {
    this.watcher?.dispose();
  }
}
