import * as vscode from 'vscode';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { BaseService } from "./BaseService";
import { AtomicWriter } from "./AtomicWriter";
import { ResourceSentry } from "./ResourceSentry";
import { ResourceArbitrator } from "./ResourceArbitrator";
import express from "express";

export class MCPHub extends BaseService {
  private server?: Server;
  private app?: express.Application;
  private transport?: SSEServerTransport;
  private writer?: AtomicWriter;
  private sentry?: ResourceSentry;
  private arbitrator?: ResourceArbitrator;

  private _onEvent = new vscode.EventEmitter<{ type: string; payload: any }>();
  public readonly onEvent = this._onEvent.event;

  async init() {
    this.server = new Server(
      {
        name: "forge-mcp-server",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    await this.startServer();
    
    this.log("MCP Hub Initialized and listening on SSE.");
  }

  setWriter(writer: AtomicWriter) {
    this.writer = writer;
  }

  setSentry(sentry: ResourceSentry) {
    this.sentry = sentry;
  }

  setArbitrator(arbitrator: ResourceArbitrator) {
    this.arbitrator = arbitrator;
  }

  private setupHandlers() {
    if (!this.server) return;

    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "forge.ping",
          description: "Verify Forge is connected to Bob",
          inputSchema: { type: "object", properties: {} },
        },
        {
          name: "forge.bulk_write",
          description: "Write multiple files to the workspace atomically",
          inputSchema: {
            type: "object",
            properties: {
              files: {
                type: "object",
                description: "Map of file paths to content",
                additionalProperties: { type: "string" }
              }
            },
            required: ["files"]
          },
        },
        {
          name: "forge.get_resource_metrics",
          description: "Get current Bobcoin budget and usage metrics",
          inputSchema: { type: "object", properties: {} },
        },
        {
          name: "forge.scaffold",
          description: "Generate standard project structures (web, api, cli)",
          inputSchema: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["web", "api", "cli"] },
              name: { type: "string" }
            },
            required: ["type", "name"]
          },
        },
        {
          name: "forge.execute_task",
          description: "Delegate a specific coding task to the Forge internal worker model",
          inputSchema: {
            type: "object",
            properties: {
              task: { type: "string", description: "The task description to execute" }
            },
            required: ["task"]
          }
        }
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      // Budget Gating
      if (this.sentry && !this.sentry.hasBudget(500)) { // 500 tokens buffer for tool overhead
        throw new Error('Gated: Insufficient Bobcoin budget for tool execution.');
      }

      switch (name) {
        case "forge.ping": {
          return { content: [{ type: "text", text: "Pong! Forge is alive." }] };
        }

        case "forge.bulk_write": {
          if (!this.writer) throw new Error("AtomicWriter not initialized");
          const taskId = Math.random().toString(36).substring(7);
          const numFiles = Object.keys((args as any).files).length;
          this._onEvent.fire({ type: 'SPAWN_SUBAGENT', payload: { id: taskId, name: 'Forge Bulk Write', description: `Writing ${numFiles} files` } });
          this._onEvent.fire({ type: 'UPDATE_SUBAGENT', payload: { id: taskId, patch: { status: 'running' } } });
          try {
            const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath || ".";
            await this.writer.bulkWrite(workspaceRoot, (args as any).files);
            this._onEvent.fire({ type: 'UPDATE_SUBAGENT', payload: { id: taskId, patch: { status: 'done', output: `Successfully wrote ${numFiles} files.` } } });
            return { content: [{ type: "text", text: `Successfully wrote ${numFiles} files.` }] };
          } catch (err: any) {
            this._onEvent.fire({ type: 'UPDATE_SUBAGENT', payload: { id: taskId, patch: { status: 'failed', error: err.message } } });
            throw err;
          }
        }

        case "forge.get_resource_metrics": {
          if (!this.sentry) throw new Error("ResourceSentry not initialized");
          const metrics = this.sentry.getSentryData();
          return { content: [{ type: "text", text: JSON.stringify(metrics, null, 2) }] };
        }

        case "forge.scaffold": {
          if (!this.writer) throw new Error("AtomicWriter not initialized");
          const { type, name: projectName } = args as any;
          const scaffoldFiles: { [key: string]: string } = {};
          const root = vscode.workspace.workspaceFolders?.[0].uri.fsPath || ".";

          const taskId = Math.random().toString(36).substring(7);
          this._onEvent.fire({ type: 'SPAWN_SUBAGENT', payload: { id: taskId, name: 'Forge Scaffold', description: `Scaffolding ${type} project: ${projectName}` } });
          this._onEvent.fire({ type: 'UPDATE_SUBAGENT', payload: { id: taskId, patch: { status: 'running' } } });

          try {
            if (type === "web") {
              scaffoldFiles[`${projectName}/index.html`] = `<!DOCTYPE html><html><head><title>${projectName}</title></head><body><h1>${projectName}</h1></body></html>`;
              scaffoldFiles[`${projectName}/style.css`] = "body { font-family: sans-serif; }";
            } else if (type === "api") {
              scaffoldFiles[`${projectName}/index.js`] = 'const express = require("express");\nconst app = express();\napp.listen(3000, () => console.log("API Ready"));';
              scaffoldFiles[`${projectName}/package.json`] = JSON.stringify({ name: projectName, version: "0.1.0", dependencies: { express: "^4.18.2" } }, null, 2);
            } else if (type === "cli") {
              scaffoldFiles[`${projectName}/main.py`] = 'print("Hello from Forge CLI!")';
              scaffoldFiles[`${projectName}/README.md`] = `# ${projectName}\nGenerated by Forge`;
            }

            await this.writer.bulkWrite(root, scaffoldFiles);
            this._onEvent.fire({ type: 'UPDATE_SUBAGENT', payload: { id: taskId, patch: { status: 'done', output: `Scaffolded ${type} project: ${projectName}` } } });
            return { content: [{ type: "text", text: `Scaffolded ${type} project: ${projectName}` }] };
          } catch (err: any) {
            this._onEvent.fire({ type: 'UPDATE_SUBAGENT', payload: { id: taskId, patch: { status: 'failed', error: err.message } } });
            throw err;
          }
        }

        case "forge.execute_task": {
          if (!this.arbitrator) throw new Error("ResourceArbitrator not initialized");
          const response = await this.arbitrator.executeTask({ task: (args as any).task });
          return { content: [{ type: "text", text: response }] };
        }

        default:
          throw new Error(`Tool not found: ${name}`);
      }
    });
  }

  private async startServer() {
    this.app = express();
    const port = 3000;

    this.app.get("/sse", async (req: express.Request, res: express.Response) => {
      if (this.transport) {
        try {
          await this.server?.close();
        } catch (e) {
          this.log(`Error closing previous server: ${e}`);
        }
        
        this.server = new Server(
          {
            name: "forge-mcp-server",
            version: "0.1.0",
          },
          {
            capabilities: {
              tools: {},
            },
          }
        );
        this.setupHandlers();
      }

      this.transport = new SSEServerTransport("/messages", res);
      await this.server!.connect(this.transport);
      this.log("Bob connected to MCP SSE.");
    });

    this.app.post("/messages", async (req: express.Request, res: express.Response) => {
      if (this.transport) {
        await this.transport.handlePostMessage(req, res);
      }
    });

    this.app.listen(port, () => {
      this.log(`MCP SSE Server listening on http://localhost:${port}/sse`);
    });
  }

  dispose() {
    this.server?.close();
  }
}
