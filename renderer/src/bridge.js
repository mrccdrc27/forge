/**
 * VS Code Webview Bridge
 * Mocks the Electron contextBridge interface but uses vscode.postMessage
 */

const vscode = window.vscode;
const callbacks = new Map();

window.addEventListener('message', (event) => {
  const message = event.data;
  
  // Handle requests/responses
  if (message.requestId && callbacks.has(message.requestId)) {
    const { resolve, reject } = callbacks.get(message.requestId);
    callbacks.delete(message.requestId);
    if (message.error) {
      reject(message.error);
    } else {
      resolve(message.payload || message.data);
    }
    return;
  }

  // Handle push messages from host
  const command = message.command || message.type;
  const payload = message.data || message.payload;

  if (command === 'bob:stream') {
    const cb = window.forge._bobStreamCallback;
    if (cb) cb(payload);
  }

  if (command === 'METRICS_UPDATE' || command === 'updateSentry') {
    if (window.forge._updateBobcoins) {
      // Extract metrics from payload
      const metrics = payload.cost ? {
        total: payload.cost.actual,
        saved: payload.cost.saved,
        limit: payload.budget
      } : payload;
      window.forge._updateBobcoins(metrics);
    }
  }

  if (command === 'SPAWN_SUBAGENT' && window.forge._spawnSubagent) {
    // The payload usually expects { id, name, description } for spawn
    window.forge._spawnSubagent(payload);
  }

  if (command === 'UPDATE_SUBAGENT' && window.forge._updateSubagent) {
    // The payload usually expects { id, patch } for update
    window.forge._updateSubagent(payload.id, payload.patch);
  }

  if (command === 'LOG') {
    console.log('[Forge Host]', payload);
  }
});

function callHost(command, data) {
  const requestId = Math.random().toString(36).substring(7);
  return new Promise((resolve, reject) => {
    callbacks.set(requestId, { resolve, reject });
    vscode.postMessage({ command, data, requestId });
  });
}

window.forge = {
  _bobStreamCallback: null,
  _updateBobcoins: null,
  _spawnSubagent: null,
  _updateSubagent: null,
  _setPhase: null,
  bob: {
    run: (args) => callHost('bob:run', args),
    abort: () => callHost('bob:abort'),
    onStream: (callback) => { window.forge._bobStreamCallback = callback; },
    offStream: () => { window.forge._bobStreamCallback = null; }
  },
  orchestrate: {
    spawn: (args) => callHost('orchestrate:spawn', args)
  },
  projects: {
    list: () => callHost('projects:list'),
    create: (args) => callHost('projects:create', args),
    savePlan: (args) => callHost('projects:save-plan', args)
  }
};
