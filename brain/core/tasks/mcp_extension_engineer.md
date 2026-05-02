# Tasks: MCP & Bob Extension Engineer

## Overview
**Domain:** Bob IDE Integration & Filesystem (`src/`)
**Primary Goal:** Turn Forge into an MCP server connected to IBM Bob, and handle the physical filesystem operations (the "Muscle").
**Hackathon Objective:** Ensure the `bob_sessions/` task history export is automated for judging compliance.

## Phase 1: The Bridge
- [x] Initialize the `@modelcontextprotocol/sdk` Server inside the VS Code Extension Host.
- [x] Register the MCP server with the local IBM Bob IDE.
- [x] Establish a strict, type-safe IPC (`postMessage`) bridge between the Extension Host and the Webview (Sidebar).
- [x] Register dummy tools in the MCP server to verify Bob can see them.

## Phase 2: The Muscle
- [x] Implement the `AtomicWriter` utility to allow transactional bulk file creation (must support rollback on failure).
- [x] Expose `forge.bulk_write` as a fully functional tool to IBM Bob via MCP.
- [x] Expose `forge.scaffold` as an MCP tool to generate standard project structures.
- [x] Expose `forge.get_resource_metrics` to feed Bob the latest budget data.

## Phase 3: The Polish & Hackathon Integration
- [x] Develop the `ContextEngine` to monitor workspace changes (Create/Delete/Modify) and feed this context to Bob.
- [x] Build a service that automatically captures IBM Bob's task history and exports it into the required `bob_sessions/` directory in the project root.
- [x] Conduct end-to-end testing to ensure Bob can command the filesystem flawlessly without corrupting the workspace.
