# Issue: "Atomic" Multi-file Write Safety

**Subsystem:** Core Capabilities / MCP Hub (`capabilities_and_scope.md`, `mcp_hub.md`)
**Severity:** High

## Description
The `forge.bulk_write` tool aims to provide "Atomic Multi-File Writes" to prevent partial state errors when scaffolding or modifying multiple files simultaneously.

## Reality Check
True atomic writes across multiple separate files are very difficult to guarantee on standard operating systems and filesystems without complex transaction mechanisms. If an error occurs midway (e.g., file 3 of 4 fails due to permissions or disk space), the workspace is left in a broken, half-scaffolded state.

## Comprehensive Mitigation Plan
To safely handle multi-file operations and prevent corrupting the user's workspace, we must implement a transactional rollback layer within `forge.bulk_write`:

1. **Pre-flight Verification:** Before any file is modified, the system must verify write permissions for all target paths and ensure target directories exist.
2. **Snapshot/Backup Phase:**
   - For existing files being modified, create temporary copies (e.g., in `.gemini/tmp/forge_backups/<transaction_id>/`).
   - For new files being created, track their exact paths in a transaction log.
3. **Execution Phase:** Attempt to perform all write operations.
4. **Rollback Mechanism (On Failure):**
   - If any write fails (e.g., due to an OS lock, full disk, or unexpected crash), immediately halt the operation.
   - Restore all modified files from their temporary backups.
   - Delete any newly created files tracked in the transaction log.
   - Return a structured error to the AI and IDE, clearly stating which file failed and confirming that the workspace was rolled back to its previous state safely.
5. **Commit/Cleanup (On Success):** Once all writes succeed, silently delete the temporary backup folder.