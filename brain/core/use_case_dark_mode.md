# 🎬 End-to-End Use Case: "The 10-Minute Feature"
**User Persona:** Alex, a Developer using an AI-powered IDE.
**Scenario:** Alex needs to add a "Dark Mode" toggle to their React app but is running low on their API token budget.

---

### 1. The Observation (Context Engine)
Alex opens `App.jsx` in the **IDE**. 
*   **Forge's "Ghost" Overlay** (snapped to the edge of the screen) detects the file focus.
*   The **Context Engine** (using Forge's internal `read_file` tool) reads the file.
*   The **Insight Bubble** glows: *"I see hardcoded colors. Want to refactor for Dark Mode?"*

### 2. The Command (User Intent)
Alex clicks the bubble and types: *"Yeah, implement a Dark Mode toggle using CSS variables."*

### 3. The Strategy (Planner: Reasoning Model)
Forge sends the request to the primary reasoning model (e.g., **Llama-3.3-70B**).
*   **Resource-Sentry** estimates the cost and approves.
*   The model generates a structured **JSON Plan**:
    ```json
    {
      "steps": [
        { "action": "create", "path": "src/theme.css", "desc": "Define CSS variables" },
        { "action": "modify", "path": "src/App.jsx", "desc": "Apply variables and toggle" }
      ]
    }
    ```

### 4. The "Ghost" Action (UX Overlay)
The plan appears in the Forge Overlay. Alex clicks **[🚀 Execute Autonomous Build]**.

### 5. The Execution (Worker: Efficient Model)
Forge passes the first task to a cost-effective worker model like **Granite-8B**.
*   The worker generates the actual code for `theme.css`.
*   **Forge (the app)** receives the code and writes it to disk using its internal `write_file` tool.
*   The worker then generates the diff for `App.jsx`. Forge applies it.
*   Alex watches the IDE files update in real-time as Forge writes them.

### 6. The Validation (Feedback Loop)
The reasoning model is called one last time to verify the final state.
*   It checks the file contents: *"Variables present. Toggle logic correct. Build successful."*
*   The **Fuel Gauge** updates to show usage.

### 7. The Result (Compliance/Reporting)
Forge automatically generates a report in the workspace: `forge_sessions/session_dark_mode.md`.
*   *Note: For IBM Bob IDE users, this is written to `bob_sessions/` for native compliance.*

---

### 🏆 The "Wow" Factor
Forge acted as the **Real Agent**. It used high-end reasoning to think and lightweight workers to act. No intermediate chat delays, no "Confirm this command" interruptions. Pure autonomous flow.
