# Forge VS Code Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a modular, resilient VS Code extension for Forge featuring a sidebar Webview, a dynamic MCP tool bridge, and a native filesystem watcher.

**Architecture:** Controller/Service pattern where a central `ForgeController` manages independent, pluggable services (ContextEngine, MCPHub, ResourceManager).

**Tech Stack:** TypeScript, VS Code API, Node.js.

---

### Task 1: Project Scaffolding & Manifest

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.vscodeignore`

- [ ] **Step 1: Create the extension manifest**
Define the Forge extension, its sidebar contribution point, and commands.

```json
{
  "name": "forge",
  "displayName": "Forge",
  "description": "The Universal Sidecar for AI Orchestration",
  "version": "0.1.0",
  "engines": { "vscode": "^1.85.0" },
  "categories": [ "Other" ],
  "activationEvents": [],
  "main": "./dist/extension.js",
  "contributes": {
    "viewsContainers": {
      "activitybar": [
        { "id": "forge-sidebar", "title": "Forge", "icon": "resources/forge-icon.svg" }
      ]
    },
    "views": {
      "forge-sidebar": [
        { "type": "webview", "id": "forge.sidebar", "name": "Forge Control" }
      ]
    },
    "commands": [
      { "command": "forge.refresh", "title": "Forge: Refresh UI", "icon": "$(refresh)" }
    ]
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./",
    "pretest": "npm run compile && npm run lint",
    "lint": "eslint src --ext ts"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@types/vscode": "^1.85.0",
    "@types/node": "18.x",
    "typescript": "^5.3.3",
    "eslint": "^8.56.0"
  }
}
```

- [ ] **Step 2: Initialize TypeScript config**
Configure TS for VS Code extension development.

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2022",
    "outDir": "dist",
    "lib": ["ES2022"],
    "sourceMap": true,
    "strict": true,
    "rootDir": "src"
  },
  "exclude": ["node_modules", ".vscode-test"]
}
```

- [ ] **Step 3: Create .vscodeignore**
```text
.vscode/**
.vscode-test/**
out/**
node_modules/**
src/**
.gitignore
.yarnrc
tsconfig.json
package-lock.json
**/test/**
```

- [ ] **Step 4: Commit scaffold**
```bash
git add package.json tsconfig.json .vscodeignore
git commit -m "chore: scaffold extension manifest and tsconfig"
```

### Task 2: Core Interfaces & Base Service

**Files:**
- Create: `src/interfaces/forge.ts`
- Create: `src/services/BaseService.ts`

- [ ] **Step 1: Define Forge interfaces**
Define the standard interface every subsystem must implement.

```typescript
export interface IForgeService {
  id: string;
  init(): Promise<void>;
  dispose(): void;
}

export interface ForgeCommand {
  type: string;
  payload?: any;
}
```

- [ ] **Step 2: Create Abstract Base Service**
Provide default error handling and logging for all services.

```typescript
import * as vscode from 'vscode';
import { IForgeService } from '../interfaces/forge';

export abstract class BaseService implements IForgeService {
  constructor(public readonly id: string, protected output: vscode.OutputChannel) {}
  abstract init(): Promise<void>;
  abstract dispose(): void;

  protected log(message: string) {
    this.output.appendLine(`[${this.id}] ${message}`);
  }
}
```

- [ ] **Step 3: Commit architecture base**
```bash
git add src/interfaces/forge.ts src/services/BaseService.ts
git commit -m "feat: add base service and interfaces"
```

### Task 3: The Forge Controller

**Files:**
- Create: `src/ForgeController.ts`
- Create: `src/extension.ts`

- [ ] **Step 1: Implement Service Orchestrator**
Create the central controller that manages service lifecycles.

```typescript
import * as vscode from 'vscode';
import { IForgeService } from './interfaces/forge';

export class ForgeController {
  private services: Map<string, IForgeService> = new Map();
  private output = vscode.window.createOutputChannel("Forge");

  async registerService(service: IForgeService) {
    try {
      await service.init();
      this.services.set(service.id, service);
    } catch (err) {
      vscode.window.showErrorMessage(`Forge service [${service.id}] failed: ${err}`);
    }
  }

  dispose() {
    for (const service of this.services.values()) {
      service.dispose();
    }
    this.output.dispose();
  }
}
```

- [ ] **Step 2: Hook into Extension Entry**
Activate the controller in `extension.ts`.

```typescript
import * as vscode from 'vscode';
import { ForgeController } from './ForgeController';

let controller: ForgeController;

export function activate(context: vscode.ExtensionContext) {
  controller = new ForgeController();
  context.subscriptions.push(controller);
}

export function deactivate() {
  if (controller) controller.dispose();
}
```

- [ ] **Step 3: Commit controller**
```bash
git add src/ForgeController.ts src/extension.ts
git commit -m "feat: add main extension controller and entry point"
```

### Task 4: Sidebar Webview Provider

**Files:**
- Create: `src/providers/ForgeSidebarProvider.ts`

- [ ] **Step 1: Implement WebviewViewProvider**
Create the provider that loads the UI into the sidebar.

```typescript
import * as vscode from 'vscode';

export class ForgeSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'forge.sidebar';

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this.getHtml(webviewView.webview);
    
    webviewView.webview.onDidReceiveMessage(data => {
      vscode.window.showInformationMessage(`Forge UI: ${data.text}`);
    });
  }

  private getHtml(webview: vscode.Webview) {
    return `<!DOCTYPE html><html><body><h1>Forge Overlay</h1><button onclick="post()">Ping Host</button>
    <script>const vscode = acquireVsCodeApi(); function post(){ vscode.postMessage({text:'Hello from Ghost Overlay'}); }</script></body></html>`;
  }
}
```

- [ ] **Step 2: Register Provider in Controller**
Update `ForgeController` to register the sidebar provider.

- [ ] **Step 3: Commit UI bridge**
```bash
git add src/providers/ForgeSidebarProvider.ts src/ForgeController.ts
git commit -m "feat: add sidebar webview provider"
```

### Task 5: Context Engine (FS Watcher)

**Files:**
- Create: `src/services/ContextEngine.ts`

- [ ] **Step 1: Implement native FS watcher**
Create a resilient service that tracks workspace changes.

```typescript
import * as vscode from 'vscode';
import { BaseService } from './BaseService';

export class ContextEngine extends BaseService {
  private watcher?: vscode.FileSystemWatcher;

  async init() {
    this.watcher = vscode.workspace.createFileSystemWatcher('**/*');
    this.watcher.onDidCreate(uri => this.log(`File Created: ${uri.fsPath}`));
    this.watcher.onDidDelete(uri => this.log(`File Deleted: ${uri.fsPath}`));
    this.log("Context Engine Active.");
  }

  dispose() { this.watcher?.dispose(); }
}
```

- [ ] **Step 2: Register in Controller**
Update `ForgeController` to include `ContextEngine`.

- [ ] **Step 3: Commit Context Engine**
```bash
git add src/services/ContextEngine.ts src/ForgeController.ts
git commit -m "feat: add context engine with native fs watcher"
```
