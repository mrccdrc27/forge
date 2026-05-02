# 🧠 Forge Core Q&A: VS Code Extension Boilerplate
> **"Transitioning from Standalone App to Universal Sidecar"**

## ❓ Q: Why did Forge pivot from an Electron app to a VS Code Extension?
**A:** Contextual awareness and workspace ergonomics.
- **Window Snapping:** Standalone apps (Electron) require manual resizing and often block the IDE view. VS Code extensions live natively in the sidebar.
- **Native Context:** Extensions have direct access to the `vscode.workspace` and `vscode.window` APIs, allowing Forge to watch files, monitor terminals, and read active tabs without complex "IPC bridges."
- **Low Friction:** Developers stay in the flow. Forge becomes a "tab" in their existing toolkit rather than a separate program to manage.

---

## ❓ Q: How is the new Extension Boilerplate structured for resilience?
**A:** It uses a **Modular Controller/Service** pattern with independent lifecycle management.
- **The Controller (`ForgeController`):** Acts as the "Brain Stem." It initializes subsystems but doesn't crash the whole extension if one fails.
- **Try-Catch Isolation:** Every service (Context Engine, Resource Manager, etc.) is wrapped in defensive initialization. If the "Resource Sentry" fails, the "File Watcher" can still run.
- **BaseService Pattern:** All services inherit from a standard base class, ensuring consistent logging, status reporting, and cleanup (disposal) logic.

---

## ❓ Q: What are the key subsystems implemented in the boilerplate?
**A:** We scaffolded the "Essential Organs" of the Sidecar:
1.  **Context Engine (`ContextEngine`):** Uses the native VS Code `RelativePattern` watcher to track workspace changes (Create/Delete/Modify) in real-time.
2.  **Sidebar Provider (`ForgeSidebarProvider`):** Implements the "Ghost Overlay" using a Webview. It uses VS Code's theme tokens so the UI automatically matches the user's IDE (Dark/Light/High Contrast).
3.  **The Bridge:** A `postMessage` protocol that allows the Webview (UI) to talk to the extension (Muscle) safely.

---

## 🛠️ Architecture Overview: `src/` Layout

| Component | Responsibility | Status |
| :--- | :--- | :--- |
| **ForgeController** | Central orchestration & service registry. | **Implemented** |
| **ContextEngine** | Real-time filesystem monitoring & context feed. | **Implemented** |
| **ForgeSidebarProvider** | Sidebar Webview management & message routing. | **Implemented** |
| **BaseService** | Lifecycle standards (Init, Dispose, Status). | **Implemented** |
| **ResourceManager** | Economic tracking (Bobcoin/Tokens). | *Stubbed* |
| **MCPHub** | Tool registration for IBM Bob integration. | *Stubbed* |

---

## ❓ Q: How does the "Ghost Overlay" maintain high performance?
**A:** By leveraging **Webview Caching** and **Selective Updates**.
- The Sidebar uses `retainContextWhenHidden: true`, so the state doesn't wipe when you switch to the Explorer or Git tab.
- It uses a custom `CSP` (Content Security Policy) to keep it lightweight and secure, only allowing local scripts and styles.
- **CSS Variables:** Instead of hardcoded colors, it uses `--vscode-button-background`, `--vscode-editor-foreground`, etc., ensuring it feels native to any user's setup.

---

## ❓ Q: What is the next step for this VS Code Boilerplate?
**A:** Moving from **Skeleton** to **Sidecar**.
1.  **Porting React:** Injecting the `/renderer` frontend logic into the Webview.
2.  **Tool Injection:** Registering the `MCPHub` tools so Bob IDE can "Command" the extension via JSON-RPC.
3.  **Authentication:** Integrating with Watsonx credentials stored securely in the VS Code `SecretStorage`.

---
**Last Updated:** 2026-05-02
**Status:** Boilerplate Implementation & Design Finalized.
