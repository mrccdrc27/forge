# Forge: Core Capabilities & Scope
**"The Universal AI Orchestration Sidecar"**

## 🎯 Core Capabilities
Forge provides four high-impact capabilities that extend any AI-powered IDE (like IBM Bob IDE, VS Code, or Cursor):

### 1. Autonomous Bulk Execution (The "Muscle")
*   **Bulk Scaffolding:** Instant generation of full-stack project structures (React/FastAPI/Docker) in a single operation.
*   **Atomic Multi-File Writes:** The ability to write or modify multiple files (e.g., Component + CSS + Test) simultaneously to prevent partial state errors.
*   **Background Shell Automation:** Headless execution of `npm install`, `pip install`, and build commands without blocking the IDE chat.

### 2. Resource Arbitrage (The "Sentry")
*   **Cost Prediction:** Analyzes implementation plans to estimate API token impact *before* execution.
*   **Worker Delegation:** Routes "commodity coding" (boilerplate, unit tests, refactoring) to lower-cost or local models (like Granite-8B), bypassing expensive reasoning models (like Llama-3.3) for trivial tasks.
*   **Budget Guardrails:** Hard-stop mechanisms that prevent accidental API budget depletion during autonomous loops.

### 3. Transparent Context Awareness (The "Ghost")
*   **Live Overlay HUD:** A non-intrusive, always-on-top window showing real-time resource usage and "AI Thinking" states.
*   **Passive Context Sync:** Watches filesystem changes and IDE logs to ensure Forge's internal tools always have the latest architectural context.

### 4. Protocol-First Integration (The "MCP Bridge")
*   **MCP Server Implementation:** Exposes Forge's capabilities as standard Model Context Protocol (MCP) tools directly to any compatible IDE.
*   **Custom Mode Provisioning:** Pre-configured personas that optimize the delegation of tasks between the IDE's reasoning engine and Forge's execution muscle.

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
