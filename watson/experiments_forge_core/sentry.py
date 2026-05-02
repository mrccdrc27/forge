import os
from dotenv import load_dotenv

class ResourceSentry:
    def __init__(self, budget_cents=100):
        self.total_tokens = 0
        self.total_cost_cents = 0
        self.budget_cents = budget_cents
        # Pricing: roughly $0.60 per 1M tokens for Granite
        self.price_per_1k = 0.0006 

    def log_usage(self, input_tokens, output_tokens):
        tokens = input_tokens + output_tokens
        self.total_tokens += tokens
        cost = (tokens / 1000) * self.price_per_1k
        self.total_cost_cents += cost * 100
        print(f"Usage: {tokens} tokens | Total Cost: {self.total_cost_cents:.4f}c / {self.budget_cents}c")

    def has_budget(self, estimated_tokens=1000):
        estimated_cost = (estimated_tokens / 1000) * self.price_per_1k * 100
        return (self.total_cost_cents + estimated_cost) <= self.budget_cents
