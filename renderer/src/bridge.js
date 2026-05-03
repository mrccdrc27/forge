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
      const errorMsg = typeof message.error === 'string' ? message.error :
                       message.error?.message ||
                       JSON.stringify(message.error) ||
                       'Unknown error';
      console.error('[Forge Bridge] Request failed:', errorMsg);
      reject(new Error(errorMsg));
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
    if (window.forge._updateTokenCount) {
      // Extract total token count from payload
      const tokenCount = payload.tokens?.total || 0;
      window.forge._updateTokenCount(tokenCount);
    }
  }

  if (command === 'SPAWN_SUBAGENT' && window.forge._spawnSubagent) {
    // The payload expects { id, name, description, chatInstanceId? } for spawn
    // chatInstanceId is used to group requests by chat session
    window.forge._spawnSubagent(payload);
  }

  if (command === 'UPDATE_SUBAGENT' && window.forge._updateSubagent) {
    // The payload expects { id, patch } for update
    window.forge._updateSubagent(payload.id, payload.patch);
  }
  
  if (command === 'NEW_CHAT_INSTANCE' && window.forge._ensureChatInstance) {
    // Create a new chat instance when Bob starts a new conversation
    window.forge._ensureChatInstance(payload?.chatInstanceId);
  }

  if (command === 'LOG') {
    console.log('[Forge Host]', payload);
  }
});

function callHost(command, data, timeout = 30000) {
  const requestId = Math.random().toString(36).substring(7);
  return new Promise((resolve, reject) => {
    // Set timeout to prevent hanging forever
    const timeoutId = setTimeout(() => {
      if (callbacks.has(requestId)) {
        callbacks.delete(requestId);
        const errorMsg = `Request timeout: ${command} did not respond within ${timeout}ms. The extension may not have a handler for this command.`;
        console.warn('[Forge Bridge]', errorMsg);
        reject(new Error(errorMsg));
      }
    }, timeout);

    callbacks.set(requestId, {
      resolve: (value) => {
        clearTimeout(timeoutId);
        resolve(value);
      },
      reject: (error) => {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
    
    vscode.postMessage({ command, data, requestId });
  });
}

window.forge = {
  _bobStreamCallback: null,
  _updateTokenCount: null,
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
  },
  executeCommand: (commandId) => {
    vscode.postMessage({ command: 'executeCommand', data: { commandId } });
  }
};
