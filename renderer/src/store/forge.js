import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * VS Code Webview State Adapter
 * Uses the acquireVsCodeApi() state persistence
 */
const vscodeStorage = {
  getItem: (name) => {
    const state = window.vscode?.getState();
    return state ? state[name] : null;
  },
  setItem: (name, value) => {
    const state = window.vscode?.getState() || {};
    window.vscode?.setState({ ...state, [name]: value });
  },
  removeItem: (name) => {
    const state = window.vscode?.getState() || {};
    delete state[name];
    window.vscode?.setState(state);
  }
};

/**
 * App phases — the main state machine
 * idle → selecting → planning → building → verifying → done
 */

export const useForgeStore = create(
  persist(
    (set, get) => ({
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

      // ─── Bobcoins ───────────────────────────────────────────────────────────
      bobcoins: {
        total: 24,
        saved: 12,
        limit: 40
      },
      updateBobcoins: (patch) => set((s) => ({ bobcoins: { ...s.bobcoins, ...patch } })),

      // ─── Error ───────────────────────────────────────────────────────────────
      error: null,
      setError: (error) => set({ error, phase: 'error' }),

      // ─── Chat History ───────────────────────────────────────────────────────
      chatHistory: [], // [{ role: 'user' | 'bob', content: string }]
      addChatMessage: (role, content) => set((s) => ({
        chatHistory: [...s.chatHistory, { role, content }]
      })),
      clearChatHistory: () => set({ chatHistory: [] }),

      // ─── Reset ───────────────────────────────────────────────────────────────
      reset: () => set({
        phase: 'idle',
        userPrompt: '',
        chatHistory: [],
        bobStream: '',
        bobThinking: false,
        masterPlan: null,
        subagents: [],
        verificationReport: null,
        iteration: 0,
        error: null
      })
    }),
    {
      name: 'forge-store',
      storage: createJSONStorage(() => vscodeStorage),
      // Only persist logs and chat history to avoid getting stuck in weird UI phases on reload
      partialize: (state) => ({ 
        subagents: state.subagents, 
        chatHistory: state.chatHistory,
        projects: state.projects,
        currentProject: state.currentProject,
        bobcoins: state.bobcoins
      })
    }
  )
)
