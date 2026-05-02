import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { BaseService } from './BaseService';
import { ForgeConfig } from '../interfaces/config';

export class ConfigManager extends BaseService {
  private config: ForgeConfig;

  constructor(output: vscode.OutputChannel) {
    super('ConfigManager', output);
    
    // Default configuration
    this.config = {
      server: {
        port: 3000,
        host: 'localhost'
      },
      watsonx: {
        baseUrl: 'https://us-south.ml.cloud.ibm.com',
        models: {
          reasoning: 'meta-llama/llama-3-3-70b-instruct',
          execution: 'ibm/granite-3-8b-instruct'
        }
      },
      budget: {
        maxBobcoins: 40,
        toolOverheadBuffer: 500,
        costs: {
          llama: 1.0,
          granite: 0.1
        }
      },
      workspace: {
        requireWorkspaceFolder: true,
        defaultScaffoldPath: '.'
      }
    };
  }

  async init(): Promise<void> {
    await this.loadConfig();
    this.log('Configuration loaded successfully');
  }

  private async loadConfig(): Promise<void> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    
    if (!workspaceRoot) {
      this.log('No workspace folder found, using default configuration');
      return;
    }

    const configPath = path.join(workspaceRoot, 'forge.config.json');
    
    if (fs.existsSync(configPath)) {
      try {
        const configContent = fs.readFileSync(configPath, 'utf8');
        const userConfig = JSON.parse(configContent);
        
        // Deep merge user config with defaults
        this.config = this.mergeConfig(this.config, userConfig);
        this.log(`Loaded configuration from ${configPath}`);
      } catch (err) {
        this.log(`Error loading config file: ${err}. Using defaults.`);
        vscode.window.showWarningMessage(`Forge: Invalid config file. Using defaults.`);
      }
    } else {
      this.log('No forge.config.json found, using default configuration');
    }

    // Override with VS Code settings if present
    this.applyVSCodeSettings();
  }

  private applyVSCodeSettings(): void {
    const config = vscode.workspace.getConfiguration('forge');
    
    if (config.has('server.port')) {
      this.config.server.port = config.get('server.port')!;
    }
    
    if (config.has('budget.maxBobcoins')) {
      this.config.budget.maxBobcoins = config.get('budget.maxBobcoins')!;
    }
    
    // Add more VS Code settings overrides as needed
  }

  private mergeConfig(defaults: ForgeConfig, user: Partial<ForgeConfig>): ForgeConfig {
    return {
      server: { ...defaults.server, ...user.server },
      watsonx: {
        ...defaults.watsonx,
        ...user.watsonx,
        models: { ...defaults.watsonx.models, ...user.watsonx?.models }
      },
      budget: {
        ...defaults.budget,
        ...user.budget,
        costs: { ...defaults.budget.costs, ...user.budget?.costs }
      },
      workspace: { ...defaults.workspace, ...user.workspace }
    };
  }

  getConfig(): ForgeConfig {
    return this.config;
  }

  get<K extends keyof ForgeConfig>(key: K): ForgeConfig[K] {
    return this.config[key];
  }

  dispose(): void {
    this.log('ConfigManager disposed');
  }
}

// Made with Bob
