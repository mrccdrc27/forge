import * as vscode from 'vscode';
import { ForgeCommandType, WebviewMessage } from '../interfaces/forge';

export class ForgeSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'forge.sidebar';

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

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

    webviewView.webview.onDidReceiveMessage((message: WebviewMessage) => {
      switch (message.command) {
        case ForgeCommandType.PING:
          vscode.window.showInformationMessage('⬡ Forge: Pong from Webview!');
          break;
        case ForgeCommandType.TOOL_INVOKED:
          vscode.window.showInformationMessage(`⬡ Forge: Tool ${message.data.tool} invoked via UI`);
          break;
        default:
          console.log('Unknown command:', message.command);
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
