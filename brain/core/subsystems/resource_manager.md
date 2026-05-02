# Subsystem: Resource-Sentry (Resource Manager)
**Goal:** Guarantee adherence to user-defined API budgets and token limits.

## 🛠️ Technical Specs
- **Cost Database:** Track every token sent/received across multiple model providers.
- **Prediction Model:** Analyzes the complexity of an implementation plan before routing to expensive reasoning models.
- **Routing Logic:**
    - `if (estimated_cost > budget_remaining) throw Error("Budget Exceeded")`
    - `if (task == "trivial") use_local_templates()`
    - `if (task == "standard") use_lightweight_model()`
    - `if (task == "complex") use_reasoning_model()`
- **Persistence:** Save usage logs and budget settings to `~/.forge/usage.json`.

## 📋 Task Breakdown
- [ ] Implement token counter and cost tracker.
- [ ] Create cost estimation heuristics for supported models (Llama, Granite, GPT).
- [ ] Build the routing middleware for the Forge MCP Server.
- [ ] Implement budget reset and alert logic.
