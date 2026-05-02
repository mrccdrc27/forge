# Proposal 4: Forge "Autonomous QA Engineer"
**Dimension:** Quality Assurance & Testing

## Overview
Forge acts as a proactive tester. It analyzes new code changes and automatically generates unit, integration, and E2E tests using Bob Shell. If tests fail, it uses a debug loop to propose and apply fixes.

## Technology Stack
- **Test Planner:** `meta-llama/llama-3-3-70b-instruct`.
- **Test Coder/Fixer:** `ibm/granite-8b-code-instruct`.
- **Runner:** `bob -p "run tests and report failures"`.

## End-to-End Use Case
1. **Trigger:** User saves a new API endpoint.
2. **Analysis:** Forge detects the new route in `routes/user.js`.
3. **Action:** Granite generates a Vitest suite for the route via `bob -p`.
4. **Loop:** Forge runs the tests. If a 404 occurs due to a typo in the route path, Forge identifies the typo and applies the fix.
