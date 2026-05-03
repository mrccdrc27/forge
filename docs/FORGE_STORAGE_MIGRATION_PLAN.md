# Forge Storage Migration Plan

## Overview

Migrate all Forge context persistence to a centralized `.forge` directory structure within each project. This provides better organization, easier cleanup, and clearer separation of Forge-specific data from project files.

## Current Storage Analysis

### Identified Persistence Points

1. **RetryAdvisor** (`src/services/RetryAdvisor.ts`)
   - Current: `<workspace>/.forge/retry_history.json`
   - Stores error patterns and attempted fixes across sessions

2. **HistoryExporter** (`src/services/HistoryExporter.ts`)
   - Current: Exports from `~/.bob/tmp` to `<workspace>/bob_sessions/`
   - Copies Bob session files to workspace

3. **BaseService Logging** (`src/services/BaseService.ts`)
   - Current: VSCode Output Channel only (not persisted to disk)
   - All services log through `this.log()` method

4. **MCP Call Tracking**
   - Current: No persistent logging
   - MCP tool calls are only visible in Output Channel

5. **ConfigManager** (`src/services/ConfigManager.ts`)
   - Current: `<workspace>/forge.config.json`
   - User configuration file

## Proposed `.forge` Directory Structure

```
<workspace>/.forge/
├── config.json                 # Alternative location for forge.config.json
├── logs/
│   ├── forge.log              # Main extension log (rotating)
│   ├── mcp-calls.log          # MCP tool call history with timestamps
│   ├── watsonx.log            # Watsonx API calls and responses
│   └── services/
│       ├── atomic-writer.log
│       ├── resource-sentry.log
│       ├── build-engine.log
│       └── ...                # One log per service
├── history/
│   ├── retry_history.json     # Error patterns and fixes
│   ├── sessions/              # Bob session exports
│   │   ├── 2026-05-03_session_abc123.json
│   │   └── ...
│   └── builds/                # Build history
│       ├── 2026-05-03_project-name.json
│       └── ...
├── cache/
│   ├── codebase-analysis.json # Cached analysis results
│   ├── dependency-cache.json  # Dependency metadata cache
│   └── system-context.json    # Cached system context
└── temp/
    └── ...                    # Temporary files (auto-cleaned)
```

## Design Principles

1. **Automatic Initialization**: `.forge` directory created automatically on extension activation
2. **Per-Project Isolation**: Each workspace has its own `.forge` directory
3. **Structured Organization**: Clear separation by data type (logs, history, cache, temp)
4. **Rotation & Cleanup**: Automatic log rotation and old file cleanup
5. **Git-Friendly**: `.forge` added to `.gitignore` by default (with user prompt)
6. **Migration Support**: Automatic migration of existing data to new structure

## Implementation Strategy

### Phase 1: Core Infrastructure

#### 1.1 Create ForgeStorageManager Service

**File**: `src/services/ForgeStorageManager.ts`

**Responsibilities**:
- Initialize `.forge` directory structure
- Provide typed APIs for reading/writing to specific locations
- Handle log rotation and cleanup
- Manage migrations from old storage locations
- Ensure thread-safe file operations

**Key Methods**:
```typescript
class ForgeStorageManager {
  // Initialization
  async init(): Promise<void>
  async ensureDirectoryStructure(): Promise<void>
  
  // Configuration
  async getConfig(): Promise<ForgeConfig>
  async saveConfig(config: ForgeConfig): Promise<void>
  
  // Logging
  async appendLog(category: string, message: string): Promise<void>
  async appendMCPCall(call: MCPCallLog): Promise<void>
  async getRecentLogs(category: string, lines: number): Promise<string[]>
  
  // History
  async saveRetryHistory(history: RetryContext[]): Promise<void>
  async loadRetryHistory(): Promise<RetryContext[]>
  async saveBuildHistory(build: BuildRecord): Promise<void>
  async exportSession(sessionData: any): Promise<void>
  
  // Cache
  async getCachedAnalysis(key: string): Promise<any>
  async setCachedAnalysis(key: string, data: any, ttl?: number): Promise<void>
  async clearCache(): Promise<void>
  
  // Cleanup
  async rotateLog(category: string, maxSize: number): Promise<void>
  async cleanupOldFiles(maxAge: number): Promise<void>
  
  // Migration
  async migrateExistingData(): Promise<MigrationReport>
}
```

#### 1.2 Update BaseService

**File**: `src/services/BaseService.ts`

**Changes**:
- Add optional `storageManager` dependency
- Enhance `log()` method to persist to disk via StorageManager
- Add structured logging support (levels: debug, info, warn, error)

```typescript
export abstract class BaseService implements IForgeService {
  constructor(
    public readonly id: string, 
    protected output: vscode.OutputChannel,
    protected storageManager?: ForgeStorageManager
  ) {}
  
  protected async log(message: string, level: 'debug' | 'info' | 'warn' | 'error' = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${this.id}] ${message}`;
    
    // Output channel (existing behavior)
    this.output.appendLine(logMessage);
    
    // Persist to disk (new behavior)
    if (this.storageManager) {
      await this.storageManager.appendLog(this.id, `${timestamp} [${level.toUpperCase()}] ${message}`);
    }
  }
}
```

### Phase 2: Service Updates

#### 2.1 Update RetryAdvisor

**Changes**:
- Remove direct file operations
- Use `storageManager.saveRetryHistory()` and `storageManager.loadRetryHistory()`
- Path changes from `.forge/retry_history.json` to `.forge/history/retry_history.json`

#### 2.2 Update HistoryExporter

**Changes**:
- Export to `.forge/history/sessions/` instead of `bob_sessions/`
- Use `storageManager.exportSession()`
- Add metadata to exported sessions (timestamp, project info)

#### 2.3 Update MCPHub

**Changes**:
- Log all MCP tool calls to `.forge/logs/mcp-calls.log`
- Include: timestamp, tool name, arguments, result, duration, tokens used
- Format as JSONL (JSON Lines) for easy parsing

```typescript
// In MCPHub.setRequestHandler(CallToolRequestSchema, ...)
const callLog: MCPCallLog = {
  timestamp: new Date().toISOString(),
  tool: name,
  arguments: args,
  result: response,
  duration: endTime - startTime,
  tokens: { input: ..., output: ... },
  cost: ...
};
await this.storageManager.appendMCPCall(callLog);
```

#### 2.4 Update WatsonxClient

**Changes**:
- Log all Watsonx API calls to `.forge/logs/watsonx.log`
- Include: model, prompt (truncated), response (truncated), tokens, latency

### Phase 3: Migration & Initialization

#### 3.1 Extension Activation Flow

**File**: `src/extension.ts`

```typescript
export async function activate(context: vscode.ExtensionContext) {
  // ... existing code ...
  
  // Initialize StorageManager FIRST (before other services)
  const storageManager = new ForgeStorageManager(output);
  await controller.registerService(storageManager);
  
  // Run migration if needed
  const migrationReport = await storageManager.migrateExistingData();
  if (migrationReport.filesMigrated > 0) {
    output.appendLine(`✅ Migrated ${migrationReport.filesMigrated} files to .forge directory`);
  }
  
  // Prompt to add .forge to .gitignore
  await storageManager.ensureGitignore();
  
  // Initialize other services with storageManager
  const config = new ConfigManager(output, storageManager);
  // ... etc
}
```

#### 3.2 Migration Logic

**Migrations to perform**:
1. Move `.forge/retry_history.json` → `.forge/history/retry_history.json`
2. Move `bob_sessions/*` → `.forge/history/sessions/*`
3. Copy `forge.config.json` → `.forge/config.json` (keep original)
4. Create `.forge/.gitignore` with appropriate patterns

#### 3.3 .gitignore Management

**Prompt user** (one-time):
```
Forge uses a .forge directory to store logs and history.
Would you like to add .forge/ to your .gitignore?

[Yes] [No] [Don't ask again]
```

**Auto-create** `.forge/.gitignore`:
```
# Forge temporary files
temp/

# Logs (optional - user may want to commit these)
logs/*.log

# Cache (should not be committed)
cache/
```

### Phase 4: Configuration Updates

#### 4.1 ConfigManager Changes

**Support dual locations**:
1. Primary: `<workspace>/.forge/config.json`
2. Fallback: `<workspace>/forge.config.json` (legacy)

**Load priority**:
```typescript
async loadConfig(): Promise<void> {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  
  // Try .forge/config.json first
  const newConfigPath = path.join(workspaceRoot, '.forge', 'config.json');
  if (fs.existsSync(newConfigPath)) {
    // Load from new location
    return this.loadFromPath(newConfigPath);
  }
  
  // Fallback to legacy location
  const legacyConfigPath = path.join(workspaceRoot, 'forge.config.json');
  if (fs.existsSync(legacyConfigPath)) {
    // Load from legacy location
    // Optionally: prompt to migrate
    return this.loadFromPath(legacyConfigPath);
  }
  
  // Use defaults
}
```

### Phase 5: Cleanup & Maintenance

#### 5.1 Automatic Cleanup

**Scheduled tasks** (run on extension activation):
- Rotate logs > 10MB
- Delete temp files > 7 days old
- Delete cached analysis > 30 days old
- Keep last 100 session exports

#### 5.2 Manual Cleanup Command

**Add command**: `forge.cleanupStorage`
- Shows storage usage breakdown
- Allows selective cleanup
- Provides "Reset All" option

## Data Formats

### MCP Call Log Entry (JSONL)

```json
{
  "timestamp": "2026-05-03T10:30:00.000Z",
  "chatInstanceId": "chat-1234567890-abc123",
  "tool": "forge.build",
  "arguments": {
    "name": "my-app",
    "type": "react-vite",
    "description": "A simple React app"
  },
  "result": {
    "status": "success",
    "filesCreated": 12
  },
  "duration": 5432,
  "tokens": {
    "input": 1250,
    "output": 3400
  },
  "cost": 4.15,
  "model": "meta-llama/llama-3-3-70b-instruct"
}
```

### Build History Entry

```json
{
  "timestamp": "2026-05-03T10:30:00.000Z",
  "projectName": "my-app",
  "type": "react-vite",
  "targetPath": "./my-app",
  "filesCreated": 12,
  "duration": 5432,
  "tokensUsed": 4650,
  "cost": 4.15,
  "success": true
}
```

### Retry History Entry

```json
{
  "timestamp": "2026-05-03T10:30:00.000Z",
  "error": "Module not found: 'react'",
  "attemptedFixes": [
    "npm install react",
    "npm install react-dom"
  ],
  "resolution": "success",
  "advice": "Install missing dependencies"
}
```

## Benefits

1. **Better Organization**: All Forge data in one place
2. **Easier Debugging**: Persistent logs for troubleshooting
3. **Audit Trail**: Complete history of MCP calls and builds
4. **Performance**: Caching reduces redundant API calls
5. **Privacy**: Easy to clean up or exclude from version control
6. **Portability**: Self-contained per-project storage

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Disk space usage | Automatic cleanup, log rotation, configurable retention |
| Performance impact | Async I/O, batched writes, optional logging levels |
| Migration failures | Graceful fallback, detailed error reporting, backup creation |
| User confusion | Clear documentation, helpful error messages, VS Code notifications |

## Testing Strategy

1. **Unit Tests**: ForgeStorageManager methods
2. **Integration Tests**: Service updates with StorageManager
3. **Migration Tests**: Various legacy data scenarios
4. **Performance Tests**: Log writing under load
5. **Manual Tests**: Fresh install, existing project, migration scenarios

## Rollout Plan

1. **Phase 1**: Implement ForgeStorageManager (1-2 days)
2. **Phase 2**: Update services (2-3 days)
3. **Phase 3**: Migration logic (1 day)
4. **Phase 4**: Testing & refinement (2 days)
5. **Phase 5**: Documentation & release (1 day)

**Total Estimated Time**: 7-9 days

## Success Criteria

- [ ] All persistence goes through ForgeStorageManager
- [ ] `.forge` directory auto-created on first run
- [ ] Existing data migrated successfully
- [ ] MCP calls logged with full context
- [ ] Logs rotated automatically
- [ ] No performance degradation
- [ ] Documentation complete
- [ ] User feedback positive

## Future Enhancements

1. **Log Viewer UI**: VS Code webview for browsing logs
2. **Export/Import**: Backup and restore `.forge` data
3. **Analytics**: Usage statistics and insights
4. **Compression**: Compress old logs to save space
5. **Cloud Sync**: Optional sync to cloud storage (user-controlled)