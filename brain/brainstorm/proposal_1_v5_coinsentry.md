# Proposal 1, Var 5: The "Coin-Sentry"
**Category:** Resource & Cost Management

## Concept
A budget-aware orchestrator that optimizes for the 40-Bobcoin limit.

## Technical Architecture
- **Estimation Engine:** A local Granite-8B model predicts the token/coin cost of a prompt before sending it.
- **Tiered Routing:**
    - **Tier 1 (Cheap):** Local linting/formatting (0 coins).
    - **Tier 2 (Medium):** Granite-8B for routine coding.
    - **Tier 3 (Premium):** Llama-3.3-70B for architecture/debugging.
- **UI:** A "Fuel Gauge" in Forge showing remaining coins and projected burn.

## Hackathon Advantage
- **Pragmatism:** Solves a real constraint (40 coin limit) that every team faces.
- **Intelligence:** Shows the system is "smart" about when to use its most expensive resources.
- **Reliability:** Prevents the project from being "bricked" by running out of coins.
