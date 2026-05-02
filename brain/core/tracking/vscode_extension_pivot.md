# Resolution: Pivot to VS Code Extension

**Related Issue:** [electron_snapping_limitation.md](./electron_snapping_limitation.md)
**Status:** Proposed / Under Review
**Decision:** Replace the standalone Electron "Ghost Overlay" with a native VS Code Extension Sidebar.

## 🎯 Addressing the Limitation
The primary issue in `electron_snapping_limitation.md` is the inability of a standalone Electron app to reliably track and "snap" to external IDE windows without flaky native OS dependencies. 

By pivoting to a **VS Code Extension**, we inherit the following benefits:
- **Zero-Latency Snapping:** The UI lives inside the VS Code sidebar/panel. VS Code's layout engine handles all docking, resizing, and snapping natively.
- **Native Context:** The extension can access the active editor, file system, and terminal directly via the `vscode` API, fulfilling the "Insight Bubble" requirements without complex IPC or screen scraping.
- **IBM Bob Compatibility:** Since IBM Bob IDE is VS Code-based, the extension is natively compatible.

## 🏗️ Architectural Shift
| Component | Electron Implementation | VS Code Implementation |
| :--- | :--- | :--- |
| **Host Process** | `core/index.js` (Main Process) | `src/extension.ts` (Extension Host) |
| **UI Container** | `BrowserWindow` (Frameless) | `WebviewView` (Sidebar) |
| **Communication** | IPC (invoke/handle) | `postMessage` / `onDidReceiveMessage` |
| **Styling** | Custom Glassmorphism CSS | VS Code Theme Tokens + Custom CSS |

## 🛠️ Implementation Plan (High Level)
1. **Scaffold Extension:** Use `yo code` to create a TypeScript VS Code extension.
2. **Port Frontend:** Move the React-based `renderer/` into the Webview provider.
3. **Bridge Logic:** Replace `ipcMain.handle` in `core/index.js` with message listeners in the Extension Host to trigger Bob Shell and Watsonx.
4. **Themed UI:** Update `App.css` to use VS Code CSS variables (e.g., `--vscode-sideBar-background`) to ensure seamless integration.

## ✅ Success Criteria
- [ ] UI is accessible via a Forge icon in the Activity Bar.
- [ ] UI remains docked and responsive during IDE resize.
- [ ] Extension host can successfully trigger `bob` shell commands.
