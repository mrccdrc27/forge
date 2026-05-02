import * as vscode from 'vscode';
import { BaseService } from './BaseService';
import { ResourceSentry } from './ResourceSentry';
import { WatsonxClient } from './WatsonxClient';

export interface RouteRequest {
  task: string;
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

  /**
   * Determine the best model for a given task.
   * Llama-3.3-70B: High-level planning, architecture, complex reasoning.
   * Granite-3-8B: Bulk coding, unit tests, documentation, repetitive expansion.
   */
  private route(task: string): string {
    const t = task.toLowerCase();
    
    // Reasoning Keywords (Bob / Llama)
    const reasoningKeywords = ['plan', 'architecture', 'design', 'review', 'compare', 'refactor strategy'];
    
    // Execution Keywords (Forge Contractor / Granite)
    const executionKeywords = ['implement', 'write code', 'fix bug', 'add test', 'document', 'boiler-plate', 'expansion'];

    if (reasoningKeywords.some(kw => t.includes(kw))) {
      return 'meta-llama/llama-3-3-70b-instruct';
    }

    if (executionKeywords.some(kw => t.includes(kw))) {
      return 'ibm/granite-3-8b-instruct';
    }

    // Default to Llama for unknown reasoning-heavy starts, but usually Granite for everything else
    return t.length > 200 ? 'meta-llama/llama-3-3-70b-instruct' : 'ibm/granite-3-8b-instruct';
  }

  async executeTask(request: RouteRequest): Promise<any> {
    const model = this.route(request.task);
    this.log(`Routing task to ${model}`);

    // Estimate cost (heuristic: 1 char ~= 0.25 tokens)
    const estimatedTokens = Math.floor(request.task.length * 0.25) + 1000; // + buffer
    
    if (!this.sentry.hasBudget(estimatedTokens)) {
      throw new Error('Gated: Insufficient Bobcoin budget for this task.');
    }

    const response = await this.watsonx.generate(request.task, model);
    
    // Log actual usage
    this.sentry.logUsage(response.usage.input_tokens, response.usage.output_tokens, response.model);

    return response.content;
  }
}
