[Back to Core Index](../index.md)

# Forge: Core Capabilities & Scope
**"The Universal AI Orchestration Sidecar"**

## 🎯 Core Capabilities
Forge provides four high-impact capabilities that extend any AI-powered IDE (like IBM Bob IDE, VS Code, or Cursor):

### 1. Autonomous Bulk Execution (The "Muscle")
*   **Bulk Scaffolding:** Instant generation of full-stack project structures in a single operation. See [[../blueprints/capabilities.md|Execution Tools]].
*   **Atomic Multi-File Writes:** Simultaneous modification of files to prevent partial state errors. See [[../tracking/atomic_bulk_write_rollback.md|Rollback Strategy]].
*   **Background Shell Automation:** Headless execution of `npm install` and build commands.

### 2. Resource Arbitrage (The "Sentry")
*   **Cost Prediction:** Analyzes implementation plans to estimate impact before execution. See [[../blueprints/resource_manager.md|Resource Manager]].
*   **Worker Delegation:** Routes "commodity coding" to local models like Granite-8B. See [[../blueprints/delegation_model.md|Delegation Model]].
*   **Budget Guardrails:** Hard-stop mechanisms to prevent budget depletion.

### 3. Transparent Context Awareness (The "Ghost")
*   **Live Overlay HUD:** A non-intrusive window showing real-time resource usage. See [[../blueprints/overlay.md|Ghost Overlay]].
*   **Passive Context Sync:** FS watching to maintain architectural context. See [[../blueprints/context_engine.md|Context Engine]].

### 4. Protocol-First Integration (The "MCP Bridge")
*   **MCP Server Implementation:** Exposes capabilities via standard MCP tools. See [[../blueprints/mcp_hub.md|MCP Hub]].
*   **Custom Mode Provisioning:** Optimized personas for task delegation. See [[../blueprints/mode_definition.md|Forge Mode]].

---

## 🛠️ Project Scope

### In-Scope (The MVP & Hackathon Launch)
*While Forge is a universal tool, the MVP is specifically tailored to win the IBM Bob Dev Day Hackathon.*
- **MCP Server Development:** Node.js implementation of the Model Context Protocol.
- **Electron "Ghost" Overlay:** Transparent UI for the API Budget "Fuel Gauge" and status updates.
- **Watsonx Integration:** Direct API connection to Granite-8B for worker tasks.
- **Template Library:** Curated boilerplate for standard stacks.
- **Compliance Reporting:** Generation of judge-ready `bob_sessions` logs to prove integration with the IBM Bob ecosystem.

### Out-of-Scope (Future/Non-Goals)
- **IDE Replacement:** Forge is not a text editor; it does not compete with Bob IDE, VS Code, or Cursor. It enhances them.
- **Walled-Garden Ecosystem:** Forge is designed to be open and extensible via MCP, not locked to a single model provider.
- **Cloud Hosting:** Forge runs locally on the developer's machine to maintain maximum privacy, context speed, and zero-latency shell execution.
- **Complex UI Design:** UI is intentionally limited to the "Ghost Overlay" HUD to prevent context switching and keep the developer focused on their code.
