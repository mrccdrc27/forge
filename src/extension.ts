import * as vscode from 'vscode';
import { ForgeController } from './ForgeController';
import { ContextEngine } from './services/ContextEngine';

let controller: ForgeController;

export function activate(context: vscode.ExtensionContext) {
  controller = new ForgeController();
  controller.registerProviders(context);
  
  // Register Services
  controller.registerService(new ContextEngine('context-engine', controller.getOutputChannel()));

  context.subscriptions.push(controller);
}

export function deactivate() {
  if (controller) {
    controller.dispose();
  }
}
