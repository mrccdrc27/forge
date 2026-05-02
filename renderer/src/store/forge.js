import { create } from 'zustand'

/**
 * App phases — the main state machine
 * idle → selecting → planning → building → verifying → done
 */

export const useForgeStore = create((set, get) => ({
  // ─── Phase ───────────────────────────────────────────────────────────────
  phase: 'idle', // idle | selecting | planning | building | verifying | done | error
  setPhase: (phase) => set({ phase }),

  // ─── Project ─────────────────────────────────────────────────────────────
  projects: [],
  currentProject: null,
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),

  // ─── User prompt ─────────────────────────────────────────────────────────
  userPrompt: '',
  setUserPrompt: (userPrompt) => set({ userPrompt }),

  // ─── Bob stream ──────────────────────────────────────────────────────────
  bobStream: '',        // live character stream from Bob Shell
  bobThinking: false,
  appendBobStream: (chunk) => set((s) => ({ bobStream: s.bobStream + chunk })),
  clearBobStream: () => set({ bobStream: '' }),
  setBobThinking: (bobThinking) => set({ bobThinking }),

  // ─── Master plan ─────────────────────────────────────────────────────────
  masterPlan: null,     // { summary, stack, tasks: [...], estimate }
  setMasterPlan: (masterPlan) => set({ masterPlan }),

  // ─── Subagents ───────────────────────────────────────────────────────────
  // Each task from masterPlan becomes a subagent
  subagents: [],        // [{ id, name, description, status, output, error }]
  spawnSubagent: (task) => set((s) => ({
    subagents: [...s.subagents, {
      id: task.id,
      name: task.name,
      description: task.description,
      status: 'queued', // queued | running | done | failed
      output: null,
      error: null
    }]
  })),
  updateSubagent: (id, patch) => set((s) => ({
    subagents: s.subagents.map(a => a.id === id ? { ...a, ...patch } : a)
  })),
  clearSubagents: () => set({ subagents: [] }),

  // ─── Verification ────────────────────────────────────────────────────────
  verificationReport: null,   // { passed: [], failed: [], verdict: 'pass'|'retry' }
  setVerificationReport: (verificationReport) => set({ verificationReport }),
  iteration: 0,
  incrementIteration: () => set((s) => ({ iteration: s.iteration + 1 })),

  // ─── Error ───────────────────────────────────────────────────────────────
  error: null,
  setError: (error) => set({ error, phase: 'error' }),

  // ─── Reset ───────────────────────────────────────────────────────────────
  reset: () => set({
    phase: 'idle',
    userPrompt: '',
    bobStream: '',
    bobThinking: false,
    masterPlan: null,
    subagents: [],
    verificationReport: null,
    iteration: 0,
    error: null
  })
}))
