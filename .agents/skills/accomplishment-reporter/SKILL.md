---
name: accomplishment-reporter
description: Generates a mandatory accomplishment report in `/brain/core/build` after any code modification. Use this at the end of every implementation task to document root tasks, actions taken, and the technical decisions behind them.
---

# Accomplishment Reporter

This skill ensures every coding session concludes with a structured "Accomplishment Report" to maintain a clear audit trail of technical decisions and progress within the `/brain/core/build` directory.

## Mandatory Workflow

1. **Trigger:** Immediately after completing a coding task (Implementation phase) and verifying it (Validation phase).
2. **Path:** All reports MUST be saved to `brain/core/build/`.
3. **Filename:** Use the pattern `[task-name]-[short-id].md`.
    - `[task-name]`: A kebab-case summary of the main task (e.g., `fix-auth-expiry`).
    - `[short-id]`: A random 4-character alphanumeric identifier to prevent collisions.
4. **Action:** Create the file and inform the user of its location.

## Report Template

The report must follow this exact structure:

```markdown
# Accomplishment Report: [Task Title]

- **Status:** Completed
- **Location:** [Relevant File Paths]

## Root Tasks
[List the primary objectives assigned by the user for this session]

## Actions Taken
[Bullet points of the specific technical changes made]

## Technical Decisions & Rationale
[Explain WHY specific paths were chosen. Detail any trade-offs, architectural alignment, or security considerations.]

## Verification Results
[Summary of tests run and confirmation of success]
```

## Example Usage

**Task:** User asked to update the logo and fix a padding issue in the Sidebar.

**Generated Filename:** `sidebar-style-fix-a7b2.md`

**Content:**
```markdown
# Accomplishment Report: Sidebar Styling & Logo Update

- **Status:** Completed
- **Location:** `renderer/src/App.css`, `resources/forge-icon.svg`

## Root Tasks
- Replace placeholder logo with `forge-icon.svg`.
- Resolve inconsistent padding in the sidebar navigation.

## Actions Taken
- Updated `App.css` to use `padding: 1rem` for all `.nav-item` elements.
- Replaced `logo.png` reference with `resources/forge-icon.svg`.
- Adjusted SVG dimensions to fit the header container.

## Technical Decisions & Rationale
- Used `rem` instead of `px` for padding to maintain accessibility and scaling.
- Switched to SVG for the logo to ensure crisp rendering at all zoom levels in the Electron environment.
- Decision: Kept the CSS in `App.css` rather than creating a new module to align with existing project architecture.

## Verification Results
- Visual inspection confirms consistent 1rem padding.
- Logo renders correctly without pixelation.
- Build passed: `npm run build` successful.
```
