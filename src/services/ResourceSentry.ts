import * as vscode from 'vscode';
import { BaseService } from './BaseService';
import { ISentry, ResourceSentryData, TokenUsage, BobcoinCost } from '../interfaces/sentry';
import { ConfigManager } from './ConfigManager';

export class ResourceSentry extends BaseService implements ISentry {
  private totalInputTokens = 0;
  private totalOutputTokens = 0;
  private actualCost = 0;
  private savedCost = 0;
  private budget: number;
  private pricing: Record<string, number>;

  private _onUpdate = new vscode.EventEmitter<ResourceSentryData>();
  public readonly onUpdate = this._onUpdate.event;

  constructor(output: vscode.OutputChannel, private config: ConfigManager) {
    super('ResourceSentry', output);
    
    const budgetConfig = config.getConfig().budget;
    const models = config.getConfig().watsonx.models;
    
    this.budget = budgetConfig.maxBobcoins;
    
    // Cost per 1k tokens in Bobcoins
    this.pricing = {
      [models.reasoning]: budgetConfig.costs.llama,
      [models.execution]: budgetConfig.costs.granite,
      'default': 0.5
    };
  }

  async init(): Promise<void> {
    this.log(`Sentry initialized with ${this.budget} Bobcoin budget.`);
  }

  dispose(): void {
    this.log('Sentry disposed.');
  }

  logUsage(input: number, output: number, model: string): void {
    const tokens = input + output;
    this.totalInputTokens += input;
    this.totalOutputTokens += output;

    const modelKey = this.pricing[model] ? model : 'default';
    
    const cost = (tokens / 1000) * this.pricing[modelKey];
    this.actualCost += cost;

    // Calculate "Saved" cost (what it would have cost if we used Llama for everything)
    const models = this.config.getConfig().watsonx.models;
    const baselineCost = (tokens / 1000) * this.pricing[models.reasoning];
    if (model.includes('granite')) {
      this.savedCost += (baselineCost - cost);
    }

    this.log(`Usage: ${tokens} tokens [${model}] | Cost: ${cost.toFixed(4)} BC | Saved: ${this.savedCost.toFixed(4)} BC`);
    
    this._onUpdate.fire(this.getSentryData());

    if (this.actualCost > this.budget) {
      this.log('CRITICAL: Budget exceeded!');
      vscode.window.showErrorMessage('Forge: Bobcoin budget exceeded! Execution gated.');
    }
  }

  predictCost(estimatedTokens: number, modelType: 'reasoning' | 'execution'): number {
    const models = this.config.getConfig().watsonx.models;
    const model = modelType === 'reasoning' ? models.reasoning : models.execution;
    return (estimatedTokens / 1000) * this.pricing[model];
  }

  hasBudget(estimatedTokens: number): boolean {
    // For gating, assume worst-case (reasoning) if unsure
    const models = this.config.getConfig().watsonx.models;
    const estimatedCost = (estimatedTokens / 1000) * this.pricing[models.reasoning];
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
