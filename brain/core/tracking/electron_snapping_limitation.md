# Issue: Electron "Snap to Window" Limitation

**Subsystem:** The Ghost Overlay (`overlay.md`)
**Severity:** Medium (High risk for hackathon deadline)

## Description
The specification mentions "Snap to Window logic (detecting the host IDE bounds)" for the Electron overlay. Electron cannot natively track the exact screen coordinates of external applications like VS Code or IBM Bob IDE.

## Reality Check
To achieve this, the project would need to rely on native OS modules (such as `active-win` or `node-addon-api` bridging to Windows/macOS accessibility APIs) to retrieve the bounding box of the target IDE window. These native dependencies are historically flaky, difficult to build cross-platform, and hard to get right in a short timeframe.

## Recommendation
For the MVP/Hackathon, mock this behavior or simplify it. Instead of true dynamic snapping to an external process window, provide a manual "docking" toggle (e.g., lock to right-side of screen) or allow the user to drag the transparent overlay into position manually and save those coordinates.

## Resolution
**Resolved:** This issue is bypassed by pivoting from a standalone Electron app to a **VS Code Extension**. See [vscode_extension_pivot.md](./vscode_extension_pivot.md) for the implementation strategy.