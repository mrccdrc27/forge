import * as vscode from 'vscode';
import { BaseService } from './BaseService';
import { ResourceSentry } from './ResourceSentry';
import { WatsonxClient } from './WatsonxClient';

export interface RouteRequest {
  task: string;
  complexity: 'high' | 'low';
}

export class ResourceArbitrator extends BaseService {
  constructor(
    output: vscode.OutputChannel,
    private sentry: ResourceSentry,
    private watsonx: WatsonxClient
  ) {
    super('ResourceArbitrator', output);
  }

  async init(): Promise<void> {
    this.log('Resource Arbitrator initialized.');
  }

  dispose(): void {
    this.log('Resource Arbitrator disposed.');
  }

  async executeTask(request: RouteRequest): Promise<any> {
    const model = request.complexity === 'high' ? 'llama-3.3-70b' : 'granite-8b';
    this.log(`Routing task to ${model} [Complexity: ${request.complexity}]`);

    const estimatedTokens = 2000; // Placeholder
    if (!this.sentry.hasBudget(estimatedTokens)) {
      throw new Error('Insufficient Bobcoin budget to execute task.');
    }

    const response = await this.watsonx.generate(request.task, model);
    
    // Log actual usage
    this.sentry.logUsage(response.usage.input_tokens, response.usage.output_tokens, response.model);

    return response.content;
  }
}
