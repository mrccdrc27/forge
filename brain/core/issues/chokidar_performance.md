# Issue: Context Engine Watcher Performance

**Subsystem:** Context Engine (`context_engine.md`)
**Severity:** High

## Description
The Context Engine plans to use the `chokidar` library for filesystem events across the workspace to feed real-time information to the AI, aiming for "zero-latency for the IDE".

## Reality Check
While Node.js is asynchronous, running a recursive `chokidar` watcher on a large project directory (especially ones containing massive `node_modules`, `.git`, or build artifact directories) will severely spike the developer's CPU and memory consumption. This will introduce the exact latency the system is trying to avoid.

## Comprehensive Mitigation Plan
To ensure the Context Engine remains invisible and lightweight, the filesystem watcher must be highly restrictive:

1. **Strict Default Ignores:** Hardcode core exclusions directly into the `chokidar` configuration (`node_modules`, `.git`, `dist`, `build`, `.next`, `coverage`, `.gemini`, `*.log`). These folders contain high-churn, non-user-authored code.
2. **`.gitignore` Integration:** Parse the project's `.gitignore` file on startup and pass those rules into the watcher. If Git ignores it, the AI should ignore it.
3. **Event Debouncing & Throttling:** 
   - Never react instantly to a single file event. Use a debounce timer (e.g., 300-500ms) to batch multiple rapid changes into a single evaluation cycle.
   - Implement an event throttle. If the watcher receives >1000 events in a 2-second window (e.g., a massive branch switch or npm install), temporarily pause indexing and schedule a full re-scan later.
4. **Depth/File Limit Caps:** Introduce a hard cap on the number of files watched (e.g., max 10,000 files). If a project exceeds this, gracefully downgrade to polling or require the user to define a custom `.forgeignore` file.