# ⬡ Forge

> Describe what you want to build. Bob plans it. Watson builds it.

---

## Architecture

```
Forge (Electron Desktop App)
├── Bob Shell         — planning + verification (non-interactive, cheap calls)
├── Watsonx Orchestrate — subagent execution (boilerplate, tests, push)
└── Cloudant / Code Engine — storage + runtime (IBM Cloud provisioned)
```

### The loop

```
User prompt
  → Bob: master plan (structured JSON, one call)
  → Orchestrate: spawn one agent per task (parallel)
  → Bob: verify outputs (one call, reads summaries not full files)
  → Retry failed tasks (max 3 iterations)
  → Done
```

Bob is used **twice per iteration** — plan and verify. It never reads the full codebase.
Orchestrate does the volume work.

---

## Setup

### Prerequisites
- Node.js 20+
- Bob Shell installed and authenticated (`bob --version`)
- IBM Cloud account with Watsonx Orchestrate access

### Environment variables
Create a `.env` file in the root:

```
WATSON_API_KEY=your_orchestrate_api_key
WATSON_INSTANCE_URL=https://your-orchestrate-instance.ibm.com
```

### Install

```bash
# Root dependencies (Electron)
npm install

# Renderer dependencies (React + Vite)
cd renderer && npm install && cd ..
```

### Run in dev

```bash
npm run dev
```

---

## Project structure

```
forge/
├── src/
│   └── main/
│       ├── index.js          # Electron main process, IPC handlers
│       └── preload.js        # Context bridge (main ↔ renderer)
├── renderer/
│   ├── index.html
│   └── src/
│       ├── App.jsx           # Phase router
│       ├── app.css
│       ├── store/
│       │   └── forge.js      # Zustand state machine
│       ├── hooks/
│       │   └── useForgeOrchestrator.js  # Main workflow engine
│       └── pages/
│           ├── ProjectSelect.jsx
│           ├── PromptInput.jsx
│           ├── BuildView.jsx  # Live Bob stream + agent cards
│           └── DoneView.jsx
├── package.json
└── vite.config.js
```

---

## What's stubbed / TODO

- [ ] `orchestrate:spawn` → wire to real Orchestrate agent endpoint
- [ ] Code Engine execution bridge (run generated code, capture stdout)
- [ ] Bob Shell binary path config (currently assumes `bob` is on PATH)
- [ ] Cloudant persistence for project history
- [ ] File output viewer in DoneView
