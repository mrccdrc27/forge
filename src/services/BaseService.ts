import * as vscode from 'vscode';
import { IForgeService } from '../interfaces/forge';

export abstract class BaseService implements IForgeService {
  constructor(public readonly id: string, protected output: vscode.OutputChannel) {}
  abstract init(): Promise<void>;
  abstract dispose(): void;

  protected log(message: string) {
    this.output.appendLine(`[${this.id}] ${message}`);
  }
}
