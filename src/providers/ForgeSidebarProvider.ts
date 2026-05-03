import * as vscode from 'vscode';
import { ForgeCommandType, WebviewMessage } from '../interfaces/forge';
import { ForgeStorageManager } from '../services/ForgeStorageManager';

export class ForgeSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'forge.sidebar';

  private _view?: vscode.WebviewView;
  private _storageManager?: ForgeStorageManager;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  setStorageManager(storageManager: ForgeStorageManager) {
    this._storageManager = storageManager;
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken
  ) {
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this.getHtml(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (message: WebviewMessage) => {
      const { command, data, requestId } = message as any;
      
      try {
        switch (command) {
          case ForgeCommandType.PING:
            vscode.window.showInformationMessage('⬡ Forge: Pong from Webview!');
            if (requestId) {
              webviewView.webview.postMessage({ requestId, payload: 'pong' });
            }
            break;
            
          case ForgeCommandType.TOOL_INVOKED:
            vscode.window.showInformationMessage(`⬡ Forge: Tool ${message.data.tool} invoked via UI`);
            break;
            
          case 'bob:run':
            // Placeholder: Bob integration not yet implemented
            if (requestId) {
              webviewView.webview.postMessage({
                requestId,
                error: 'Bob integration not yet implemented. This feature requires Bob IDE connection.'
              });
            }
            break;
            
          case 'bob:abort':
            if (requestId) {
              webviewView.webview.postMessage({ requestId, payload: { success: true } });
            }
            break;
            
          case 'orchestrate:spawn':
            // Placeholder: Orchestration not yet implemented
            if (requestId) {
              webviewView.webview.postMessage({
                requestId,
                error: 'Orchestration not yet implemented. This feature is under development.'
              });
            }
            break;
            
          case 'projects:list':
            if (requestId) {
              webviewView.webview.postMessage({ requestId, payload: [] });
            }
            break;
            
          case 'projects:create':
            if (requestId) {
              webviewView.webview.postMessage({
                requestId,
                payload: { success: true, projectId: data?.projectName || 'new-project' }
              });
            }
            break;
            
          case 'projects:save-plan':
            if (requestId) {
              webviewView.webview.postMessage({ requestId, payload: { success: true } });
            }
            break;
            
          case 'LOAD_STORAGE':
            // Load chat instances from persistent storage
            if (this._storageManager) {
              const storageData = await this._storageManager.loadChatInstances();
              webviewView.webview.postMessage({
                command: 'STORAGE_LOADED',
                data: storageData
              });
            } else {
              webviewView.webview.postMessage({
                command: 'STORAGE_LOADED',
                data: { instances: [], currentInstanceId: null }
              });
            }
            break;
            
          case 'SAVE_STORAGE':
            // Save chat instances to persistent storage
            if (this._storageManager && data) {
              await this._storageManager.saveChatInstances(
                data.chatInstances || [],
                data.currentChatInstanceId || null
              );
            }
            break;
            
          case 'executeCommand':
            // Execute VS Code commands from the webview
            if (data?.commandId) {
              try {
                await vscode.commands.executeCommand(data.commandId);
              } catch (error: any) {
                console.error(`[Forge] Failed to execute command ${data.commandId}:`, error);
                vscode.window.showErrorMessage(`Failed to execute command: ${error.message}`);
              }
            }
            break;
            
          default:
            console.log('[Forge] Unknown command:', command);
            if (requestId) {
              webviewView.webview.postMessage({
                requestId,
                error: `Unknown command: ${command}`
              });
            }
        }
      } catch (error: any) {
        console.error('[Forge] Error handling message:', error);
        if (requestId) {
          webviewView.webview.postMessage({
            requestId,
            error: error?.message || String(error)
          });
        }
      }
    });
  }

  public updateState(data: any) {
    if (this._view) {
      this._view.webview.postMessage({ command: ForgeCommandType.METRICS_UPDATE, data });
    }
  }

  public postMessage(message: WebviewMessage) {
    if (this._view) {
      this._view.webview.postMessage(message);
    }
  }

  private getHtml(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist', 'renderer', 'assets', 'index.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist', 'renderer', 'assets', 'index.css')
    );
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} https:;">
    <link href="${styleUri}" rel="stylesheet">
    <title>Forge Overlay</title>
</head>
<body>
    <div id="root"></div>
    <script nonce="${nonce}">
      window.vscode = acquireVsCodeApi();
    </script>
    <script nonce="${nonce}" type="module" src="${scriptUri}"></script>
</body>
</html>`;
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
