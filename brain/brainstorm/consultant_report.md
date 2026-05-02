# Forge Project: Hackathon Consultation Report
**Date:** 2026-05-02
**Context:** IBM Bob Dev Day Hackathon

## Current Approach Analysis
Forge is designed as an Electron-based GUI for orchestrating autonomous software builds. It leverages a Multi-Agent architecture:
- **Planner/Verifier:** Llama-3.3-70B (via Bob Shell).
- **Worker:** Granite-8B-Code (via Watsonx Orchestrate).
- **Core Loop:** Plan → Build → Verify → Retry.

---

## Critical Evaluation

### 1. Mandatory Tool Compliance (Bob IDE)
- **Problem:** The hackathon requires **IBM Bob IDE** to be a "core component." A standalone Electron app risks being seen as a replacement rather than an extension.
- **Impact:** Potential score deduction or disqualification from core categories.
- **Suggestion:** Position Forge as an **"Orchestration Sidecar"**. Ensure activities are visible/reflected in Bob IDE or implement parts of the logic as an MCP Server accessible within the IDE.

### 2. Judging Deliverables (Session Reports)
- **Problem:** Mandatory `bob_sessions` reports (markdown history) are required for judging.
- **Risk:** Shell commands run via Electron child processes (`bob -p`) may not populate the IDE's task history automatically.
- **Action:** Verify if `bob -p` triggers session history. If not, manual steps or logging shims are required to satisfy the `bob_sessions` folder requirement.

### 3. Orchestration Depth
- **Problem:** The `orchestrate:spawn` integration is currently a placeholder (TODO).
- **Suggestion:** Fully implement the Watsonx Orchestrate worker. Using IBM-native models like **Granite** for the heavy-lifting coding tasks aligns well with the "impact" theme.

### 4. Resource Efficiency (Bobcoins)
- **Risk:** Autonomous retry loops can rapidly consume the 40 Bobcoin limit per member.
- **Suggestion:** Add a "Cost/Budget Tracker" to the Forge UI to show transparency in token/coin usage.

---

## Strategic Recommendations

1. **MCP Integration:** Expose Forge's planner as an MCP server. This allows users to trigger the "Forge Master Plan" directly from Bob IDE using `@forge`.
2. **Human-in-the-loop:** Add an "Approve Step" gate in the Electron UI. This demonstrates "Trustworthy AI," which is a high-value judging criterion for IBM.
3. **Demo Strategy:** Show Forge handling the "Macro" planning and repetitive scaffolding, then switch to Bob IDE for "Micro" refinements and final export.

---

## Recommended Next Steps
1. **Verification:** Confirm if `bob -p` sessions appear in Bob IDE history.
2. **Implementation:** Fix the `orchestrate:spawn` placeholder.
3. **Refinement:** Ensure the "Discovery" chat generates high-quality JSON plans.
