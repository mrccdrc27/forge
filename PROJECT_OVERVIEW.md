# 🔥 Forge Project Overview

**Current Status:** VS Code Extension with MCP Server Integration + Watsonx.ai Resource Arbitrage

---

## 🎯 What is Forge?

Forge is a **VS Code extension** (originally planned as an Electron app) that acts as a "Universal AI Orchestration Sidecar" for IBM Bob IDE. It's designed to win the **IBM Bob Dev Day Hackathon** by demonstrating intelligent resource management and cost optimization.

### Core Value Proposition
> **"Turn a 40 Bobcoin budget into multi-thousand-coin performance through intelligent resource arbitrage"**

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    VS Code Extension                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ForgeController (Extension Host)                     │   │
│  │  ├─ ForgeSidebarProvider (React UI in Webview)       │   │
│  │  ├─ ResourceSentry (Budget Tracking)                 │   │
│  │  ├─ ResourceArbitrator (Task Routing Logic)          │   │
│  │  ├─ WatsonxClient (IBM Watsonx.ai API)               │   │
│  │  ├─ MCPHub (Model Context Protocol Server)           │   │
│  │  ├─ AtomicWriter (Bulk File Operations)              │   │
│  │  ├─ ContextEngine (File System Watching)             │   │
│  │  └─ HistoryExporter (Session Logging)                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              IBM Bob IDE (VS Code-based)                     │
│  Connects to Forge via MCP (http://localhost:3000/sse)      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  IBM Watsonx.ai API                          │
│  ├─ Llama-3.3-70B (Reasoning: 1.0 BC/1k tokens)             │
│  └─ Granite-3-8B (Execution: 0.1 BC/1k tokens)              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 Key Components Explained

### 1. **ResourceArbitrator** (The Brain)
- **Purpose:** Routes tasks to the most cost-effective model
- **Logic:**
  - Planning/Architecture → Llama-3.3-70B (expensive, smart)
  - Implementation/Tests → Granite-3-8B (cheap, fast)
- **Result:** 60-80% cost savings vs. using only premium models

### 2. **ResourceSentry** (The Watchdog)
- **Purpose:** Tracks Bobcoin budget (40 BC limit)
- **Features:**
  - Real-time token usage tracking
  - Cost prediction before execution
  - Budget gating (blocks tasks if budget exceeded)
  - Calculates "saved cost" from using Granite vs. Llama

### 3. **WatsonxClient** (The Executor)
- **Purpose:** Communicates with IBM Watsonx.ai API
- **Features:**
  - OAuth token management
  - Supports both Llama-3.3-70B and Granite-3-8B
  - Mock mode for testing without credentials
  - Structured JSON generation with retry logic

### 4. **MCPHub** (The Bridge)
- **Purpose:** Exposes Forge capabilities via Model Context Protocol
- **MCP Tools Provided:**
  - `forge.ping` - Health check
  - `forge.bulk_write` - Atomic multi-file writes
  - `forge.get_resource_metrics` - Budget/usage stats
  - `forge.scaffold` - Project templates (web/api/cli)
  - `forge.execute_task` - Delegate tasks to Watsonx models
- **Server:** Runs on `http://localhost:3000/sse` (SSE transport)

### 5. **ForgeSidebarProvider** (The UI)
- **Purpose:** Visual dashboard in VS Code sidebar
- **Features:**
  - Bobcoin fuel gauge (budget visualization)
  - Live agent cards showing task progress
  - Budget exceeded alerts
  - Theme-aware (matches VS Code dark/light themes)
  - Built with React + Vite

### 6. **AtomicWriter** (The Safety Net)
- **Purpose:** Bulk file operations with rollback capability
- **Features:**
  - Write multiple files atomically
  - Rollback on failure to prevent partial states

---

## 📊 The "Resource Arbitrage" Strategy

### Problem
AI development is expensive. Using premium models (like GPT-4 or Llama-70B) for everything burns through API budgets quickly.

### Solution
**Intelligent Task Routing:**

| Task Type | Model | Cost (BC/1k tokens) | Use Case |
|-----------|-------|---------------------|----------|
| **Reasoning** | Llama-3.3-70B | 1.0 | Architecture, planning, complex decisions |
| **Execution** | Granite-3-8B | 0.1 | Boilerplate, tests, documentation, repetitive code |

### Example Savings
- **Without Forge:** 10,000 tokens × 1.0 BC = **10 BC**
- **With Forge:** 2,000 tokens (Llama) + 8,000 tokens (Granite) = **2.8 BC**
- **Savings:** **72% reduction** in cost

---

## 🎮 Current Implementation Status

### ✅ Completed
- VS Code extension boilerplate
- MCP server with SSE transport
- Watsonx.ai client with OAuth
- Resource arbitrage routing logic
- Budget tracking and gating
- React-based sidebar UI
- Atomic file writer
- All core services initialized

### 🚧 In Progress / Needs Clarification
- **Bob IDE Integration:** How does Bob connect to the MCP server?
- **Actual Usage:** Has this been tested with real Watsonx.ai credentials?
- **Hackathon Demo:** What specific use case should be demonstrated?

### 📝 Documented But Not Implemented
- History exporter (session logging for judges)
- Context engine (file system watching)
- Template library (beyond basic scaffolds)
- Compliance reporting

---

## 🔑 Key Files to Understand

| File | Purpose |
|------|---------|
| [`src/extension.ts`](src/extension.ts) | Extension entry point, service initialization |
| [`src/ForgeController.ts`](src/ForgeController.ts) | Central coordinator for all services |
| [`src/services/ResourceArbitrator.ts`](src/services/ResourceArbitrator.ts) | Task routing logic |
| [`src/services/WatsonxClient.ts`](src/services/WatsonxClient.ts) | Watsonx.ai API client |
| [`src/services/MCPHub.ts`](src/services/MCPHub.ts) | MCP server implementation |
| [`src/services/ResourceSentry.ts`](src/services/ResourceSentry.ts) | Budget tracking |
| [`src/providers/ForgeSidebarProvider.ts`](src/providers/ForgeSidebarProvider.ts) | VS Code webview UI |
| [`renderer/src/`](renderer/src/) | React UI components |

---

## 🎯 Hackathon Goal

**Demonstrate:** A 40 Bobcoin budget can accomplish what would normally cost 200+ Bobcoins by:
1. Using Bob (Llama-70B) for planning only
2. Delegating execution to Forge (Granite-8B)
3. Showing transparent cost tracking in the UI
4. Proving the system works with a real project build

---

## 🤔 Questions for Clarification

1. **Current State:** Is this extension currently working? Can you activate it in VS Code?
2. **Watsonx Credentials:** Do you have valid credentials in `watson/.env`?
3. **Bob Integration:** How is Bob IDE supposed to discover and connect to the MCP server?
4. **Demo Scenario:** What should the hackathon demo show? (e.g., "Build a todo app", "Refactor a codebase")
5. **Blockers:** What specific part are you "lost" on? The architecture? How to test it? How to connect Bob?
