# Tasks: MCP & Bob Extension Engineer

## Overview
**Domain:** Bob IDE Integration & Filesystem (`src/`)
**Primary Goal:** Turn Forge into an MCP server connected to IBM Bob, and handle the physical filesystem operations (the "Muscle").
**Hackathon Objective:** Ensure the `bob_sessions/` task history export is automated for judging compliance.

## Phase 1: The Bridge
- [ ] Initialize the `@modelcontextprotocol/sdk` Server inside the VS Code Extension Host.
- [ ] Register the MCP server with the local IBM Bob IDE.
- [ ] Establish a strict, type-safe IPC (`postMessage`) bridge between the Extension Host and the Webview (Sidebar).
- [ ] Register dummy tools in the MCP server to verify Bob can see them.

## Phase 2: The Muscle
- [ ] Implement the `AtomicWriter` utility to allow transactional bulk file creation (must support rollback on failure).
- [ ] Expose `forge.bulk_write` as a fully functional tool to IBM Bob via MCP.
- [ ] Expose `forge.scaffold` as an MCP tool to generate standard project structures.
- [ ] Expose `forge.get_resource_metrics` to feed Bob the latest budget data.

## Phase 3: The Polish & Hackathon Integration
- [ ] Develop the `ContextEngine` to monitor workspace changes (Create/Delete/Modify) and feed this context to Bob.
- [ ] Build a service that automatically captures IBM Bob's task history and exports it into the required `bob_sessions/` directory in the project root.
- [ ] Conduct end-to-end testing to ensure Bob can command the filesystem flawlessly without corrupting the workspace.
