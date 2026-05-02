# Bob Overlay HUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the React application to the VS Code sidebar and implement the "Bobcoin Fuel Gauge".

**Architecture:** Update `ForgeSidebarProvider` to load the Vite-built React app. Use IPC `postMessage` to communicate between the extension host and the webview. Update the React store to handle Bobcoin data.

**Tech Stack:** React, Vite, Zustand, VS Code Webview API.

---

### Task 1: Renderer Build Integration

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`

- [ ] **Step 1: Update package.json scripts**
Add build scripts for the renderer and update `compile` to include it.

```json
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "npm run build:renderer && tsc -p ./",
    "build:renderer": "vite build",
    "watch": "tsc -watch -p ./",
    "watch:renderer": "vite build --watch",
    "pretest": "npm run compile && npm run lint",
    "lint": "eslint src --ext ts"
  }
```

- [ ] **Step 2: Verify vite build works**
Run: `npm run build:renderer`
Expected: `dist/renderer/index.html` and assets created.

- [ ] **Step 3: Commit**
```bash
git add package.json vite.config.js
git commit -m "build: integrate renderer build into package.json"
```

### Task 2: Webview Bridge Implementation

**Files:**
- Modify: `src/providers/ForgeSidebarProvider.ts`
- Modify: `renderer/index.html`

- [ ] **Step 1: Update ForgeSidebarProvider to load local assets**
Modify `resolveWebviewView` to use `asWebviewUri` for script and style sources.

```typescript
  private getHtml(webview: vscode.Webview, extensionUri: vscode.Uri) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'renderer', 'assets', 'index.js')); // Note: Vite hashes filenames, need to handle that or configure vite to not hash
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'renderer', 'assets', 'index.css'));

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${styleUri}" rel="stylesheet">
</head>
<body>
    <div id="root"></div>
    <script type="module" src="${scriptUri}"></script>
</body>
</html>`;
  }
```

Wait, I should configure Vite to produce predictable filenames for easier loading in the extension.

- [ ] **Step 2: Update vite.config.js for predictable filenames**
```javascript
export default defineConfig({
  root: 'renderer',
  plugins: [react()],
  base: './',
  build: {
    outDir: '../dist/renderer',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  // ...
})
```

- [ ] **Step 3: Update ForgeSidebarProvider.ts with extensionUri**
The provider needs the `extensionUri` to resolve local paths.

- [ ] **Step 4: Commit**
```bash
git add src/providers/ForgeSidebarProvider.ts vite.config.js
git commit -m "feat: implement webview bridge to load React app"
```

### Task 3: Bobcoin Store & Components

**Files:**
- Modify: `renderer/src/store/forge.js`
- Create: `renderer/src/components/BobcoinFuelGauge.jsx`
- Modify: `renderer/src/App.jsx`
- Modify: `renderer/src/App.css`

- [ ] **Step 1: Add Bobcoin state to Zustand store**
```javascript
  // ─── Bobcoins ───────────────────────────────────────────────────────────
  bobcoins: {
    total: 0,
    saved: 0,
    limit: 40
  },
  updateBobcoins: (patch) => set((s) => ({ bobcoins: { ...s.bobcoins, ...patch } })),
```

- [ ] **Step 2: Create BobcoinFuelGauge component**
Implement a visual gauge (e.g., a progress bar or circular gauge) showing current usage vs limit.

- [ ] **Step 3: Integrate into App.jsx**
Add the gauge to the "idle" and "build" views.

- [ ] **Step 4: Commit**
```bash
git add renderer/src/store/forge.js renderer/src/App.jsx
git commit -m "feat: add Bobcoin state and fuel gauge component"
```

### Task 4: Theme Integration & IPC

**Files:**
- Modify: `renderer/src/App.css`
- Modify: `src/providers/ForgeSidebarProvider.ts`

- [ ] **Step 1: Use VS Code CSS variables**
Update `App.css` to use `var(--vscode-*)` for background, foreground, and accent colors.

- [ ] **Step 2: Set up IPC listeners in Renderer**
In `main.jsx` or a hook, listen for `message` events from the window.

- [ ] **Step 3: Commit**
```bash
git add renderer/src/App.css
git commit -m "style: integrate VS Code themes and IPC listeners"
```
