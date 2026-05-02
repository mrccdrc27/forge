# Tasks: Bob Overlay Architect

## Overview
**Domain:** VS Code Webview & UX (`renderer/`)
**Primary Goal:** Build the "Transparent HUD" inside the Bob IDE sidebar so developers can see what Forge and Bob are doing in the background.
**Hackathon Objective:** Build the "Bobcoin Fuel Gauge" to visually demonstrate resource savings to the judges.

## Phase 1: The UI Bridge
- [x] Port the existing React application (`renderer/`) to build and load successfully inside the `ForgeSidebarProvider` Webview.
- [x] Configure the Webview Content Security Policy (CSP) to allow local scripts and styles.
- [x] Set up React state listeners to receive IPC (`postMessage`) broadcasts from the Extension Host.
- [x] Create a mock HUD displaying dummy Bobcoin data.

## Phase 2: Streaming The Action
- [x] Build the "Active Task" component. This UI should visually stream the exact steps the IBM Granite contractor is taking on behalf of Bob.
- [x] Implement warning UI states for when the Resource Sentry blocks an action (e.g., "Budget Exceeded" or "Nearing 40 Bobcoin Limit").
- [x] Integrate VS Code CSS theme variables (`var(--vscode-*)`) so the Sidebar UI automatically matches the user's active Bob IDE theme (Light/Dark/High Contrast).

## Phase 3: The Fuel Gauge & Polish
- [x] Build the complete "Bobcoin Fuel Gauge" dashboard component.
- [x] Implement smooth animations and clear metrics showing the user exactly how many Bobcoins were saved by Forge's Resource Arbitrage.
- [x] Polish the UX to ensure it feels like a native, premium feature of the IBM Bob IDE rather than a bolted-on web page.

