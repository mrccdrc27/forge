import * as vscode from 'vscode';
import { BaseService } from './BaseService';
import { ISentry, ResourceSentryData, TokenUsage, BobcoinCost } from '../interfaces/sentry';

export class ResourceSentry extends BaseService implements ISentry {
  private totalInputTokens = 0;
  private totalOutputTokens = 0;
  private actualCost = 0;
  private savedCost = 0;
  private readonly budget = 40; // 40 Bobcoins

  private _onUpdate = new vscode.EventEmitter<ResourceSentryData>();
  public readonly onUpdate = this._onUpdate.event;

  // Cost per 1k tokens in Bobcoins
  private readonly pricing: Record<string, number> = {
    'llama-3.3-70b': 1.0,  // Reasoning model (Expensive)
    'granite-8b': 0.1,      // Execution model (Cheap)
    'default': 0.5
  };

  constructor(output: vscode.OutputChannel) {
    super('ResourceSentry', output);
  }

  async init(): Promise<void> {
    this.log('Sentry initialized with 40 Bobcoin budget.');
  }

  dispose(): void {
    this.log('Sentry disposed.');
  }

  logUsage(input: number, output: number, model: string): void {
    const tokens = input + output;
    this.totalInputTokens += input;
    this.totalOutputTokens += output;

    const modelKey = model.toLowerCase().includes('granite') ? 'granite-8b' : 
                     model.toLowerCase().includes('llama') ? 'llama-3.3-70b' : 'default';
    
    const cost = (tokens / 1000) * this.pricing[modelKey];
    this.actualCost += cost;

    // Calculate "Saved" cost (what it would have cost if we used Llama for everything)
    const baselineCost = (tokens / 1000) * this.pricing['llama-3.3-70b'];
    if (modelKey === 'granite-8b') {
      this.savedCost += (baselineCost - cost);
    }

    this.log(`Usage: ${tokens} tokens [${model}] | Cost: ${cost.toFixed(4)} BC | Saved: ${this.savedCost.toFixed(4)} BC`);
    
    this._onUpdate.fire(this.getSentryData());

    if (this.actualCost > this.budget) {
      this.log('CRITICAL: Budget exceeded!');
      vscode.window.showErrorMessage('Forge: Bobcoin budget exceeded! Execution gated.');
    }
  }

  hasBudget(estimatedTokens: number): boolean {
    const estimatedCost = (estimatedTokens / 1000) * this.pricing['default'];
    return (this.actualCost + estimatedCost) <= this.budget;
  }

  getSentryData(): ResourceSentryData {
    return {
      tokens: {
        input: this.totalInputTokens,
        output: this.totalOutputTokens,
        total: this.totalInputTokens + this.totalOutputTokens
      },
      cost: {
        actual: this.actualCost,
        saved: this.savedCost,
        remaining: Math.max(0, this.budget - this.actualCost)
      },
      budget: this.budget
    };
  }

  estimateCost(tokens: number, model: string): number {
    const modelKey = model.toLowerCase().includes('granite') ? 'granite-8b' : 
                     model.toLowerCase().includes('llama') ? 'llama-3.3-70b' : 'default';
    return (tokens / 1000) * this.pricing[modelKey];
  }
}
