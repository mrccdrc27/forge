# Forge Build Phase: Project Plan & Deliverables (Bob IDE Integrated)

## 👥 The Team & Strict Domains

To ensure parallel development without merge conflicts while deeply integrating with the **IBM Bob IDE**, the workload is divided into three distinct domains. Our core mission is to act as a "Sidecar" to Bob, saving the team's precious **40 Bobcoins** via Resource Arbitrage.

### 1. The MCP & Bob Extension Engineer (Domain: Bob IDE Integration & Filesystem)
**Focus:** The VS Code Extension Host, Model Context Protocol (MCP) server, and physical filesystem operations. Their primary goal is exposing Forge's "muscle" directly to IBM Bob's chat interface.
**Boundaries:** Owns `src/` (specifically `extension.ts`, services, and MCP tools). Does NOT touch the React UI (`renderer/`) or make Watsonx API calls.
**Deliverables:**
*   **Phase 1:** Set up the `@modelcontextprotocol/sdk` Server and register it with the local Bob IDE. Establish the IPC bridge to the Webview.
*   **Phase 2:** Implement the `AtomicWriter` and expose tools to Bob (`forge.bulk_write`, `forge.scaffold`, `forge.get_resource_metrics`).
*   **Phase 3:** Automate the Hackathon judging requirement: build a service that automatically captures and syncs Bob's task history into the required `bob_sessions/` directory.

### 2. The Resource Arbitrage Economist (Domain: Watsonx & Bobcoin Sentry)
**Focus:** Protecting the team's 40 Bobcoin limit. When Bob needs to do heavy, commodity coding, this engineer ensures the task is offloaded to cheaper IBM Granite-8B models via watsonx.ai instead of burning expensive reasoning tokens.
**Boundaries:** Owns the AI service classes, token heuristics, and Watsonx REST APIs. Does NOT touch VS Code APIs or the frontend.
**Deliverables:**
*   **Phase 1:** Port the Python `sentry.py` token-tracking logic to TypeScript. Build the heuristic engine that calculates Granite vs Llama token costs.
*   **Phase 2:** Implement the live Watsonx API client. Wire the `ResourceSentry` to actively intercept and gate MCP tool calls from Bob if a predefined Bobcoin budget limit is threatened.
*   **Phase 3:** Tune the JSON extraction from Granite-8B so that the autonomous worker never passes malformed payloads back to Bob or the `AtomicWriter`.

### 3. The Bob Overlay Architect (Domain: VS Code Webview & UX)
**Focus:** The React application inside the Bob IDE Sidebar. They provide the "Transparent HUD" so the developer knows exactly what Forge and Bob are doing in the background.
**Boundaries:** Owns `renderer/`, CSS theming (matching the Bob IDE styling), and the Webview provider bridge. Does NOT handle filesystem logic or Watsonx calls.
**Deliverables:**
*   **Phase 1:** Port the existing React app (`renderer/`) to load inside the `ForgeSidebarProvider`. Set up UI listeners for the IPC bridge.
*   **Phase 2:** Build the "Active Task" component, visually streaming the steps the IBM Granite contractor is currently executing on behalf of Bob.
*   **Phase 3:** Build the "Bobcoin Fuel Gauge." Implement animations and metrics showing the user exactly how many Bobcoins were *saved* by Forge's Resource Arbitrage. Ensure CSS strictly uses VS Code theme variables to look native to Bob IDE.

---

## 🚀 3-Phase Execution Strategy

### Phase 1: The Bridge & The Budget (Wiring)
*Goal: Get the extension loading inside Bob IDE, register a dummy MCP tool, and establish the UI bridge.*
*   The Extension Engineer connects Forge as an MCP server to Bob.
*   The Economist builds the mock Bobcoin Sentry.
*   The Architect gets the React sidebar rendering with dummy Bobcoin data.

### Phase 2: The Muscle & The Arbitrage (Core Logic)
*Goal: Bob can command the filesystem, and Forge can route tasks to Granite.*
*   The Extension Engineer makes `forge.bulk_write` functional and transactional.
*   The Economist hooks up the live watsonx.ai integration and budget gating.
*   The Architect builds the live stream UI showing the Granite worker in action.

### Phase 3: The Sidecar Polish (Hackathon Integration)
*Goal: The full loop is flawless, and hackathon requirements are met.*
*   The Extension Engineer finalizes the `bob_sessions/` auto-exporter.
*   The Economist hardens the Granite JSON output for flawless code generation.
*   The Architect finalizes the native Bob IDE theming and cost-savings visualizations.