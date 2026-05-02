import * as fs from 'fs';
import * as path from 'path';
import { BaseService } from './BaseService';

export class AtomicWriter extends BaseService {
  async init() {
    this.log("Atomic Writer Initialized.");
  }

  /**
   * Performs a transactional bulk write of files.
   * If any file write fails, all changes in this batch are rolled back.
   */
  async bulkWrite(baseDir: string, files: { [key: string]: string }) {
    const backups: { [key: string]: string | null } = {};
    const createdDirs: string[] = [];

    try {
      for (const [filePath, content] of Object.entries(files)) {
        const fullPath = path.isAbsolute(filePath) ? filePath : path.join(baseDir, filePath);
        
        // Ensure directory exists
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          // Track created directories for potential cleanup (simplified)
          fs.mkdirSync(dir, { recursive: true });
          createdDirs.push(dir);
        }

        // Backup existing file or track it as non-existent
        if (fs.existsSync(fullPath)) {
          backups[fullPath] = fs.readFileSync(fullPath, 'utf8');
        } else {
          backups[fullPath] = null;
        }

        fs.writeFileSync(fullPath, content, 'utf8');
        this.log(`Wrote: ${fullPath}`);
      }
    } catch (err) {
      this.log(`Error during bulk write: ${err}. Rolling back...`);
      
      // Rollback files
      for (const [fullPath, originalContent] of Object.entries(backups)) {
        if (originalContent === null) {
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        } else {
          fs.writeFileSync(fullPath, originalContent, 'utf8');
        }
      }
      throw err;
    }
  }

  dispose() {}
}
