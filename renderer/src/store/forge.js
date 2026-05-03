import { create } from 'zustand'

/**
 * File-based storage adapter
 * Communicates with ForgeStorageManager via postMessage
 */
const fileStorage = {
  // Load initial state from backend on mount
  loadInitialState: async () => {
    return new Promise((resolve) => {
      const handler = (event) => {
        const message = event.data;
        if (message.command === 'STORAGE_LOADED') {
          window.removeEventListener('message', handler);
          resolve(message.data);
        }
      };
      window.addEventListener('message', handler);
      window.vscode?.postMessage({ command: 'LOAD_STORAGE' });
      
      // Timeout fallback
      setTimeout(() => {
        window.removeEventListener('message', handler);
        resolve(null);
      }, 5000);
    });
  },
  
  // Save state to backend
  saveState: (chatInstances, currentChatInstanceId) => {
    window.vscode?.postMessage({
      command: 'SAVE_STORAGE',
      data: { chatInstances, currentChatInstanceId }
    });
  }
};

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

      // ─── Chat Instances ──────────────────────────────────────────────────────
      // Group subagents by chat instance for better organization
      // Now persisted to .forge/history/chat-instances.json
      chatInstances: [],    // [{ id, label, timestamp, subagents: [...] }]
      currentChatInstanceId: null,
      storageInitialized: false,
      
      // Initialize storage from file system
      initializeStorage: async () => {
        const data = await fileStorage.loadInitialState();
        if (data) {
          set({
            chatInstances: data.instances || [],
            currentChatInstanceId: data.currentInstanceId || null,
            storageInitialized: true
          });
        } else {
          set({ storageInitialized: true });
        }
      },
      
      // Persist to file system
      persistStorage: () => {
        const state = get();
        fileStorage.saveState(state.chatInstances, state.currentChatInstanceId);
      },
      
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
        
        const newState = {
          chatInstances: [...s.chatInstances, newInstance],
          currentChatInstanceId: instanceId
        };
        
        // Persist to file system
        setTimeout(() => fileStorage.saveState(newState.chatInstances, newState.currentChatInstanceId), 0);
        
        return newState;
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
        
        const newState = {
          subagents: [...s.subagents, newSubagent],
          chatInstances: instances,
          currentChatInstanceId: chatInstanceId
        };
        
        // Persist to file system
        setTimeout(() => fileStorage.saveState(newState.chatInstances, newState.currentChatInstanceId), 0);
        
        return newState;
      }),
      
      updateSubagent: (id, patch) => set((s) => {
        const updatedSubagents = s.subagents.map(a => a.id === id ? { ...a, ...patch } : a);
        
        // Also update in chat instances
        const updatedInstances = s.chatInstances.map(ci => ({
          ...ci,
          subagents: ci.subagents.map(a => a.id === id ? { ...a, ...patch } : a)
        }));
        
        const newState = {
          subagents: updatedSubagents,
          chatInstances: updatedInstances
        };
        
        // Persist to file system
        setTimeout(() => fileStorage.saveState(newState.chatInstances, s.currentChatInstanceId), 0);
        
        return newState;
      }),
      
      clearSubagents: () => {
        set({ subagents: [], chatInstances: [], currentChatInstanceId: null });
        // Persist cleared state
        setTimeout(() => fileStorage.saveState([], null), 0);
      },

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
      reset: () => {
        set({
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
        });
        // Persist reset state
        setTimeout(() => fileStorage.saveState([], null), 0);
      }
    })
)
