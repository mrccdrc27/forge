import * as vscode from 'vscode';
import { ForgeController } from './ForgeController';

let controller: ForgeController;

export function activate(context: vscode.ExtensionContext) {
  controller = new ForgeController();
  controller.registerProviders(context);
  context.subscriptions.push(controller);
}

export function deactivate() {
  if (controller) {
    controller.dispose();
  }
}
