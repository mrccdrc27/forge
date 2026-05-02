import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
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
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!workspaceRoot) return;

    const envPath = path.join(workspaceRoot, 'watson', '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      for (const line of lines) {
        const [key, value] = line.split('=');
        if (key && value) {
          const val = value.trim();
          if (key === 'WATSON_API_KEY') this.apiKey = val;
          if (key === 'WATSON_PROJECT_ID') this.projectId = val;
          if (key === 'WATSON_URL') this.baseUrl = val;
        }
      }
    }

    if (!this.baseUrl) {
      this.baseUrl = this.config.getConfig().watsonx.baseUrl;
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
        max_new_tokens: 1000,
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

    let content = 'Mock response from Watsonx';
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
        const jsonMatch = response.content.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : response.content;
        return JSON.parse(jsonStr);
      } catch (err) {
        attempts++;
        this.log(`Attempt ${attempts} failed to produce valid JSON. Retrying...`);
        if (attempts === 3) throw new Error(`Failed to generate valid JSON after 3 attempts: ${err}`);
      }
    }
  }

  dispose(): void {
    this.log('Watsonx Client disposed.');
  }
}
