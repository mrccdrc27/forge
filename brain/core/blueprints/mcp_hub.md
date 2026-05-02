[Back to Core Index](../index.md)

# Subsystem: MCP Protocol Hub
**Goal:** Act as a universal MCP Server that provides any IDE with "Superpowers" (Bulk operations, Autonomous workers, Resource tracking).

## 🛠️ Technical Specs
- **MCP Server:** Forge Node.js Process.
- **Transport:** JSON-RPC over Standard Input/Output (stdio).
- **Client:** Any MCP-compatible IDE (e.g., IBM Bob IDE, VS Code).
- **Exposed Tools:**
    - `forge.scaffold(template_id)`: Bulk-writes a standard project structure.
    - `forge.bulk_write(files[])`: Writes multiple files to disk simultaneously.
    - `forge.run_autonomous_worker(instruction)`: Routes a specific coding task to Forge's internal worker model.
    - `forge.get_resource_metrics()`: Returns current API budget usage and predicted cost.
    - `forge.sync_context()`: Pushes the latest IDE file context to Forge's internal memory.

## 📋 Task Breakdown
- [ ] Initialize `@modelcontextprotocol/sdk` Server.
- [ ] Implement the `forge.*` tool handlers.
- [ ] Create the Watsonx/Granite bridge for the `autonomous_worker` tool.
- [ ] Documentation on how to add Forge to various IDEs (Bob, VS Code).
