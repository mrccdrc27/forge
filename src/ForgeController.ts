import * as vscode from 'vscode';
import { IForgeService } from './interfaces/forge';
import { ForgeSidebarProvider } from './providers/ForgeSidebarProvider';
import { ResourceSentry } from './services/ResourceSentry';
import { WatsonxClient } from './services/WatsonxClient';
import { ResourceArbitrator } from './services/ResourceArbitrator';
import { MCPHub } from './services/MCPHub';
import { AtomicWriter } from './services/AtomicWriter';
import { HistoryExporter } from './services/HistoryExporter';
import { BuildEngine } from './services/BuildEngine';
import { CodebaseAnalyzer } from './services/CodebaseAnalyzer';
import { DependencyAdvisor } from './services/DependencyAdvisor';
import { DocumentationEngine } from './services/DocumentationEngine';
import { RetryAdvisor } from './services/RetryAdvisor';
import { CleanupScanner } from './services/CleanupScanner';

export class ForgeController {
  private services: Map<string, IForgeService> = new Map();
  private output = vscode.window.createOutputChannel("Forge");
  private sidebarProvider: ForgeSidebarProvider;
  private sentry?: ResourceSentry;
  private watsonx?: WatsonxClient;
  private arbitrator?: ResourceArbitrator;
  private mcpHub?: MCPHub;
  private writer?: AtomicWriter;
  private historyExporter?: HistoryExporter;
  private buildEngine?: BuildEngine;
  private codebaseAnalyzer?: CodebaseAnalyzer;
  private dependencyAdvisor?: DependencyAdvisor;
  private documentationEngine?: DocumentationEngine;
  private retryAdvisor?: RetryAdvisor;
  private cleanupScanner?: CleanupScanner;

  constructor(context: vscode.ExtensionContext) {
    this.sidebarProvider = new ForgeSidebarProvider(context.extensionUri);
  }

  setHistoryExporter(historyExporter: HistoryExporter) {
    this.historyExporter = historyExporter;
  }

  setSentry(sentry: ResourceSentry) {
    this.sentry = sentry;
    this.sentry.onUpdate(data => {
      this.sidebarProvider.updateState(data);
    });
  }

  setWatsonx(watsonx: WatsonxClient) {
    this.watsonx = watsonx;
  }

  setArbitrator(arbitrator: ResourceArbitrator) {
    this.arbitrator = arbitrator;
    this.arbitrator.onEvent(event => {
      this.sidebarProvider.postMessage({
        command: event.type as any,
        data: event.payload
      });
    });
  }

  setMCPHub(mcpHub: MCPHub) {
    this.mcpHub = mcpHub;
    this.mcpHub.onEvent(event => {
      this.sidebarProvider.postMessage({
        command: event.type as any,
        data: event.payload
      });
    });
  }

  setWriter(writer: AtomicWriter) {
    this.writer = writer;
  }

  setBuildEngine(buildEngine: BuildEngine) {
    this.buildEngine = buildEngine;
    this.buildEngine.onEvent(event => {
      this.sidebarProvider.postMessage({
        command: event.type as any,
        data: event.payload
      });
    });
  }

  setCodebaseAnalyzer(codebaseAnalyzer: CodebaseAnalyzer) {
    this.codebaseAnalyzer = codebaseAnalyzer;
  }

  setDependencyAdvisor(dependencyAdvisor: DependencyAdvisor) {
    this.dependencyAdvisor = dependencyAdvisor;
  }

  setDocumentationEngine(documentationEngine: DocumentationEngine) {
    this.documentationEngine = documentationEngine;
  }

  setRetryAdvisor(retryAdvisor: RetryAdvisor) {
    this.retryAdvisor = retryAdvisor;
  }

  setCleanupScanner(cleanupScanner: CleanupScanner) {
    this.cleanupScanner = cleanupScanner;
  }

  getSentry() {
    return this.sentry;
  }

  getWriter() {
    return this.writer;
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
        this.sidebarProvider,
        { webviewOptions: { retainContextWhenHidden: true } }
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
