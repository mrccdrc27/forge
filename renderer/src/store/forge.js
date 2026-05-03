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

      // ─── Chat Instances ──────────────────────────────────────────────────────
      // Group subagents by chat instance for better organization
      chatInstances: [],    // [{ id, label, timestamp, subagents: [...] }]
      currentChatInstanceId: null,
      
      // Create or get current chat instance
      ensureChatInstance: (chatInstanceId) => set((s) => {
        // If no chatInstanceId provided, create a new one
        const instanceId = chatInstanceId || `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Check if instance already exists
        const existingInstance = s.chatInstances.find(ci => ci.id === instanceId);
        if (existingInstance) {
          return { currentChatInstanceId: instanceId };
        }
        
        // Create new instance
        const newInstance = {
          id: instanceId,
          label: `Chat #${s.chatInstances.length + 1}`,
          timestamp: Date.now(),
          subagents: []
        };
        
        return {
          chatInstances: [...s.chatInstances, newInstance],
          currentChatInstanceId: instanceId
        };
      }),
      
      // ─── Subagents ───────────────────────────────────────────────────────────
      // Each task from masterPlan becomes a subagent
      subagents: [],        // [{ id, name, description, status, output, error, chatInstanceId }]
      spawnSubagent: (task) => set((s) => {
        const chatInstanceId = task.chatInstanceId || s.currentChatInstanceId || `chat-${Date.now()}`;
        
        // Ensure chat instance exists
        let instances = s.chatInstances;
        let existingInstance = instances.find(ci => ci.id === chatInstanceId);
        
        if (!existingInstance) {
          existingInstance = {
            id: chatInstanceId,
            label: `Chat #${instances.length + 1}`,
            timestamp: Date.now(),
            subagents: []
          };
          instances = [...instances, existingInstance];
        }
        
        const newSubagent = {
          id: task.id,
          name: task.name,
          description: task.description,
          status: 'queued', // queued | running | done | failed
          output: null,
          error: null,
          chatInstanceId
        };
        
        // Update chat instance with new subagent
        instances = instances.map(ci =>
          ci.id === chatInstanceId
            ? { ...ci, subagents: [...ci.subagents, newSubagent] }
            : ci
        );
        
        return {
          subagents: [...s.subagents, newSubagent],
          chatInstances: instances,
          currentChatInstanceId: chatInstanceId
        };
      }),
      
      updateSubagent: (id, patch) => set((s) => {
        const updatedSubagents = s.subagents.map(a => a.id === id ? { ...a, ...patch } : a);
        
        // Also update in chat instances
        const updatedInstances = s.chatInstances.map(ci => ({
          ...ci,
          subagents: ci.subagents.map(a => a.id === id ? { ...a, ...patch } : a)
        }));
        
        return {
          subagents: updatedSubagents,
          chatInstances: updatedInstances
        };
      }),
      
      clearSubagents: () => set({ subagents: [], chatInstances: [], currentChatInstanceId: null }),

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
        chatInstances: [],
        currentChatInstanceId: null,
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
        chatInstances: state.chatInstances,
        currentChatInstanceId: state.currentChatInstanceId,
        chatHistory: state.chatHistory,
        projects: state.projects,
        currentProject: state.currentProject,
        bobcoins: state.bobcoins
      })
    }
  )
)
