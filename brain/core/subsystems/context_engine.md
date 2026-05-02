# Subsystem: Context Engine
**Goal:** Feed the AI real-time information from the host IDE and workspace.

## 🛠️ Technical Specs
- **Watcher:** `chokidar` library for filesystem events.
- **Targets:** 
    - Current workspace source files.
    - IDE-specific log files (e.g., `bob_sessions/*.log`).
- **Processing:** 
    - Tail log files to detect completed operations or errors.
    - Extract context from active files to provide the "Insight Bubble."
- **Sync:** Push context updates to the Forge MCP Server.

## 📋 Task Breakdown
- [ ] Set up filesystem watcher for project directory.
- [ ] Implement log parser (with initial support for Bob Shell).
- [ ] Build "Context Snapshot" generator.
- [ ] Optimize performance (ensure zero-latency for the IDE).
