[Back to Core Index](../index.md)

# 🎬 End-to-End Use Case: "The 0-Coin Scaffold"
**User Persona:** Alex, starting a new project.
**Scenario:** Alex needs to scaffold a Full-Stack React + FastAPI application. Doing this through a conversational AI chat could cost significant API tokens (or Bobcoins) just for boilerplate and "I'm working on it" conversational filler.

---

### 1. The Project Spark (Forge Launcher)
Alex opens Forge and selects **"New Project: Full-Stack Scaffolder"**.
*   Instead of a chat box, Forge presents a **Config Matrix**: 
    - [x] React (Vite)
    - [x] FastAPI (Python)
    - [x] Dockerized
    - [x] Design System (e.g. Carbon or Tailwind)

### 2. The Smart Routing (Resource Optimization)
Alex clicks **"Generate Boilerplate"**.
*   **Resource-Sentry** intercepts: *"This is a standard template task. No high-level reasoning required."*
*   **Strategy:** Forge skips the expensive reasoning model. It pulls the core scaffold from Forge's **Local Template Library** and only uses a lightweight model like **Granite-8B** to customize naming and routes.
*   **Cost:** Estimated **90% savings** compared to chat-based generation.

### 3. The Autonomous Build (Direct Action)
Forge begins the "Bulk Write" phase.
*   The worker model generates the specific `main.py` and `App.jsx` content.
*   **Forge (Node.js)** performs a multi-file write in a single burst:
    - Writes `frontend/` (Vite, React, components).
    - Writes `backend/` (FastAPI, requirements.txt, sample routes).
    - Writes `docker-compose.yml`.
*   Alex watches the folder populate in their IDE sidebar in under 10 seconds.

### 4. The Tool Injection (Dependency Sync)
Forge doesn't just write files; it acts.
*   It automatically executes `npm install` and `pip install -r requirements.txt` in the background via its internal `execute_shell` tool.
*   The **Ghost Overlay** shows a progress bar: *"Installing dependencies... [################----] 80%"*.

### 5. The "Session History" (Reporting)
Forge generates a **Session Report** in `forge_sessions/init_project.md`.
*   It writes a detailed log of the autonomous actions, model thoughts, and shell outputs.
*   *Note: For Bob IDE users, this serves as the "Synthetic Session" for hackathon compliance.*

### 6. The Hand-off (Ready for Reasoning)
Forge signals Alex: *"Scaffold complete. Workspace ready for high-level logic."*
*   Alex now has their full budget intact and a working environment. They saved the "expensive" AI logic for actual innovation, not the boilerplate.

---

### 🏆 The Value Prop
**Efficiency over Conversation.** While chat-first AI "thinks" through every file (consuming tokens/budget), Forge is **action-first**. It treats boilerplate as a commodity, preserving the developer's budget for the hardest 10% of the project.
