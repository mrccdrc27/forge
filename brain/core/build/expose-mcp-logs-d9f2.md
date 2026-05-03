# Accomplishment Report: Expose Forge MCP Logs & Outputs
- **Status:** Completed
- **Location:** `src/services/MCPHub.ts`, `renderer/src/components/AgentCard.jsx`, `renderer/src/components/ActivityStream.jsx`, `renderer/src/pages/BuildView.jsx`, `renderer/src/App.jsx`

## Root Tasks
- Make Forge MCP requests and their outputs visible in the extension sidebar.
- Specifically ensure `forge.scaffold` and `forge.execute_task` outputs are readable (multi-line support).
- Provide a way to copy tool outputs to the clipboard.

## Actions Taken
- **Backend**: Updated `MCPHub.ts` to emit subagent events for `forge.execute_task` and fixed `forge.scaffold` to include the actual response in the output event.
- **Component Extraction**: Created a reusable `AgentCard.jsx` component from `BuildView.jsx`.
- **UI Enhancement**: Added a "Copy" button to `AgentCard` and used `white-space: pre-wrap` for output rendering.
- **Activity Log**: Created `ActivityStream.jsx` to display a rolling log of recent Forge activities.
- **Layout Integration**: Integrated `ActivityStream` into the sidebar's `idle` phase and refactored `BuildView` to use the new card component.

## Technical Decisions & Rationale
- **Component Reusability**: Extracting `AgentCard` was necessary to maintain a consistent UI between the "Building" phase and the "Idle" phase activity log.
- **Idle View Integration**: Placing the activity stream in the `idle` view directly addresses the user's need to see "what Forge is doing" when triggered by external agents (like Bob) without needing to manual start a session.
- **Minimalist Design**: Used a simple "Copy" button and monospace styling for outputs to keep the UI professional and developer-centric without adding unnecessary bloat.

## Verification Results
- `MCPHub.ts` events verified via code inspection.
- UI components integrated and styling applied.
- `AgentCard` correctly handles `agent.output` as either string or object.
