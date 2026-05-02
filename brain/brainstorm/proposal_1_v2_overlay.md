# Proposal 1, Var 2: The "Ghost" Overlay
**Category:** UX/UI Innovation

## Concept
A non-intrusive, semi-transparent "ribbon" UI that snaps to the side of the **IBM Bob IDE**.

## Technical Architecture
- **Monitoring:** Node.js file watcher (`chokidar`) tracking the `bob_sessions/` directory.
- **UI:** Electron window with `transparent: true` and `alwaysOnTop: true`.
- **Logic:** As the user works in Bob IDE, Forge "sees" the logs and uses Llama-3.3 to suggest the next command or highlight errors in the overlay.

## Hackathon Advantage
- **Context Preservation:** Developer never has to leave the IDE.
- **Low Friction:** Feels like a native extension of the IBM Bob ecosystem.
- **Visual Impact:** Looks sophisticated and integrated during the demo.
