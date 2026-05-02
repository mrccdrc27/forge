# Proposal 1, Var 1: The MCP Protocol Hub
**Category:** Protocol-Driven Orchestration

## Concept
Forge acts as an **MCP Host** (Model Context Protocol). It exposes IBM Bob Shell and Granite-8B as standardized MCP Servers. 

## Technical Architecture
- **Host:** Electron App (Forge).
- **Servers:** 
    - `bob-shell-server`: Wraps `bob -p` commands into MCP tools.
    - `granite-worker-server`: Wraps Watsonx Orchestrate calls into MCP tools.
- **Client:** Llama-3.3-70B configured to use MCP tool definitions for planning and execution.

## Hackathon Advantage
- **Extensibility:** Easily plug in other MCP servers (e.g., Google Search, GitHub, Slack).
- **Modern Standards:** Demonstrates mastery of the latest industry standards for AI tool-use.
- **Compliance:** Every tool call is structured and logged by the MCP host.
