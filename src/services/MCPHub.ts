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
import { ConfigManager } from "./ConfigManager";
import { BuildEngine } from "./BuildEngine";
import express from "express";

export class MCPHub extends BaseService {
  private server?: Server;
  private app?: express.Application;
  private httpServer?: any;
  private transports: Map<string, SSEServerTransport> = new Map();
  private writer?: AtomicWriter;
  private sentry?: ResourceSentry;
  private arbitrator?: ResourceArbitrator;
  private config?: ConfigManager;
  private buildEngine?: BuildEngine;
  private serverStarted: boolean = false;

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
    // Don't start server yet - wait for all dependencies to be set
    
    this.log("MCP Hub Initialized (server will start when ready).");
  }

  /**
   * Start the MCP server after all dependencies are injected
   */
  async startServerWhenReady() {
    if (this.serverStarted) {
      this.log("Server already started, skipping.");
      return;
    }

    if (!this.writer) {
      throw new Error("Cannot start MCP server: AtomicWriter not set");
    }

    if (!this.sentry) {
      throw new Error("Cannot start MCP server: ResourceSentry not set");
    }

    if (!this.config) {
      throw new Error("Cannot start MCP server: ConfigManager not set");
    }

    await this.startServer();
    this.serverStarted = true;
    this.log("MCP Hub server started and listening on SSE.");
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

  setConfig(config: ConfigManager) {
    this.config = config;
  }

  setBuildEngine(buildEngine: BuildEngine) {
    this.buildEngine = buildEngine;
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
          description: "Finds the best CLI commands and scripts to scaffold a barebones project based on requirements (Agentic AI)",
          inputSchema: {
            type: "object",
            properties: {
              requirements: { type: "string", description: "The specific requirements for the project (e.g., 'React Vite with Tailwind', 'FastAPI backend')" },
              name: { type: "string", description: "Project name" }
            },
            required: ["requirements", "name"]
          },
        },
        {
          name: "forge.execute_task",
          description: "Delegate a specific coding task to the Forge internal worker model",
          inputSchema: {
            type: "object",
            required: ["task"]
          }
        },
        {
          name: "forge.build",
          description: "Scaffold a complete project from scratch: generates the folder structure, boilerplate files, and configuration based on a plain-language description. Writes everything to disk atomically.",
          inputSchema: {
            type: "object",
            properties: {
              name: { type: "string", description: "Project/module name (used for folder naming and package names)" },
              type: { type: "string", description: "Stack type hint (e.g. 'react-vite', 'express', 'fastapi', 'python-cli'). Use 'auto' to let Forge detect the best fit." },
              description: { type: "string", description: "Plain-language description of what the project does and any specific requirements" },
              targetPath: { type: "string", description: "Optional subfolder path relative to workspace root (default: './<name>')" }
            },
            required: ["name", "description"]
          }
        }
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      const taskId = Math.random().toString(36).substring(7);
      const inputStr = JSON.stringify(args, null, 2);

      // Budget Gating
      const bufferTokens = this.config?.getConfig().budget.toolOverheadBuffer || 500;
      if (this.sentry && !this.sentry.hasBudget(bufferTokens)) {
        throw new Error('Gated: Insufficient Bobcoin budget for tool execution.');
      }

      this._onEvent.fire({ 
        type: 'SPAWN_SUBAGENT', 
        payload: { 
          id: taskId, 
          name: name.replace('forge.', '').toUpperCase(), 
          description: inputStr 
        } 
      });
      this._onEvent.fire({ type: 'UPDATE_SUBAGENT', payload: { id: taskId, patch: { status: 'running' } } });

      try {
        let response: any;
        switch (name) {
          case "forge.ping": {
            response = { content: [{ type: "text", text: "Pong! Forge is alive." }] };
            break;
          }

          case "forge.bulk_write": {
            if (!this.writer) throw new Error("AtomicWriter not initialized");
            const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath || ".";
            await this.writer.bulkWrite(workspaceRoot, (args as any).files);
            response = { content: [{ type: "text", text: `Successfully wrote ${Object.keys((args as any).files).length} files.` }] };
            break;
          }

          case "forge.get_resource_metrics": {
            if (!this.sentry) throw new Error("ResourceSentry not initialized");
            const metrics = this.sentry.getSentryData();
            response = { content: [{ type: "text", text: JSON.stringify(metrics, null, 2) }] };
            break;
          }

          case "forge.scaffold": {
            if (!this.arbitrator) throw new Error("ResourceArbitrator not initialized");
            const { requirements, name: projectName } = args as any;
            const prompt = `You are an expert script finding AI. The user wants to scaffold a new project named "${projectName}" with these requirements: "${requirements}". 
Provide the exact CLI commands (e.g. npx, pip, cargo, django-admin, etc.) to generate the most bare-bones, minimal project structure for this. 
Return ONLY the raw commands in a structured markdown code block. Do not write the actual source code files yourself, just the scaffolding commands.`;
            const result = await this.arbitrator.executeTask({ task: prompt });
            response = { content: [{ type: "text", text: result }] };
            break;
          }

          case "forge.execute_task": {
            if (!this.arbitrator) throw new Error("ResourceArbitrator not initialized");
            const result = await this.arbitrator.executeTask({ task: (args as any).task });
            response = { content: [{ type: "text", text: result }] };
            break;
          }

          case "forge.build": {
            if (!this.buildEngine) throw new Error("BuildEngine not initialized");
            const { name, type = 'auto', description, targetPath } = args as any;
            const result = await this.buildEngine.build({ name, type, description, targetPath });
            response = { content: [{ type: "text", text: result.summary }] };
            break;
          }

          default:
            throw new Error(`Tool not found: ${name}`);
        }

        const outputStr = typeof response.content[0].text === 'string' ? response.content[0].text : JSON.stringify(response, null, 2);
        this._onEvent.fire({ type: 'UPDATE_SUBAGENT', payload: { id: taskId, patch: { status: 'done', output: outputStr } } });
        return response;
      } catch (err: any) {
        this._onEvent.fire({ type: 'UPDATE_SUBAGENT', payload: { id: taskId, patch: { status: 'failed', error: err.message } } });
        throw err;
      }
    });
  }

  private async startServer() {
    try {
      this.app = express();
      const serverConfig = this.config?.getConfig().server;
      const port = serverConfig?.port || 3000;
      const host = serverConfig?.host || 'localhost';

      // CORS middleware
      this.app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        if (req.method === 'OPTIONS') {
          res.sendStatus(200);
          return;
        }
        next();
      });

      // Add error handling middleware
      this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        this.log(`Express middleware error: ${err?.message || err}`);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Internal server error' });
        }
      });

      this.app.get("/sse", async (req: express.Request, res: express.Response) => {
        try {
          // Validate server is ready
          if (!this.server) {
            throw new Error("MCP Server not initialized");
          }

          // Create a new transport for this connection (do NOT close/recreate the Server)
          const transport = new SSEServerTransport("/messages", res);
          const sessionId = transport.sessionId;
          this.transports.set(sessionId, transport);

          // Clean up when client disconnects
          res.on('close', () => {
            this.transports.delete(sessionId);
            this.log(`SSE client disconnected (session ${sessionId}). Active sessions: ${this.transports.size}`);
          });

          await this.server.connect(transport);
          this.log(`Bob connected to MCP SSE (session ${sessionId}). Active sessions: ${this.transports.size}`);
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          this.log(`SSE connection error: ${errorMsg}`);
          if (!res.headersSent) {
            res.status(500).json({
              error: 'SSE initialization failed',
              details: errorMsg
            });
          }
        }
      });

      this.app.post("/messages", async (req: express.Request, res: express.Response) => {
        try {
          // Route by sessionId query param that the SDK appends to the endpoint URL
          const sessionId = (req.query as any).sessionId as string | undefined;
          const transport = sessionId ? this.transports.get(sessionId) : undefined;

          if (!transport) {
            const ids = Array.from(this.transports.keys()).join(', ') || 'none';
            this.log(`Message for unknown session '${sessionId}'. Active sessions: ${ids}`);
            res.status(503).json({
              error: 'No SSE session found.',
              hint: 'Connect to /sse first. Ensure the sessionId query param matches.'
            });
            return;
          }
          await transport.handlePostMessage(req, res);
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          this.log(`Message handling error: ${errorMsg}`);
          if (!res.headersSent) {
            res.status(500).json({
              error: 'Message handling failed',
              details: errorMsg
            });
          }
        }
      });

      // Start server with comprehensive error handling
      const server = this.app.listen(port, host, () => {
        this.log(`✅ MCP SSE Server listening on http://${host}:${port}/sse`);
      });
      this.httpServer = server;

      // Handle server errors
      server.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          this.log(`❌ Port ${port} is already in use. Please change the port in forge.config.json or stop the conflicting service.`);
          throw new Error(`Port ${port} already in use`);
        } else if (err.code === 'EACCES') {
          this.log(`❌ Permission denied to bind to port ${port}. Try using a port > 1024 or run with elevated privileges.`);
          throw new Error(`Permission denied for port ${port}`);
        } else {
          this.log(`❌ Server error: ${err.message || String(err)}`);
          throw err;
        }
      });

      // Handle uncaught errors in server
      server.on('clientError', (err: Error, socket: any) => {
        this.log(`Client error: ${err.message}`);
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
      });

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.log(`❌ Failed to start MCP server: ${errorMsg}`);
      throw new Error(`MCP server startup failed: ${errorMsg}`);
    }
  }

  dispose() {
    this.transports.forEach(t => t.close().catch(() => {}));
    this.transports.clear();
    this.server?.close();
    this.httpServer?.close();
  }
}
