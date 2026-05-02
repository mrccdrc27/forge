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
  
  const watsonx = new WatsonxClient(output, config);
  await controller.registerService(watsonx);

  const arbitrator = new ResourceArbitrator(output, sentry, watsonx, config);
  await controller.registerService(arbitrator);

  const writer = new AtomicWriter('atomic-writer', output);
  await controller.registerService(writer);

  const historyExporter = new HistoryExporter('history-exporter', output);
  await controller.registerService(historyExporter);

  // Initialize MCPHub but don't start server yet
  const mcpHub = new MCPHub('mcp-hub', output);
  await controller.registerService(mcpHub);
  
  // Set all dependencies BEFORE starting the server
  mcpHub.setWriter(writer);
  mcpHub.setSentry(sentry);
  mcpHub.setArbitrator(arbitrator);
  mcpHub.setConfig(config);
  
  // Now start the MCP server with all dependencies ready
  await mcpHub.startServerWhenReady();

  // Set references in controller
  controller.setSentry(sentry);
  controller.setWatsonx(watsonx);
  controller.setArbitrator(arbitrator);
  controller.setWriter(writer);
  controller.setHistoryExporter(historyExporter);
  controller.setMCPHub(mcpHub);

  context.subscriptions.push(controller);
  
  output.appendLine('✅ Forge extension activated successfully!');
}

export function deactivate() {
  if (controller) {
    controller.dispose();
  }
}
