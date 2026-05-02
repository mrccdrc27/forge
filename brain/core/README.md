# 🦾 Forge: The VS Code Extension for AI Orchestration
> **"Your AI IDE plans. Forge executes."**

Forge is a **VS Code Extension** and **MCP (Model Context Protocol) Server**. It bridges the gap between high-level AI reasoning and surgical, budget-efficient execution. While it integrates seamlessly with any MCP-compatible environment, it is built to be a native sidekick for **VS Code** and the **IBM Bob IDE**.

## 🚀 The Vision: Universal Execution
Forge is built on the principle of **Strategic Delegation**. Instead of letting your IDE's expensive reasoning model handle every line of code, Forge acts as a native extension that serves as a "Specialized Contractor":

### 1. IDE as the Architect (Planning)
Your primary IDE (Bob or VS Code) handles the high-level planning. Using **Llama-3.3** or other reasoning models, it analyzes your requirements and writes a roadmap.

### 2. Forge as the Contractor (Execution)
When it's time to act, your IDE invokes **Forge's MCP Tools**. 
*   **The Power Moment:** The AI says, *"I have the plan. Forge, execute the boilerplate for these 5 files."*
*   Forge uses specialized, cost-effective models like **Granite-8B** or local templates to perform the work directly from the extension host.

### 3. Resource Arbitrage & Compliance
Forge tracks every token and byte. It predicts costs before they happen and routes tasks to the most efficient model, ensuring you stay within your **API Budget** (or Bobcoin limit).

---

## 💎 The MVP: Launching with IBM Bob
For the **IBM Bob Dev Day**, Forge provides:
1.  **Custom Forge Mode:** A pre-configured persona for Bob IDE that knows exactly when to delegate to Forge.
2.  **Bulk File Tools:** MCP tools like `forge.bulk_write` and `forge.scaffold_project`.
3.  **The Forge Sidebar:** A native VS Code sidebar HUD showing "True Cost" and savings in real-time.
4.  **Compliance Engine:** Automatic generation of `bob_sessions/` logs to prove integration with IBM's ecosystem.

---

## 🗺️ Project Navigation
- **Capabilities & Scope:** [[capabilities_and_scope.md]]
- **AI Features:**
    - [[ai_features/delegation_model.md|Delegation: Architect vs. Contractor]]
    - [[ai_features/capabilities.md|Tools: Execution Capabilities]]
    - [[ai_features/scopes.md|Scopes: Optimized Domains]]
    - [[ai_features/resource_arbitrage.md|Economics: Resource Arbitrage]]
- **Custom Mode (Bob):** [[forge_mode_definition.md]] — Setting up the Forge persona in Bob.
- **MCP Hub:** [[subsystems/mcp_hub.md]] — The server that talks to the IDE.
- **Subsystems:**
    - [[subsystems/overlay|UX: The Forge Sidebar]]
    - [[subsystems/resource_manager|Sentry: Resource Management]]
    - [[subsystems/context_engine|Intelligence: Context Sync]]
