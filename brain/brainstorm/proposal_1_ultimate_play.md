# The Ultimate Play: "The MCP Ghost"

**Category:** Integrated UX + Protocol-Driven Architecture + Resource Management

## The Aggregated Concept
This proposal represents the optimal strategy for winning the IBM Bob Dev Day Hackathon. It aggregates the strongest elements from three different variations of the "Orchestration Sidecar" (Proposal 1) to maximize demo appeal, technical sophistication, and adherence to constraints.

It combines:
1. **[Variation 2: The "Ghost" Overlay](./proposal_1_v2_overlay.md):** The UX layer. A transparent, always-on-top Electron ribbon that snaps to the IBM Bob IDE, ensuring the IDE remains the primary workspace.
2. **[Variation 1: The MCP Protocol Hub](./proposal_1_v1_mcp.md):** The Engine. An MCP (Model Context Protocol) Host architecture that standardizes interactions between the Llama planner and the Granite execution tools (via Bob Shell).
3. **[Variation 5: The "Coin-Sentry"](./proposal_1_v5_coinsentry.md):** The Constraint Manager. A "Fuel Gauge" UI element and tiered routing system to ensure the project never exceeds the 40 Bobcoin limit.

## Architecture

*   **UI (The Ghost):** An Electron window (`transparent: true`, `alwaysOnTop: true`) positioned alongside the Bob IDE. It includes the Coin-Sentry "Fuel Gauge".
*   **Context Engine:** Watches the `bob_sessions/` directory via `chokidar` to maintain context on the developer's actions within the IDE.
*   **Orchestration (MCP Hub):** 
    *   **Host:** The core Forge node process.
    *   **Planner:** `meta-llama/llama-3-3-70b-instruct` acts as the MCP client, formulating plans based on user intent and IDE context.
    *   **Tools:** `ibm/granite-8b-code-instruct` and `bob -p` commands are wrapped as standard MCP tools for Llama to invoke.
*   **Resource Management (Coin-Sentry):** Intercepts tool calls to estimate token usage. Routes simple tasks (e.g., linting) to local tools, moderate tasks to Granite, and complex planning to Llama.

## Why This Wins
1.  **Rule Compliance:** Visually and functionally enhances the IBM Bob IDE rather than competing with it (Ghost Overlay). Generates clear sessions via `bob -p` tools.
2.  **Technical Depth:** Demonstrates mastery of modern AI tool calling (MCP) and multi-agent coordination.
3.  **Risk Mitigation:** Actively manages the 40 Bobcoin limit, proving the system is pragmatic and production-ready.
4.  **Demo Factor:** High. The overlay provides a sleek visual, the MCP architecture gives a strong technical narrative, and the fuel gauge proves constraint awareness.