# Forge: Issue & Risk Tracker
[Back to Core Index](../index.md)

This document maps identified architectural and technical risks to their respective blueprints.

## 🔗 Relationship Mapping
| Risk / Issue | Primary Blueprint | Impact Area |
| :--- | :--- | :--- |
| [[atomic_bulk_write_rollback.md|Atomic Write Safety]] | [[../blueprints/capabilities.md|Execution Tools]] | Workspace Integrity |
| [[chokidar_performance.md|Watcher Performance]] | [[../blueprints/context_engine.md|Context Engine]] | System Resources |
| [[electron_snapping_limitation.md|UI Snapping]] | [[../blueprints/overlay.md|Ghost Overlay]] | User Experience |
| [[task_complexity_routing.md|Task Heuristics]] | [[../blueprints/delegation_model.md|Delegation Model]] | Cost Efficiency |

---

## 🛠️ Detailed Tracking
### 1. MCP Protocol Hub
* **[[local_vs_cloud_execution.md|Local vs. Cloud Ambiguity]]** (Low Severity): Clarification needed between local Granite-8B execution and Watsonx API integration.
* **[[atomic_bulk_write_rollback.md|"Atomic" Multi-file Write Safety]]** (High Severity): Transactional rollback mechanism required.

### 2. The Ghost Overlay
* **[[electron_snapping_limitation.md|Electron Snapping Limitation]]** (Medium Severity): Resolved by pivoting to VS Code Extension. See [[vscode_extension_pivot.md]].

### 3. Context Engine
* **[[chokidar_performance.md|Watcher Performance]]** (High Severity): Risk of CPU spikes; needs strict exclusion patterns.

### 4. Resource Manager
* **[[task_complexity_routing.md|Task Complexity Prediction]]** (Medium Severity): Delegation of tagging to the upstream LLM planner.