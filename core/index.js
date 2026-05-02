const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { spawn } = require('child_process')

const isDev = process.env.NODE_ENV === 'development'

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0a0a0a',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  const indexPath = isDev 
    ? 'http://localhost:5173' 
    : path.join(__dirname, '../dist/renderer/index.html')

  if (isDev) {
    mainWindow.loadURL(indexPath)
  } else {
    mainWindow.loadFile(indexPath)
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// ─── Bob Shell Integration ────────────────────────────────────────────────────

let bobProcess = null

/**
 * Run Bob Shell in non-interactive mode with a prompt.
 * Bob outputs to stdout — we stream it back to the renderer.
 */
ipcMain.handle('bob:run', async (event, { prompt, context }) => {
  return new Promise((resolve, reject) => {
    const fullPrompt = context
      ? `${context}\n\n${prompt}`
      : prompt

    // ─── Authentication Logic ────────────────────────────────────────────────
    const { BOBSHELL_API_KEY } = process.env
    const authString = BOBSHELL_API_KEY ? '--auth-method api-key ' : ''

    // Escape quotes in the prompt for Windows command line
    const escapedPrompt = fullPrompt.replace(/"/g, '\\"')

    // bob shell non-interactive: `bob -p "<prompt>"`
    bobProcess = spawn(`bob ${authString}-p "${escapedPrompt}"`, {
      shell: true,
      env: { ...process.env }
    })

    let output = ''
    let errorOutput = ''

    bobProcess.stdout.on('data', (data) => {
      const chunk = data.toString()
      output += chunk
      // Stream chunks live to renderer
      mainWindow.webContents.send('bob:stream', chunk)
    })

    bobProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })

    bobProcess.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, output })
      } else {
        resolve({ success: false, output, error: errorOutput })
      }
    })

    bobProcess.on('error', (err) => {
      reject(new Error(`Bob Shell not found: ${err.message}`))
    })
  })
})

ipcMain.handle('bob:abort', () => {
  if (bobProcess) {
    bobProcess.kill()
    bobProcess = null
  }
})

// ─── Watsonx Orchestrate Integration ─────────────────────────────────────────

/**
 * Call Watsonx Orchestrate API to spawn a subagent for a task.
 * Each task from Bob's master plan becomes one Orchestrate agent call.
 */
ipcMain.handle('orchestrate:spawn', async (event, { task, projectContext }) => {
  const { WATSON_API_KEY, WATSON_INSTANCE_URL } = process.env

  if (!WATSON_API_KEY || !WATSON_INSTANCE_URL) {
    return { success: false, error: 'Watson credentials not set in environment' }
  }

  try {
    // TODO: replace with actual Orchestrate agent endpoint
    const response = await fetch(`${WATSON_INSTANCE_URL}/v1/agent/invoke`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WATSON_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: task.description,
        context: projectContext,
        task_id: task.id
      })
    })

    const data = await response.json()
    return { success: true, data, taskId: task.id }
  } catch (err) {
    return { success: false, error: err.message, taskId: task.id }
  }
})

// ─── Project filesystem helpers ───────────────────────────────────────────────

const fs = require('fs')
const os = require('os')

const PROJECTS_DIR = path.join(os.homedir(), '.forge', 'projects')

ipcMain.handle('projects:list', () => {
  if (!fs.existsSync(PROJECTS_DIR)) return []
  return fs.readdirSync(PROJECTS_DIR).map(name => ({
    name,
    path: path.join(PROJECTS_DIR, name),
    createdAt: fs.statSync(path.join(PROJECTS_DIR, name)).birthtime
  }))
})

ipcMain.handle('projects:create', (event, { name }) => {
  const projectPath = path.join(PROJECTS_DIR, name)
  fs.mkdirSync(projectPath, { recursive: true })
  fs.writeFileSync(
    path.join(projectPath, 'forge.json'),
    JSON.stringify({ name, createdAt: new Date().toISOString(), status: 'created' }, null, 2)
  )
  return { name, path: projectPath }
})

ipcMain.handle('projects:save-plan', (event, { projectName, plan }) => {
  const projectPath = path.join(PROJECTS_DIR, projectName)
  fs.writeFileSync(
    path.join(projectPath, 'master-plan.json'),
    JSON.stringify(plan, null, 2)
  )
  return { success: true }
})
