const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('forge', {
  bob: {
    run: (args) => ipcRenderer.invoke('bob:run', args),
    abort: () => ipcRenderer.invoke('bob:abort'),
    onStream: (callback) => ipcRenderer.on('bob:stream', (event, chunk) => callback(chunk)),
    offStream: () => ipcRenderer.removeAllListeners('bob:stream')
  },
  orchestrate: {
    spawn: (args) => ipcRenderer.invoke('orchestrate:spawn', args)
  },
  projects: {
    list: () => ipcRenderer.invoke('projects:list'),
    create: (args) => ipcRenderer.invoke('projects:create', args),
    savePlan: (args) => ipcRenderer.invoke('projects:save-plan', args)
  }
})
