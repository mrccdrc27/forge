# Proposal 3: Forge "UI-to-Code Architect"
**Dimension:** Frontend Productivity

## Overview
User provides a UI description or image path. Forge uses Llama to architect the component hierarchy and Granite to generate the React/Tailwind code. All components are created through Bob Shell to ensure IDE history.

## Technology Stack
- **Vision/Architect:** `meta-llama/llama-3-3-70b-instruct` (via Bob Shell).
- **Component Coder:** `ibm/granite-8b-code-instruct`.
- **Automation:** `bob -p "create react component [name] with [styles]"`.

## End-to-End Use Case
1. **User:** "I need a dashboard layout with a sidebar, a search bar top-nav, and a 3-column grid for metrics."
2. **Planning:** Llama defines `Sidebar.jsx`, `TopNav.jsx`, and `MetricsGrid.jsx`.
3. **Execution:** Granite iterates through components, generating code via Bob.
4. **Verification:** Forge runs `npm run build` or `lint` to ensure visual parity and code quality.
