import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { IForgeService, ChatInstance } from '../interfaces/forge';
import { BaseService } from './BaseService';

interface StorageMetadata {
  version: string;
  lastModified: string;
}

interface ChatInstanceStorage {
  metadata: StorageMetadata;
  instances: ChatInstance[];
  currentInstanceId: string | null;
}

/**
 * ForgeStorageManager - Centralized file-based storage for Forge extension
 * Manages persistent storage in .forge directory within workspace
 */
export class ForgeStorageManager extends BaseService {
  private workspaceRoot: string;
  private forgeDir: string;
  private chatInstancesPath: string;
  private writeQueue: Map<string, Promise<void>> = new Map();

  constructor(output: vscode.OutputChannel) {
    super('forge-storage-manager', output);
    
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      throw new Error('No workspace folder found. Forge requires an open workspace.');
    }
    
    this.workspaceRoot = workspaceFolder.uri.fsPath;
    this.forgeDir = path.join(this.workspaceRoot, '.forge');
    this.chatInstancesPath = path.join(this.forgeDir, 'history', 'chat-instances.json');
  }

  async init(): Promise<void> {
    this.log('Initializing ForgeStorageManager...');
    await this.ensureDirectoryStructure();
    await this.ensureGitignore();
    this.log('ForgeStorageManager initialized successfully');
  }

  dispose(): void {
    this.log('ForgeStorageManager disposed');
  }

  /**
   * Ensures the complete .forge directory structure exists
   */
  private async ensureDirectoryStructure(): Promise<void> {
    const directories = [
      this.forgeDir,
      path.join(this.forgeDir, 'logs'),
      path.join(this.forgeDir, 'logs', 'services'),
      path.join(this.forgeDir, 'history'),
      path.join(this.forgeDir, 'history', 'sessions'),
      path.join(this.forgeDir, 'history', 'builds'),
      path.join(this.forgeDir, 'cache'),
      path.join(this.forgeDir, 'temp')
    ];

    for (const dir of directories) {
      if (!fs.existsSync(dir)) {
        await fs.promises.mkdir(dir, { recursive: true });
        this.log(`Created directory: ${path.relative(this.workspaceRoot, dir)}`);
      }
    }
  }

  /**
   * Ensures .forge directory is added to .gitignore
   */
  private async ensureGitignore(): Promise<void> {
    const gitignorePath = path.join(this.workspaceRoot, '.gitignore');
    const forgePattern = '.forge/';

    try {
      let gitignoreContent = '';
      if (fs.existsSync(gitignorePath)) {
        gitignoreContent = await fs.promises.readFile(gitignorePath, 'utf-8');
      }

      if (!gitignoreContent.includes(forgePattern)) {
        const newContent = gitignoreContent.trim() + '\n\n# Forge extension data\n.forge/\n';
        await fs.promises.writeFile(gitignorePath, newContent, 'utf-8');
        this.log('Added .forge/ to .gitignore');
      }
    } catch (error) {
      this.log(`Warning: Could not update .gitignore: ${error}`);
    }
  }

  /**
   * Save chat instances to persistent storage
   */
  async saveChatInstances(instances: ChatInstance[], currentInstanceId: string | null): Promise<void> {
    const key = 'chat-instances';
    
    // Queue writes to prevent race conditions
    const existingWrite = this.writeQueue.get(key);
    if (existingWrite) {
      await existingWrite;
    }

    const writePromise = this._saveChatInstancesInternal(instances, currentInstanceId);
    this.writeQueue.set(key, writePromise);
    
    try {
      await writePromise;
    } finally {
      this.writeQueue.delete(key);
    }
  }

  private async _saveChatInstancesInternal(instances: ChatInstance[], currentInstanceId: string | null): Promise<void> {
    const storage: ChatInstanceStorage = {
      metadata: {
        version: '1.0.0',
        lastModified: new Date().toISOString()
      },
      instances,
      currentInstanceId
    };

    const dir = path.dirname(this.chatInstancesPath);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }

    await fs.promises.writeFile(
      this.chatInstancesPath,
      JSON.stringify(storage, null, 2),
      'utf-8'
    );
    
    this.log(`Saved ${instances.length} chat instance(s) to disk`);
  }

  /**
   * Load chat instances from persistent storage
   */
  async loadChatInstances(): Promise<{ instances: ChatInstance[]; currentInstanceId: string | null }> {
    try {
      if (!fs.existsSync(this.chatInstancesPath)) {
        this.log('No existing chat instances found, starting fresh');
        return { instances: [], currentInstanceId: null };
      }

      const content = await fs.promises.readFile(this.chatInstancesPath, 'utf-8');
      const storage: ChatInstanceStorage = JSON.parse(content);
      
      this.log(`Loaded ${storage.instances.length} chat instance(s) from disk`);
      return {
        instances: storage.instances,
        currentInstanceId: storage.currentInstanceId
      };
    } catch (error) {
      this.log(`Error loading chat instances: ${error}. Starting fresh.`);
      return { instances: [], currentInstanceId: null };
    }
  }

  /**
   * Append a log entry to a specific log file
   */
  async appendLog(category: string, message: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} ${message}\n`;
    
    const logPath = category.includes('/')
      ? path.join(this.forgeDir, 'logs', category)
      : path.join(this.forgeDir, 'logs', 'services', `${category}.log`);

    const dir = path.dirname(logPath);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }

    await fs.promises.appendFile(logPath, logMessage, 'utf-8');
  }

  /**
   * Save data to cache with optional TTL
   */
  async saveCache(key: string, data: any, ttlSeconds?: number): Promise<void> {
    const cachePath = path.join(this.forgeDir, 'cache', `${key}.json`);
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds ? ttlSeconds * 1000 : null
    };

    await fs.promises.writeFile(cachePath, JSON.stringify(cacheData, null, 2), 'utf-8');
  }

  /**
   * Load data from cache, respecting TTL
   */
  async loadCache<T>(key: string): Promise<T | null> {
    try {
      const cachePath = path.join(this.forgeDir, 'cache', `${key}.json`);
      if (!fs.existsSync(cachePath)) {
        return null;
      }

      const content = await fs.promises.readFile(cachePath, 'utf-8');
      const cacheData = JSON.parse(content);

      // Check TTL
      if (cacheData.ttl) {
        const age = Date.now() - cacheData.timestamp;
        if (age > cacheData.ttl) {
          this.log(`Cache expired for key: ${key}`);
          await fs.promises.unlink(cachePath);
          return null;
        }
      }

      return cacheData.data as T;
    } catch (error) {
      this.log(`Error loading cache for key ${key}: ${error}`);
      return null;
    }
  }

  /**
   * Get the .forge directory path
   */
  getForgeDir(): string {
    return this.forgeDir;
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    totalSize: number;
    chatInstancesSize: number;
    logsSize: number;
    cacheSize: number;
  }> {
    const getDirectorySize = async (dir: string): Promise<number> => {
      if (!fs.existsSync(dir)) return 0;
      
      let size = 0;
      const files = await fs.promises.readdir(dir, { withFileTypes: true });
      
      for (const file of files) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
          size += await getDirectorySize(filePath);
        } else {
          const stats = await fs.promises.stat(filePath);
          size += stats.size;
        }
      }
      
      return size;
    };

    const chatInstancesSize = fs.existsSync(this.chatInstancesPath)
      ? (await fs.promises.stat(this.chatInstancesPath)).size
      : 0;

    return {
      totalSize: await getDirectorySize(this.forgeDir),
      chatInstancesSize,
      logsSize: await getDirectorySize(path.join(this.forgeDir, 'logs')),
      cacheSize: await getDirectorySize(path.join(this.forgeDir, 'cache'))
    };
  }

  /**
   * Clean up old temporary files
   */
  async cleanupTempFiles(maxAgeHours: number = 24): Promise<number> {
    const tempDir = path.join(this.forgeDir, 'temp');
    if (!fs.existsSync(tempDir)) return 0;

    const now = Date.now();
    const maxAge = maxAgeHours * 60 * 60 * 1000;
    let deletedCount = 0;

    const files = await fs.promises.readdir(tempDir);
    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const stats = await fs.promises.stat(filePath);
      
      if (now - stats.mtimeMs > maxAge) {
        await fs.promises.unlink(filePath);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      this.log(`Cleaned up ${deletedCount} temporary file(s)`);
    }

    return deletedCount;
  }
}

// Made with Bob
