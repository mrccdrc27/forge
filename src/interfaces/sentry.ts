export interface TokenUsage {
  input: number;
  output: number;
  total: number;
}

export interface BobcoinCost {
  actual: number;
  saved: number;
  remaining: number;
}

export interface ResourceSentryData {
  tokens: TokenUsage;
  cost: BobcoinCost;
  budget: number;
}

export interface ISentry {
  logUsage(input: number, output: number, model: string): void;
  hasBudget(estimatedTokens: number): boolean;
  getSentryData(): ResourceSentryData;
  estimateCost(tokens: number, model: string): number;
}
