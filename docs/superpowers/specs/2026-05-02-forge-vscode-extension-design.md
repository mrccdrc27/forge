# Forge VS Code Extension Design

> **Status:** Approved (v2: Resilient/Modular)
> **Date:** 2026-05-02
> **Topic:** VS Code Extension Boilerplate for Forge

## 🎯 Goal
Implement the "Universal Sidecar" philosophy as a native VS Code extension. This design prioritizes **flexibility and modifiability** to ensure that failing subsystems do not crash the extension and that components can be swapped or refactored with minimal friction.

## 🏗️ Architecture: The Resilient Sidecar
The extension uses a **Controller/Service** pattern. Subsystems are treated as independent services that are registered and managed by a central `ForgeController`.

### 1. Central Controller (`ForgeController.ts`)
- **Responsibility:** Lifecycle management, event routing, and cross-service coordination.
- **Resilience:** Each service is initialized inside a try-catch block. A failure in the `ContextEngine` won't prevent the `MCPHub` from loading.

### 2. Service Layer (Pluggable Subsystems)
Each subsystem implements a standard `IForgeService` interface.

- **Ghost Overlay (UI Service):**
  - **Flexibility:** The `ForgeSidebar` provider is decoupled from the UI framework. We can swap React for another framework or a different View type without changing the extension logic.
  - **Fault Tolerance:** Uses a standard "Connection Status" protocol to handle Webview crashes or communication timeouts.

- **MCP Hub (Tool Service):**
  - **Flexibility:** Tools are registered dynamically. Adding a new `forge.xxx` tool doesn't require modifying the core extension; just register a new tool handler.
  - **Reliability:** Tool execution is sandboxed with timeouts and standard error reporting back to Bob.

- **Context Engine (Intelligence Service):**
  - **Flexibility:** Watcher rules and exclusion patterns are configuration-driven.
  - **Performance:** Throttled events to prevent VS Code UI lag during high-frequency FS operations.

- **Resource Manager (Economic Service):**
  - **Flexibility:** API providers for Watsonx/Bobcoins are abstracted. If the backend API changes, only the `ResourceProvider` needs an update.

### 3. Communication Bridge
- Uses a **Command/Event Dispatcher**. The UI sends "Commands" to the Host; the Host broadcasts "Events" to the UI.
- No direct coupling between React state and Extension state.

## 🛠️ Project Structure
```text
forge/
├── src/
│   ├── extension.ts              # Entry point
│   ├── ForgeController.ts        # Service Orchestrator
│   ├── providers/
│   │   └── ForgeSidebarProvider.ts # UI View logic
│   ├── services/                 # Modular subsystems
│   │   ├── BaseService.ts        # Abstract class with error handling
│   │   ├── ContextEngine.ts      # FS Watching
│   │   ├── MCPHub.ts             # Tool registration & execution
│   │   └── ResourceManager.ts    # Bobcoin tracking
│   └── interfaces/
│       └── forge.ts              # Unified interfaces for services/tools
├── resources/
└── package.json
```

## ✅ Success Criteria
- **Graceful Degradation:** Extension starts even if one service (e.g., Resource Manager) fails to initialize.
- **Dynamic Tooling:** Successfully register a "test" tool at runtime and invoke it from the UI.
- **Themed UI:** Webview inherits VS Code colors via standard CSS variables.
- **Atomic Rollback:** `bulk_write` tool demonstrates basic "check-then-write" safety.

