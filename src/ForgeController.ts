import * as vscode from 'vscode';
import { IForgeService } from './interfaces/forge';

export class ForgeController {
  private services: Map<string, IForgeService> = new Map();
  private output = vscode.window.createOutputChannel("Forge");

  async registerService(service: IForgeService) {
    try {
      await service.init();
      this.services.set(service.id, service);
    } catch (err) {
      vscode.window.showErrorMessage(`Forge service [${service.id}] failed: ${err}`);
    }
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
