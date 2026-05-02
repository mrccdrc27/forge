# 🦾 Forge: Core Map of Content (MOC)
> **"The Universal Sidecar for AI Orchestration"**

This index serves as the primary entry point for the Forge project documentation. It defines the relationships between strategic intent, technical blueprints, and active lifecycle tracking.

---

## 🧭 Tier 1: Strategic Intent
*High-level vision, scope boundaries, and the project manifesto.*

- [[intent/manifesto.md|Manifesto]]: The "Universal Sidecar" philosophy and the resource war problem.
- [[intent/scope.md|Capabilities & Scope]]: Explicit definition of MVP vs. Future goals.

---

## 🏗️ Tier 2: Technical Blueprints
*Detailed specifications for subsystems and AI-driven logic.*

### Knowledge Base
- [[answers/index.md|Q&A]]: Strategic alignment on Bob vs. Forge and the Sidecar philosophy.
- [[answers/watson_experiments.md|Watson Experiments]]: Technical findings from core feature validation.

### Core Orchestration
- [[blueprints/mode_definition.md|Forge Mode]]: Persona and prompt engineering for IBM Bob integration.
- [[blueprints/delegation_model.md|Delegation Model]]: The "Architect vs. Contractor" logic (Llama vs. Granite).
- [[blueprints/mcp_hub.md|MCP Hub]]: The Model Context Protocol server implementation.

### Subsystems
- [[blueprints/context_engine.md|Context Engine]]: Passive context synchronization and filesystem watching.
- [[blueprints/overlay.md|Ghost Overlay]]: Electron-based transparent HUD and "Fuel Gauge" UI.
- [[blueprints/resource_manager.md|Resource Manager]]: Arbitrage logic and cost-prediction sentries.

### Domain Features
- [[blueprints/capabilities.md|Execution Tools]]: Details on Bulk Write, Scaffold, and Shell automation.
- [[blueprints/resource_arbitrage.md|Arbitrage Economics]]: How Forge optimizes token spend.
- [[blueprints/scopes.md|Domain Optimization]]: Specific stacks where Forge excels.

---

## 🚀 Tier 3: Lifecycle & Tracking
*Active issues, milestones, and implementation history.*

- [[tracking/milestones.md|Project Roadmap]]: Phase-by-phase launch plan (Day 0.5 to Day 2.0).
- [[tracking/index.md|Issue Tracker]]: Central dashboard for all technical risks and bugs.

### Technical Debt & Decisions
- [[tracking/vscode_extension_pivot.md|VS Code Pivot]]: Rationale for switching from standalone Electron to Extension.
- [[tracking/atomic_bulk_write_rollback.md|Atomic Writes]]: Solving the partial-write failure risk.
- [[tracking/chokidar_performance.md|Watcher Perf]]: Optimization strategies for high-volume FS watching.
- [[tracking/electron_snapping_limitation.md|Window Snapping]]: Analysis of native coordinate tracking.
- [[tracking/local_vs_cloud_execution.md|Execution Latency]]: Balancing local Granite vs. Watsonx API.
- [[tracking/task_complexity_routing.md|Task Heuristics]]: How complexity is judged before delegation.

---

## 🗄️ Archive
- [[archive/|Legacy Proposals]]: Deprecated strategies and early brainstorms.

---
**Last Updated:** 2026-05-02
**Status:** Structural Integrity Verified.
