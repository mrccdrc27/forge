# Proposal 12: Forge "Contextual Onboarding Engine"
**Dimension:** Developer Experience (DX)

## Overview
Instead of generic documentation, Forge generates project-specific onboarding material. It analyzes the existing codebase and creates "Learning Pathways" (e.g., "How our Auth system works") with interactive examples.

## Technology Stack
- **Educator:** `meta-llama/llama-3-3-70b-instruct`.
- **Code Tutor:** `ibm/granite-8b-code-instruct`.
- **Output:** `bob -p "generate an onboarding guide for the new payment module"`.

## End-to-End Use Case
1. **Scenario:** A new developer joins the project after the core payment logic is built.
2. **Request:** "Help me understand the payment flow."
3. **Action:** Forge scans the Stripe integration and generates a "Playground" file where the dev can safely trigger dummy transactions.
4. **Impact:** Reduces onboarding time by providing live, relevant context.
