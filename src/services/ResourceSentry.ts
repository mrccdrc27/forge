import * as vscode from 'vscode';
import { BaseService } from './BaseService';
import { ISentry, ResourceSentryData, TokenUsage, BobcoinCost } from '../interfaces/sentry';
import { ConfigManager } from './ConfigManager';

/**
 * ResourceSentry - Simple token counter for LLM usage tracking
 * Tracks total aggregated token count across all LLM calls
 */
export class ResourceSentry extends BaseService implements ISentry {
  private totalTokens = 0;

  private _onUpdate = new vscode.EventEmitter<ResourceSentryData>();
  public readonly onUpdate = this._onUpdate.event;

  constructor(output: vscode.OutputChannel, private config: ConfigManager) {
    super('ResourceSentry', output);
  }

  async init(): Promise<void> {
    this.log('ResourceSentry initialized - tracking total token usage');
  }

  dispose(): void {
    this.log('ResourceSentry disposed.');
  }

  /**
   * Log token usage from an LLM call
   * Simply aggregates input + output tokens
   */
  logUsage(input: number, output: number, model: string): void {
    const tokens = input + output;
    this.totalTokens += tokens;

    this.log(`Token usage: +${tokens} tokens [${model}] | Total: ${this.totalTokens} tokens`);
    
    this._onUpdate.fire(this.getSentryData());
  }

  /**
   * Get current token usage data
   */
  getSentryData(): ResourceSentryData {
    return {
      tokens: {
        input: 0,  // Not tracking separately anymore
        output: 0, // Not tracking separately anymore
        total: this.totalTokens
      },
      cost: {
        actual: 0,    // No cost calculation
        saved: 0,     // No savings calculation
        remaining: 0  // No budget tracking
      },
      budget: 0  // No budget limit
    };
  }

  // Legacy methods kept for compatibility but simplified
  predictCost(estimatedTokens: number, modelType: 'reasoning' | 'execution'): number {
    return 0; // No cost prediction
  }

  hasBudget(estimatedTokens: number): boolean {
    return true; // No budget gating
  }

  estimateCost(tokens: number, model: string): number {
    return 0; // No cost estimation
  }
}
