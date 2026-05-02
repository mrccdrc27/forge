# Forge VS Code Extension Design

> **Status:** Approved
> **Date:** 2026-05-02
> **Topic:** VS Code Extension Boilerplate for Forge

## 🎯 Goal
Implement the "Universal Sidecar" philosophy as a native VS Code extension. This extension replaces the standalone Electron app to provide a docked, zero-latency "Ghost Overlay" UI and a robust tool bridge for AI orchestration via IBM Bob.

## 🏗️ Architecture
The extension follows an **Integrated Orchestrator** pattern, mapping the core Forge blueprints into native VS Code subsystems.

### 1. The Ghost Overlay (UI)
- **Container:** VS Code Sidebar Webview (`WebviewViewProvider`).
- **Tech:** React (Vite-based) loaded into the Webview.
- **Communication:** `postMessage` bridge for two-way communication between the UI and the Extension Host.
- **Styling:** Uses VS Code theme tokens (`--vscode-sideBar-background`, etc.) to match the IDE.

### 2. The MCP Hub (Tools)
- **Purpose:** Expose local capabilities to IBM Bob.
- **Initial Tools:**
  - `forge.scaffold`: Project initialization templates.
  - `forge.bulk_write`: Transactional multi-file writing.
  - `forge.execute_task`: Delegation to local Granite/Watsonx workers.

### 3. The Context Engine (Intelligence)
- **Mechanism:** Native `vscode.workspace.createFileSystemWatcher`.
- **Function:** Monitors file changes and provides workspace context to the AI during orchestration tasks.

### 4. The Resource Manager (Economics)
- **Purpose:** Track Bobcoin usage ("Fuel Gauge").
- **Integration:** Interfaces with Watsonx APIs to predict and monitor token costs.

## 🛠️ Project Structure
```text
forge/
├── src/
│   ├── extension.ts          # Main entry & subsystem activation
│   ├── providers/
│   │   └── ForgeSidebar.ts   # Sidebar Webview Provider
│   ├── core/
│   │   ├── mcp.ts            # MCP Tool logic
│   │   ├── context.ts        # FS Watcher logic
│   │   └── resource.ts       # Bobcoin tracking
│   └── types/
│       └── forge.d.ts        # Shared types
├── resources/
│   └── forge-icon.svg        # Activity Bar icon
├── package.json              # Extension manifest
└── tsconfig.json             # TypeScript configuration
```

## ✅ Success Criteria
- Sidebar UI is accessible via the Forge icon in the Activity Bar.
- The UI responds to theme changes natively.
- Basic "Hello Forge" message can be sent from the UI to the Extension Host.
- The FS Watcher logs file additions/deletions to the Output channel.
