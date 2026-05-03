import * as vscode from 'vscode';
import { ForgeController } from './ForgeController';
import { ContextEngine } from './services/ContextEngine';
import { ResourceSentry } from './services/ResourceSentry';
import { WatsonxClient } from './services/WatsonxClient';
import { ResourceArbitrator } from './services/ResourceArbitrator';
import { MCPHub } from './services/MCPHub';
import { AtomicWriter } from './services/AtomicWriter';
import { HistoryExporter } from './services/HistoryExporter';
import { ConfigManager } from './services/ConfigManager';
import { BuildEngine } from './services/BuildEngine';
import { CodebaseAnalyzer } from './services/CodebaseAnalyzer';
import { DependencyAdvisor } from './services/DependencyAdvisor';
import { DocumentationEngine } from './services/DocumentationEngine';
import { RetryAdvisor } from './services/RetryAdvisor';
import { CleanupScanner } from './services/CleanupScanner';

let controller: ForgeController;

export async function activate(context: vscode.ExtensionContext) {
  controller = new ForgeController(context);
  controller.registerProviders(context);
  
  const output = controller.getOutputChannel();

  // Initialize ConfigManager first - all other services depend on it
  const config = new ConfigManager(output);
  await controller.registerService(config);

  // Register Services with proper dependencies
  await controller.registerService(new ContextEngine('context-engine', output));
  
  const sentry = new ResourceSentry(output, config);
  await controller.registerService(sentry);
  controller.setSentry(sentry);
  
  const watsonx = new WatsonxClient(output, config);
  await controller.registerService(watsonx);
  controller.setWatsonx(watsonx);

  const arbitrator = new ResourceArbitrator(output, sentry, watsonx, config);
  await controller.registerService(arbitrator);
  controller.setArbitrator(arbitrator);

  const writer = new AtomicWriter('atomic-writer', output);
  await controller.registerService(writer);
  controller.setWriter(writer);

  const historyExporter = new HistoryExporter('history-exporter', output);
  await controller.registerService(historyExporter);
  controller.setHistoryExporter(historyExporter);

  const buildEngine = new BuildEngine(output, arbitrator, writer, config);
  await controller.registerService(buildEngine);
  controller.setBuildEngine(buildEngine);

  const codebaseAnalyzer = new CodebaseAnalyzer(output, arbitrator, config);
  await controller.registerService(codebaseAnalyzer);
  controller.setCodebaseAnalyzer(codebaseAnalyzer);

  const dependencyAdvisor = new DependencyAdvisor(output, arbitrator, config);
  await controller.registerService(dependencyAdvisor);
  controller.setDependencyAdvisor(dependencyAdvisor);

  const documentationEngine = new DocumentationEngine(output, arbitrator);
  await controller.registerService(documentationEngine);
  controller.setDocumentationEngine(documentationEngine);

  const retryAdvisor = new RetryAdvisor(output, arbitrator);
  await controller.registerService(retryAdvisor);
  controller.setRetryAdvisor(retryAdvisor);

  const cleanupScanner = new CleanupScanner(output, arbitrator, config);
  await controller.registerService(cleanupScanner);
  controller.setCleanupScanner(cleanupScanner);

  // Initialize MCPHub but don't start server yet
  const mcpHub = new MCPHub('mcp-hub', output);
  await controller.registerService(mcpHub);
  
  // Set all dependencies BEFORE starting the server
  mcpHub.setWriter(writer);
  mcpHub.setSentry(sentry);
  mcpHub.setArbitrator(arbitrator);
  mcpHub.setConfig(config);
  mcpHub.setBuildEngine(buildEngine);
  mcpHub.setCodebaseAnalyzer(codebaseAnalyzer);
  mcpHub.setDependencyAdvisor(dependencyAdvisor);
  mcpHub.setDocumentationEngine(documentationEngine);
  mcpHub.setRetryAdvisor(retryAdvisor);
  mcpHub.setCleanupScanner(cleanupScanner);
  
  // Now start the MCP server with all dependencies ready
  try {
    await mcpHub.startServerWhenReady();
    controller.setMCPHub(mcpHub);
    output.appendLine('✅ MCP Server started successfully');
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    output.appendLine(`⚠️ MCP Server failed to start: ${errorMsg}`);
    output.appendLine('⚠️ Forge will continue with limited functionality (MCP tools unavailable)');
    
    // Show user-friendly error message based on error type
    if (errorMsg.includes('already in use')) {
      vscode.window.showWarningMessage(
        'Forge MCP server could not start: Port already in use. Change the port in forge.config.json or stop the conflicting service.',
        'Open Config'
      ).then(selection => {
        if (selection === 'Open Config') {
          vscode.workspace.openTextDocument(vscode.Uri.file('forge.config.json')).then(doc => {
            vscode.window.showTextDocument(doc);
          });
        }
      });
    } else if (errorMsg.includes('Permission denied')) {
      vscode.window.showWarningMessage(
        'Forge MCP server could not start: Permission denied. Try using a port > 1024 in forge.config.json.'
      );
    } else {
      vscode.window.showWarningMessage(
        `Forge MCP server unavailable: ${errorMsg}. Extension will run with limited functionality.`
      );
    }
  }

  context.subscriptions.push(controller);
  
  output.appendLine('✅ Forge extension activated successfully!');
}

export function deactivate() {
  if (controller) {
    controller.dispose();
  }
}
