# Forge Storage Implementation Guide

## Overview

The Forge extension now uses a file-based persistent storage system instead of in-memory storage. All chat instances and their history are automatically saved to the `.forge` directory within your workspace.

## Key Features

✅ **Automatic Persistence**: Chat instances are automatically saved to disk
✅ **No Data Loss**: Survives VS Code restarts and crashes
✅ **Per-Project Storage**: Each workspace has its own `.forge` directory
✅ **Git-Friendly**: Automatically added to `.gitignore`
✅ **Zero Configuration**: Works out of the box

## Directory Structure

When you initialize the Forge extension, it automatically creates this structure:

```
<workspace>/.forge/
├── history/
│   └── chat-instances.json    # Persistent chat instance storage
├── logs/
│   └── services/              # Service-specific logs
├── cache/                     # Temporary cached data
└── temp/                      # Auto-cleaned temporary files
```

## How It Works

### 1. Initialization

When the extension activates:
1. [`ForgeStorageManager`](../src/services/ForgeStorageManager.ts) is initialized first
2. Creates the `.forge` directory structure if it doesn't exist
3. Adds `.forge/` to your `.gitignore` automatically
4. Loads existing chat instances from disk

### 2. Automatic Saving

Chat instances are automatically saved when:
- A new chat instance is created
- A subagent is spawned
- A subagent status is updated
- Chat instances are cleared

The save operation is debounced to prevent excessive disk writes.

### 3. Loading on Startup

When the webview loads:
1. Sends a `LOAD_STORAGE` message to the extension
2. Extension reads [`chat-instances.json`](../src/services/ForgeStorageManager.ts:145)
3. Returns the data to the webview
4. Webview restores the state

## Architecture

### Backend (Extension)

**[`ForgeStorageManager`](../src/services/ForgeStorageManager.ts)** - Core storage service
- Manages `.forge` directory structure
- Provides async file I/O operations
- Handles write queuing to prevent race conditions
- Implements cleanup and maintenance tasks

**[`ForgeSidebarProvider`](../src/providers/ForgeSidebarProvider.ts:86)** - Message handler
- Handles `LOAD_STORAGE` messages from webview
- Handles `SAVE_STORAGE` messages from webview
- Bridges between webview and storage manager

**[`ForgeController`](../src/ForgeController.ts:38)** - Service coordinator
- Initializes storage manager first
- Wires up dependencies
- Provides access to storage manager

### Frontend (Webview)

**[`forge.js`](../renderer/src/store/forge.js:24)** - Zustand store
- Removed VSCode state persistence
- Added file-based storage adapter
- Implements `initializeStorage()` for loading
- Implements `persistStorage()` for saving
- Auto-saves on state changes

**[`App.jsx`](../renderer/src/App.jsx:18)** - React component
- Calls `initializeStorage()` on mount
- Shows loading state until storage is ready
- Ensures data is loaded before rendering

## Storage Format

### chat-instances.json

```json
{
  "metadata": {
    "version": "1.0.0",
    "lastModified": "2026-05-03T10:30:00.000Z"
  },
  "instances": [
    {
      "id": "chat-1234567890-abc123",
      "label": "Chat #1",
      "timestamp": 1714737000000,
      "subagents": [
        {
          "id": "task-1",
          "name": "Build React App",
          "description": "Create a new React application",
          "status": "done",
          "output": "Successfully created app",
          "error": null,
          "chatInstanceId": "chat-1234567890-abc123"
        }
      ]
    }
  ],
  "currentInstanceId": "chat-1234567890-abc123"
}
```

## API Reference

### ForgeStorageManager

#### `saveChatInstances(instances, currentInstanceId)`
Saves chat instances to disk.

```typescript
await storageManager.saveChatInstances(
  [{ id: 'chat-1', label: 'Chat #1', timestamp: Date.now(), subagents: [] }],
  'chat-1'
);
```

#### `loadChatInstances()`
Loads chat instances from disk.

```typescript
const { instances, currentInstanceId } = await storageManager.loadChatInstances();
```

#### `getStorageStats()`
Returns storage usage statistics.

```typescript
const stats = await storageManager.getStorageStats();
// { totalSize, chatInstancesSize, logsSize, cacheSize }
```

#### `cleanupTempFiles(maxAgeHours)`
Removes temporary files older than specified age.

```typescript
const deletedCount = await storageManager.cleanupTempFiles(24);
```

### Zustand Store

#### `initializeStorage()`
Loads initial state from file system.

```javascript
const initializeStorage = useForgeStore(state => state.initializeStorage);
await initializeStorage();
```

#### `persistStorage()`
Manually triggers a save to file system.

```javascript
const persistStorage = useForgeStore(state => state.persistStorage);
persistStorage();
```

## Message Protocol

### LOAD_STORAGE

**Direction**: Webview → Extension

**Payload**: None

**Response**: `STORAGE_LOADED` message with data

```javascript
window.vscode.postMessage({ command: 'LOAD_STORAGE' });
```

### STORAGE_LOADED

**Direction**: Extension → Webview

**Payload**: `{ instances: ChatInstance[], currentInstanceId: string | null }`

```javascript
{
  command: 'STORAGE_LOADED',
  data: {
    instances: [...],
    currentInstanceId: 'chat-123'
  }
}
```

### SAVE_STORAGE

**Direction**: Webview → Extension

**Payload**: `{ chatInstances: ChatInstance[], currentChatInstanceId: string | null }`

```javascript
window.vscode.postMessage({
  command: 'SAVE_STORAGE',
  data: {
    chatInstances: [...],
    currentChatInstanceId: 'chat-123'
  }
});
```

## Performance Considerations

### Write Batching

Saves are debounced using `setTimeout` to prevent excessive disk writes:

```javascript
setTimeout(() => fileStorage.saveState(instances, currentId), 0);
```

### Write Queue

The storage manager uses a write queue to prevent race conditions:

```typescript
private writeQueue: Map<string, Promise<void>> = new Map();
```

### Async Operations

All file operations are asynchronous to avoid blocking the extension:

```typescript
await fs.promises.writeFile(path, data, 'utf-8');
```

## Error Handling

### Graceful Degradation

If storage operations fail:
1. Error is logged to output channel
2. Extension continues with empty state
3. User is not blocked from using the extension

### Recovery

If [`chat-instances.json`](../src/services/ForgeStorageManager.ts:145) is corrupted:
1. File is ignored
2. Fresh state is created
3. Old file can be manually recovered from backup

## Maintenance

### Automatic Cleanup

On extension activation:
- Temporary files older than 24 hours are deleted
- Storage statistics are logged

### Manual Cleanup

Users can manually delete the `.forge` directory to reset all storage:

```bash
rm -rf .forge
```

The directory will be recreated on next activation.

## Migration from Old System

The old system used VSCode webview state persistence. The new system:

1. **Does not migrate old data automatically** - old state is lost on first load
2. **Starts fresh** - users begin with empty chat instances
3. **Future enhancement** - migration logic can be added if needed

## Troubleshooting

### Storage not persisting

**Check**: Is `.forge/history/chat-instances.json` being created?

```bash
ls -la .forge/history/
```

**Solution**: Check file permissions and disk space.

### Data not loading on startup

**Check**: Browser console for errors

**Solution**: Verify message handlers are registered in [`ForgeSidebarProvider`](../src/providers/ForgeSidebarProvider.ts:86)

### Performance issues

**Check**: Size of [`chat-instances.json`](../src/services/ForgeStorageManager.ts:145)

```bash
du -h .forge/history/chat-instances.json
```

**Solution**: Implement data pruning or archival for old instances.

## Best Practices

1. **Don't commit `.forge/`** - It's automatically added to `.gitignore`
2. **Regular backups** - Consider backing up `.forge/history/` for important projects
3. **Monitor size** - Large chat histories may slow down load times
4. **Clean up old data** - Periodically remove old chat instances

## Future Enhancements

- [ ] Compression for old chat instances
- [ ] Export/import functionality
- [ ] Cloud sync option
- [ ] Search across chat history
- [ ] Analytics dashboard

## Related Files

- [`ForgeStorageManager.ts`](../src/services/ForgeStorageManager.ts) - Core storage implementation
- [`ForgeSidebarProvider.ts`](../src/providers/ForgeSidebarProvider.ts) - Message handling
- [`forge.js`](../renderer/src/store/forge.js) - Frontend store
- [`App.jsx`](../renderer/src/App.jsx) - React initialization
- [`ForgeController.ts`](../src/ForgeController.ts) - Service coordination
- [`extension.ts`](../src/extension.ts) - Extension activation

## Support

For issues or questions:
1. Check the output channel: "Forge"
2. Review logs in `.forge/logs/`
3. Open an issue on GitHub