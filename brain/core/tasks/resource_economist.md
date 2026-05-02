# Tasks: Resource Arbitrage Economist

## Overview
**Domain:** Watsonx & Bobcoin Sentry 
**Primary Goal:** Protect the team's 40 Bobcoin budget by intelligently routing tasks between reasoning models and execution models.
**Hackathon Objective:** Build the cost heuristics to prove to judges that Forge saves expensive reasoning tokens.

## Phase 1: The Budget Foundation
- [ ] Port the existing Python `sentry.py` token-tracking logic into a TypeScript module.
- [ ] Develop the heuristic engine to estimate token usage and calculate the cost difference between IBM Granite-8B and Llama-3.3-70B.
- [ ] Create a mock Watsonx API client that returns dummy structured JSON payloads to unblock the Platform Engineer's tests.
- [ ] Define the interface for the Frontend Architect to consume Sentry data for the HUD.

## Phase 2: The Arbitrage Logic
- [ ] Implement the live `watsonx.ai` API client in TypeScript.
- [ ] Wire the `ResourceSentry` to actively intercept MCP tool calls and gate execution if the 40 Bobcoin budget limit is threatened.
- [ ] Implement the model routing logic: direct high-level planning to Llama (Bob) and bulk commodity coding to Granite (Forge Contractor).

## Phase 3: Hardening & Polish
- [ ] Tune the prompt and extraction logic for Granite-8B to ensure the JSON output is strictly formatted (preventing malformed payloads from breaking the `AtomicWriter`).
- [ ] Implement an error-recovery loop: if Granite produces bad JSON, the Sentry should automatically retry/correct it without bothering Bob.
- [ ] Finalize the "Bobcoin" cost prediction algorithms based on real-world testing.
