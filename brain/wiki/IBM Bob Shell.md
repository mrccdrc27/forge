---
tags: [ibm bob, shell, cli]
source: IBM-Bob-Dev-Day-hackathon-guide.pdf
date: 2026-05-02
---
[Back to Index](../meta/index.md)

# IBM Bob Shell

IBM Bob Shell brings the reasoning-focused AI capabilities of IBM Bob directly to the command line. It is optimized for shell environments, automated processes, and scripting, offering full workspace awareness and context-driven assistance.

## Overview
*   **Status:** Optional for the IBM Bob Dev Day Hackathon.
*   **Context Awareness:** Aware of current directory and codebase.
*   **Integration:** Can be integrated with [[IBM Bob IDE]] for workspace awareness and exporting session reports.

## Installation and Requirements
### System Requirements
*   **OS:** macOS, Linux, or Windows.
*   **Node.js:** Version 22.15.0 or later.
*   **Hardware:** Minimum 4 GB RAM (8 GB recommended), 500 MB disk space.

### Installation Methods
*   **macOS/Linux:** `curl -fsSL https://bob.ibm.com/download/bobshell.sh | bash`
*   **Windows (PowerShell):** `powershell -ep Bypass 'irm -Uri "https://bob.ibm.com/download/bobshell.ps1" | iex'`
*   **Package Managers:** Installable via `npm`, `pnpm`, or `yarn`.
*   **Via Bob IDE:** Open command palette (`Ctrl+Shift+P`), run `bobide`, then `run bobshell`.

## Authentication
*   **Interactive (Default):** Prompts for authentication via browser and IBMid.
*   **Automation/CI:** Use an API Key via the `BOBSHELL_API_KEY` environment variable.
    *   Command: `bob --auth-method api-key -p "Instruction"`

## Core Concepts: Tools
Bob Shell uses specialized tools to interact with your codebase. You provide intent, and Bob selects the appropriate tool, which you review before execution.

| Category | Tools | Purpose |
| :--- | :--- | :--- |
| **Read** | `read_file`, `search_files`, `list_files` | Understand code structure and find patterns. |
| **Write** | `write_to_file`, `apply_diff` | Create files or make targeted edits/refactors. |
| **Command** | `execute_command` | Run CLI operations (build, test, install). |
| **MCP** | `use_mcp_tool` | Connect to external services via Model Context Protocol. |
| **Mode** | `switch_mode` | Toggle personas (e.g., Plan, Code, Architect). |

## Session Modes
### Interactive Session
*   **Start:** Run `bob` in the terminal.
*   **Shell Mode:** Type `!` to enter shell mode for running standard terminal commands. Press `ESC` or type `!` again to exit back to the AI prompt.

### Non-Interactive Session
*   **Start:** Use the `-p` flag: `bob -p "Prompt"`.
*   **Piping:** Supports piping input to Bob: `npm run start 2>&1 | bob -p "Fix this error"`.
*   **Use Cases:** Automation, CI/CD pipelines, scripting, and batch processing.

## Configuration
*   **[[.bobignore]]:** Control file access for Bob Shell.
*   **Custom Rules:** Define coding standards and response styles.
*   **Custom Modes:** Create specialized personas for specific workflows.

## Usage Examples

### Fixing Errors in Shell Commands
```bash
# Start Bob Shell
bob
# Switch to shell mode and run command
> !
> make build
# Error appears? Exit shell mode (ESC) and ask:
> Help me to fix the error
```

### Code Explanation and Improvement
```bash
# Ask for an explanation of a specific file
> Explain what @src/utils.js does and how it works

# Request improvements for error handling
> Review @src/api.js and suggest improvements for error handling
```

### Creating New Files and Features
```bash
# Create a new React component
> Create a React component for a user profile page with name, email, and avatar

# Generate a utility function
> Write a utility function that formats dates in YYYY-MM-DD format
```

### Debugging Assistance
```bash
# Share error logs with context
> I'm getting "TypeError: Cannot read property 'map' of undefined". Relevant code: @src/components/List.js

# Or pipe output directly (from terminal)
npm run start 2>&1 | bob -p "Help me understand and fix this error"
```

### Documentation and Learning
```bash
# Generate JSDoc
> Create JSDoc comments for all functions in @src/helpers.js

# Learn concepts
> Explain how React hooks work and give me examples of useState and useEffect
```

## References
*   [Official Shell Docs](https://bob.ibm.com/docs/shell/getting-started/install-and-setup)
*   [Usage Examples](https://bob.ibm.com/docs/shell/getting-started/bobshell-examples)
*   [Core Concepts: Tools](https://bob.ibm.com/docs/shell/core-concepts/tools)
*   [[IBM Bob Dev Day Hackathon]] guide.
