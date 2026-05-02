# Proposal 1: Forge "The Orchestration Sidecar"
**Tagline:** Accelerate Idea-to-Impact without leaving the Bob ecosystem.

## Overview
Forge acts as a "Master Brain" (Llama-3.3-70B) that manages a "Digital Worker" (Granite-8B). It uses the Electron GUI to provide a high-level orchestration view, while all actual code generation and project manipulation happen through **IBM Bob Shell**, ensuring that the **IBM Bob IDE** remains the primary development environment and session recorder.

## Technology Stack
- **Manager/Planner:** `meta-llama/llama-3-3-70b-instruct` (via Bob Shell).
- **Worker/Coder:** `ibm/granite-8b-code-instruct` (via Watsonx Orchestrate).
- **Automation:** Bob Shell (`bob -p`).
- **Primary IDE:** IBM Bob IDE.
- **Frontend:** Electron + React + Tailwind (Forge UI).

## Feasibility: High
- Utilizes existing Bob Shell capabilities.
- Clear separation of concerns (Planning vs. Coding).
- Complies with all mandatory tool requirements.

**Related Variations:**
- [V1: MCP Protocol Hub](./proposal_1_v1_mcp.md)
- [V2: Ghost Overlay](./proposal_1_v2_overlay.md)
- [V3: Narrative Auditor](./proposal_1_v3_auditor.md)
- [V4: Collaborative Swarm](./proposal_1_v4_swarm.md)
- [V5: Coin-Sentry](./proposal_1_v5_coinsentry.md)


## End-to-End Use Case Simulation
1. **User Prompt:** "Build me a secure REST API for a bookstore with IBM Cloud Object Storage integration."
2. **Forge Discovery:** Forge asks clarifying questions about auth and storage buckets.
3. **Master Plan:** Llama generates a JSON plan:
   - Step 1: Initialize Node.js project.
   - Step 2: Install dependencies (Express, ibm-cos-sdk).
   - Step 3: Implement Auth middleware.
   - Step 4: Implement Storage logic.
4. **Execution Loop:**
   - Forge spawns a task for Step 1.
   - Granite (Worker) receives the task and executes `bob -p "init node project with express"`.
   - Bob IDE session history records the operation.
5. **Human Gate:** Forge pauses: "Step 2 complete. Please verify the `package.json` in Bob IDE."
6. **Completion:** Once verified, Forge provides a summary of the build and usage instructions.
