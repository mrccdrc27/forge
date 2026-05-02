# Forge Subsystem Issue Mapping

This document maps the identified architectural and technical issues to their respective subsystems within the Forge project.

## 1. MCP Protocol Hub (`mcp_hub.md`)
* **[Local vs. Cloud Execution Ambiguity](local_vs_cloud_execution.md)** (Low Severity): Clarification needed between local Granite-8B execution and Watsonx API integration for the MVP.
* **["Atomic" Multi-file Write Safety](atomic_bulk_write_rollback.md)** (High Severity): The `forge.bulk_write` tool needs a transactional rollback mechanism to handle partial write failures gracefully and avoid leaving the workspace in a broken state.

## 2. The Ghost Overlay (`overlay.md`)
* **[Electron "Snap to Window" Limitation](electron_snapping_limitation.md)** (Medium Severity): Native limitations prevent Electron from easily tracking and snapping to external IDE window coordinates dynamically.

## 3. Context Engine (`context_engine.md`)
* **[Context Engine Watcher Performance](chokidar_performance.md)** (High Severity): High risk of CPU/memory spikes if `chokidar` doesn't implement strict `.gitignore` or exclusion patterns for large directories like `node_modules` or `.git`.

## 4. Resource Sentry / Resource Manager (`resource_manager.md`)
* **[Task Complexity Prediction Heuristics](task_complexity_routing.md)** (Medium Severity): Algorithmic prediction of task complexity before execution is unreliable; complexity tagging should be delegated to the upstream LLM planner (Llama-3.3).