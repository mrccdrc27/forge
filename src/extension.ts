import * as vscode from 'vscode';
import { ForgeController } from './ForgeController';
import { ContextEngine } from './services/ContextEngine';
import { ResourceSentry } from './services/ResourceSentry';
import { WatsonxClient } from './services/WatsonxClient';
import { ResourceArbitrator } from './services/ResourceArbitrator';
import { MCPHub } from './services/MCPHub';
import { AtomicWriter } from './services/AtomicWriter';

let controller: ForgeController;

export function activate(context: vscode.ExtensionContext) {
  controller = new ForgeController(context);
  controller.registerProviders(context);
  
  const output = controller.getOutputChannel();

  // Register Services
  controller.registerService(new ContextEngine('context-engine', output));
  
  const sentry = new ResourceSentry(output);
  controller.registerService(sentry);
  
  const watsonx = new WatsonxClient(output);
  controller.registerService(watsonx);

  const arbitrator = new ResourceArbitrator(output, sentry, watsonx);
  controller.registerService(arbitrator);

  const writer = new AtomicWriter('atomic-writer', output);
  controller.registerService(writer);

  const mcpHub = new MCPHub('mcp-hub', output);
  mcpHub.setWriter(writer);
  mcpHub.setSentry(sentry);
  controller.registerService(mcpHub);

  // Set references in controller
  controller.setSentry(sentry);
  controller.setWatsonx(watsonx);
  controller.setArbitrator(arbitrator);
  controller.setWriter(writer);
  controller.setMCPHub(mcpHub);

  context.subscriptions.push(controller);
}

export function deactivate() {
  if (controller) {
    controller.dispose();
  }
}
