import * as vscode from 'vscode';
import { BaseService } from './BaseService';

export interface WatsonxResponse {
  content: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  model: string;
}

export class WatsonxClient extends BaseService {
  constructor(output: vscode.OutputChannel) {
    super('WatsonxClient', output);
  }

  async init(): Promise<void> {
    this.log('Watsonx Client (Mock) initialized.');
  }

  dispose(): void {
    this.log('Watsonx Client disposed.');
  }

  async generate(prompt: string, model: string = 'granite-8b'): Promise<WatsonxResponse> {
    this.log(`Generating with ${model}...`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    let content = 'Mock response from Watsonx';
    
    // If prompt asks for JSON, return mock JSON
    if (prompt.toLowerCase().includes('json')) {
      content = JSON.stringify({
        status: 'success',
        data: 'Simulated structured data from Granite-8B',
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

  async generateStructured(prompt: string, schema: any, model: string = 'granite-8b'): Promise<any> {
    const structuredPrompt = `${prompt}\n\nSTRICT REQUIREMENT: Return ONLY valid JSON matching this schema: ${JSON.stringify(schema)}`;
    
    let attempts = 0;
    while (attempts < 3) {
      const response = await this.generate(structuredPrompt, model);
      try {
        // Find JSON in response (handle potential markdown blocks)
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
}
