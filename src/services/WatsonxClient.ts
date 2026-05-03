import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { BaseService } from './BaseService';
import { ConfigManager } from './ConfigManager';

export interface WatsonxResponse {
  content: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  model: string;
}

export class WatsonxClient extends BaseService {
  private apiKey?: string;
  private projectId?: string;
  private baseUrl?: string;
  private accessToken?: string;
  private tokenExpiry?: number;

  constructor(output: vscode.OutputChannel, private config: ConfigManager) {
    super('WatsonxClient', output);
  }

  async init(): Promise<void> {
    await this.loadConfig();
    if (this.apiKey && this.projectId) {
      this.log('Watsonx Client initialized with live credentials.');
    } else {
      this.log('Watsonx Client initialized in MOCK mode (missing credentials).');
    }
  }

  private async loadConfig() {
    // First, try to load from ConfigManager (VS Code settings)
    const credentials = this.config.getWatsonxCredentials();
    if (credentials.apiKey && credentials.projectId) {
      this.apiKey = credentials.apiKey;
      this.projectId = credentials.projectId;
      this.log('✅ Loaded credentials from VS Code settings');
    } else {
      // Fallback to .env file
      const candidatePaths: string[] = [];

      // 1. Workspace root (standard usage)
      const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
      if (workspaceRoot) {
        candidatePaths.push(path.join(workspaceRoot, 'watson', '.env'));
      } else {
        this.log('⚠️ No workspace folder found.');
      }

      // 2. Extension directory fallback: dist/services/ -> up 2 levels -> watson/.env
      const extDirFallback = path.join(__dirname, '..', '..', 'watson', '.env');
      candidatePaths.push(extDirFallback);

      let loaded = false;
      for (const envPath of candidatePaths) {
        this.log(`Checking for .env at: ${envPath}`);
        if (fs.existsSync(envPath)) {
          try {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const envConfig = dotenv.parse(envContent);

            this.apiKey = envConfig.WATSON_API_KEY;
            this.projectId = envConfig.WATSON_PROJECT_ID;
            this.baseUrl = envConfig.WATSON_URL;

            if (this.apiKey) this.log(`✅ Loaded WATSON_API_KEY from: ${envPath}`);
            if (this.projectId) this.log(`✅ Loaded WATSON_PROJECT_ID from: ${envPath}`);
            loaded = true;
            break;
          } catch (err) {
            this.log(`❌ Failed to parse .env at ${envPath}: ${err}`);
          }
        } else {
          this.log(`   Not found: ${envPath}`);
        }
      }

      if (!loaded) {
        this.log('⚠️ Could not find watson/.env in any candidate path. Running in MOCK mode.');
      }
    }

    if (!this.baseUrl) {
      this.baseUrl = this.config.getConfig().watsonx.baseUrl;
      this.log(`Using fallback baseUrl: ${this.baseUrl}`);
    }
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (!this.apiKey) throw new Error('WATSON_API_KEY is missing');

    const response = await fetch('https://iam.cloud.ibm.com/identity/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${this.apiKey}`
    });

    const data: any = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
    return this.accessToken!;
  }

  async generate(prompt: string, model: string = 'ibm/granite-3-8b-instruct'): Promise<WatsonxResponse> {
    if (!this.apiKey || !this.projectId) {
      return this.mockGenerate(prompt, model);
    }

    const token = await this.getAccessToken();
    const url = `${this.baseUrl}/ml/v1/text/generation?version=2023-05-29`;

    const body = {
      model_id: model,
      input: prompt,
      project_id: this.projectId,
      parameters: {
        max_new_tokens: 8192,
        min_new_tokens: 0,
        stop_sequences: [],
        repetition_penalty: 1.0,
        return_options: {
          input_token_count: true,
          generated_token_count: true
        }
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Watsonx API Error: ${response.statusText} - ${err}`);
    }

    const data: any = await response.json();
    const result = data.results[0];

    return {
      content: result.generated_text,
      usage: {
        input_tokens: result.input_token_count || 0,
        output_tokens: result.generated_token_count || 0
      },
      model
    };
  }

  private async mockGenerate(prompt: string, model: string): Promise<WatsonxResponse> {
    this.log(`MOCK Generating with ${model}...`);
    await new Promise(resolve => setTimeout(resolve, 500));

    let content = '[FORGE v2 MOCK] Credentials not loaded - check Forge Output channel for path diagnostics.';
    if (prompt.toLowerCase().includes('json')) {
      content = JSON.stringify({
        status: 'success',
        data: `Simulated data from ${model}`,
        timestamp: new Date().toISOString()
      });
    }

    return {
      content,
      usage: {
        input_tokens: Math.floor(prompt.length / 4),
        output_tokens: 100
      },
      model
    };
  }

  async generateStructured(prompt: string, schema: any, model: string = 'ibm/granite-3-8b-instruct'): Promise<any> {
    const structuredPrompt = `${prompt}\n\nSTRICT REQUIREMENT: Return ONLY valid JSON matching this schema: ${JSON.stringify(schema)}`;
    
    let attempts = 0;
    while (attempts < 3) {
      const response = await this.generate(structuredPrompt, model);
      try {
        return this.extractJSON(response.content);
      } catch (err) {
        attempts++;
        this.log(`Attempt ${attempts} failed to produce valid JSON. Retrying...`);
        if (attempts === 3) throw new Error(`Failed to generate valid JSON after 3 attempts: ${err}`);
      }
    }
  }

  /**
   * Extracts a JSON object from text using balanced-brace matching.
   */
  private extractJSON(text: string): any {
    const start = text.indexOf('{');
    if (start === -1) throw new Error('No JSON found in response');

    let depth = 0;
    let inString = false;
    let escape = false;

    for (let i = start; i < text.length; i++) {
      const ch = text[i];
      if (escape) { escape = false; continue; }
      if (ch === '\\' && inString) { escape = true; continue; }
      if (ch === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) return JSON.parse(text.substring(start, i + 1));
      }
    }
    throw new Error('Incomplete JSON object in response');
  }

  async verifyConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.apiKey || !this.projectId) {
      return {
        success: false,
        message: 'API Key or Project ID is missing. Please configure credentials first.'
      };
    }

    try {
      // Try to get an access token
      const token = await this.getAccessToken();
      
      // Try a simple test generation
      const testPrompt = 'Hello';
      const response = await this.generate(testPrompt, 'ibm/granite-3-8b-instruct');
      
      if (response.content) {
        return {
          success: true,
          message: `✅ Connection successful! Model: ${response.model}, Tokens: ${response.usage.input_tokens + response.usage.output_tokens}`
        };
      } else {
        return {
          success: false,
          message: 'Connection established but received empty response.'
        };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        message: `❌ Connection failed: ${errorMsg}`
      };
    }
  }

  updateCredentials(apiKey: string, projectId: string): void {
    this.apiKey = apiKey;
    this.projectId = projectId;
    this.accessToken = undefined;
    this.tokenExpiry = undefined;
    this.log('Credentials updated');
  }

  dispose(): void {
    this.log('Watsonx Client disposed.');
  }
}
