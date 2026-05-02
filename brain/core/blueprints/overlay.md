[Back to Core Index](../index.md)

# Subsystem: Forge VS Code Extension (The Sidebar)

> **CORE DEFINITION:** Forge is a native VS Code Extension designed to provide an integrated AI orchestration interface. It is NOT a standalone application.

**Goal:** Provide a non-intrusive AI companion UI integrated directly into the VS Code / IBM Bob development environment as a native Sidebar View.

## 🛠️ Technical Specs
- **Architecture:** VS Code Extension.
- **UI Container:** `WebviewView` (Side Bar / Activity Bar).
- **Positioning:** Natively managed by VS Code Sidebar/Panel docking logic.
- **Interactivity:** Persistent access via Activity Bar icon; keyboard-accessible via VS Code commands.
- **Key Components:**
    - **Status Bar:** Shows current AI "Thinking" state and worker status.
    - **Fuel Gauge:** Real-time API budget consumption visualizer.
    - **Action Ribbon:** One-click approval for autonomous execution steps.
    - **Insight Bubble:** Contextual tips based on the `activeTextEditor` context.

## 🏗️ Architecture Shift (Pivot)
The project has pivoted from a standalone Electron "Ghost Overlay" to a **VS Code Extension** to solve window-tracking limitations and ensure deep integration with the IBM Bob IDE environment.
- **Host:** `extension.ts` (VS Code Extension Host).
- **Frontend:** React-based Webview.
- **Styling:** Adheres to VS Code Theme tokens (`--vscode-background`, etc.) while maintaining the "Glassmorphism" brand aesthetic.

## 📋 Task Breakdown
- [x] ~~Research `win.setIgnoreMouseEvents` for click-through behavior.~~ (Obsolete: Using native Sidebar)
- [x] ~~Implement "Snap to Window" logic (detecting host IDE bounds).~~ (Resolved: Native VS Code layout)
- [ ] Port React UI to VS Code Webview Provider.
- [ ] Implement `postMessage` bridge for Bob Shell execution.
- [ ] Design CSS using VS Code color tokens for seamless integration.
- [ ] Connect Fuel Gauge to `resource_manager` state.
