import * as vscode from 'vscode';
import { IForgeService } from './interfaces/forge';
import { ForgeSidebarProvider } from './providers/ForgeSidebarProvider';

export class ForgeController {
  private services: Map<string, IForgeService> = new Map();
  private output = vscode.window.createOutputChannel("Forge");
  private sidebarProvider: ForgeSidebarProvider;

  constructor() {
    this.sidebarProvider = new ForgeSidebarProvider();
  }

  async registerService(service: IForgeService) {
    try {
      await service.init();
      this.services.set(service.id, service);
    } catch (err) {
      vscode.window.showErrorMessage(`Forge service [${service.id}] failed: ${err}`);
    }
  }

  registerProviders(context: vscode.ExtensionContext) {
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        ForgeSidebarProvider.viewType,
        this.sidebarProvider
      )
    );
  }

  dispose() {
    for (const service of this.services.values()) {
      service.dispose();
    }
    this.output.dispose();
  }

  getOutputChannel() {
    return this.output;
  }
}
