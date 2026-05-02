import * as vscode from 'vscode';

export class ForgeSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'forge.sidebar';

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.html = this.getHtml(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(data => {
      vscode.window.showInformationMessage(`Forge UI: ${data.text}`);
    });
  }

  private getHtml(webview: vscode.Webview) {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forge Overlay</title>
</head>
<body>
    <h1>⬡ Forge Overlay</h1>
    <p>The Universal Sidecar for AI Orchestration</p>
    <button onclick="post()">Ping Host</button>
    <script>
        const vscode = acquireVsCodeApi();
        function post(){ 
            vscode.postMessage({text: 'Hello from Ghost Overlay'}); 
        }
    </script>
</body>
</html>`;
  }
}
