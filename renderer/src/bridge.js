/**
 * VS Code Webview Bridge
 * Mocks the Electron contextBridge interface but uses vscode.postMessage
 */

const vscode = window.vscode;
const callbacks = new Map();

window.addEventListener('message', (event) => {
  const { type, payload, requestId } = event.data;
  
  if (requestId && callbacks.has(requestId)) {
    const { resolve, reject } = callbacks.get(requestId);
    callbacks.delete(requestId);
    if (event.data.error) {
      reject(event.data.error);
    } else {
      resolve(payload);
    }
    return;
  }

  // Handle streaming or events
  if (type === 'bob:stream') {
    const cb = window.forge._bobStreamCallback;
    if (cb) cb(payload);
  }
});

function callHost(type, payload) {
  const requestId = Math.random().toString(36).substring(7);
  return new Promise((resolve, reject) => {
    callbacks.set(requestId, { resolve, reject });
    vscode.postMessage({ type, payload, requestId });
  });
}

window.forge = {
  _bobStreamCallback: null,
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
