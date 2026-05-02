import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { BaseService } from './BaseService';

export class HistoryExporter extends BaseService {
  private interval?: NodeJS.Timeout;

  async init() {
    this.log("History Exporter Initialized.");
    this.startAutoExport();
  }

  private startAutoExport() {
    // Initial export
    this.exportHistory();
    // Check every 30 seconds
    this.interval = setInterval(() => this.exportHistory(), 30000);
  }

  async exportHistory() {
    try {
      const bobTmpDir = path.join(os.homedir(), '.bob', 'tmp');
      if (!fs.existsSync(bobTmpDir)) return;

      const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
      if (!workspaceRoot) return;

      const exportDir = path.join(workspaceRoot, 'bob_sessions');
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }

      // Find all session JSONs in .bob/tmp
      const files = this.getAllFiles(bobTmpDir).filter(f => f.endsWith('.json') && f.includes('session-'));

      for (const file of files) {
        const fileName = path.basename(file);
        const destPath = path.join(exportDir, fileName);
        
        // Only copy if newer or doesn't exist
        const stats = fs.statSync(file);
        if (!fs.existsSync(destPath) || stats.mtime > fs.statSync(destPath).mtime) {
          fs.copyFileSync(file, destPath);
          this.log(`Exported session: ${fileName}`);
        }
      }
    } catch (err) {
      this.log(`History export failed: ${err}`);
    }
  }

  private getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const fullPath = path.join(dirPath, file);
      try {
        if (fs.statSync(fullPath).isDirectory()) {
          arrayOfFiles = this.getAllFiles(fullPath, arrayOfFiles);
        } else {
          arrayOfFiles.push(fullPath);
        }
      } catch (e) {
        // Skip files that might be locked or inaccessible
      }
    });

    return arrayOfFiles;
  }

  dispose() {
    if (this.interval) clearInterval(this.interval);
  }
}
