# Chat Instance Grouping Implementation

## Overview

The Forge sidebar now organizes MCP requests by **chat instance**, providing cleaner organization where each MCP tool call is displayed in its own group. This makes it easy to see individual requests clearly separated.

## What is a Chat Instance?

A **chat instance** represents a single MCP tool call. Currently, each tool call gets its own unique chat instance, ensuring clear separation in the sidebar.

**Current Behavior:**
- Each MCP tool call (forge.ping, forge.build, etc.) creates a new chat instance
- Each request is displayed in its own group with timestamp and metadata
- Clear visual separation between all requests

**Future Enhancement:**
When Bob IDE is updated to provide explicit `chatInstanceId` in MCP requests, related tool calls from the same conversation can be grouped together automatically.

### Example:
```
Chat #1 (10:30 AM) - 3 requests
  ├─ Request 1: Analyze codebase
  ├─ Request 2: Generate documentation
  └─ Request 3: Create tests

Chat #2 (11:15 AM) - 2 requests
  ├─ Request 1: Fix bug in auth
  └─ Request 2: Update dependencies
```

## Implementation Details

### 1. Data Structure

**Chat Instance Object:**
```typescript
interface ChatInstance {
  id: string;              // Unique identifier (e.g., "chat-1234567890-abc123")
  label: string;           // Display label (e.g., "Chat #1")
  timestamp: number;       // When the chat started (Unix timestamp)
  subagents: SubAgent[];   // Array of MCP requests in this chat
}
```

**Subagent Object (Enhanced):**
```typescript
interface SubAgent {
  id: string;
  name: string;
  description: string;
  status: 'queued' | 'running' | 'done' | 'failed';
  output: any;
  error: any;
  chatInstanceId: string;  // NEW: Links to parent chat instance
}
```

### 2. Store Changes (Zustand)

**New State Properties:**
- `chatInstances: ChatInstance[]` - Array of all chat instances
- `currentChatInstanceId: string | null` - ID of the active chat instance

**New Actions:**
- `ensureChatInstance(chatInstanceId?)` - Creates or retrieves a chat instance

**Modified Actions:**
- `spawnSubagent(task)` - Now accepts `chatInstanceId` in task payload
- `updateSubagent(id, patch)` - Updates both flat list and grouped structure
- `clearSubagents()` - Also clears chat instances

### 3. UI Components

**ActivityStream Component:**
- Groups subagents by chat instance
- Displays chat instance header with:
  - Label (e.g., "Chat #1")
  - Timestamp
  - Request count badge
- Shows subagents within each group
- Latest chat instances appear first

**Visual Design:**
```
┌─────────────────────────────────────────┐
│ MCP REQUEST LOG                         │
├─────────────────────────────────────────┤
│ ┌─ Chat #2 ─────── 11:15 AM ─── 2 ─┐  │
│ │  ├─ Request 1: Fix bug           │  │
│ │  └─ Request 2: Update deps       │  │
│ └───────────────────────────────────┘  │
│                                         │
│ ┌─ Chat #1 ─────── 10:30 AM ─── 3 ─┐  │
│ │  ├─ Request 1: Analyze           │  │
│ │  ├─ Request 2: Generate docs     │  │
│ │  └─ Request 3: Create tests      │  │
│ └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 4. Bridge Integration

**New Message Handler:**
```javascript
if (command === 'NEW_CHAT_INSTANCE' && window.forge._ensureChatInstance) {
  window.forge._ensureChatInstance(payload?.chatInstanceId);
}
```

**Enhanced SPAWN_SUBAGENT:**
```javascript
// Payload now includes chatInstanceId
{
  id: 'task-123',
  name: 'Analyze Code',
  description: 'Analyze the codebase structure',
  chatInstanceId: 'chat-1234567890-abc123'  // Optional
}
```

## How to Use

### For Extension Developers

**1. Starting a New Chat Instance:**
```typescript
// Send message to webview
webviewView.webview.postMessage({
  command: 'NEW_CHAT_INSTANCE',
  payload: { chatInstanceId: 'chat-unique-id' }
});
```

**2. Spawning Subagents with Chat Instance:**
```typescript
// Include chatInstanceId in the payload
webviewView.webview.postMessage({
  command: 'SPAWN_SUBAGENT',
  data: {
    id: 'task-123',
    name: 'Task Name',
    description: 'Task description',
    chatInstanceId: 'chat-unique-id'  // Links to chat instance
  }
});
```

**3. Auto-Grouping (Fallback):**
If no `chatInstanceId` is provided, the system automatically:
- Uses the current active chat instance, OR
- Creates a new chat instance with timestamp-based ID

### For Bob IDE Integration

**Current Behavior:**
Each MCP tool call automatically gets its own chat instance. No integration needed.

**Future Enhancement - Conversation Grouping:**
To group related tool calls from the same Bob IDE conversation:

1. **Bob IDE needs to provide `chatInstanceId` in MCP request metadata**
2. Generate a unique `chatInstanceId` when starting a new conversation
3. Include the same `chatInstanceId` in all tool calls within that conversation
4. Forge will automatically group them together

**Example (Future):**
```javascript
// When Bob starts a new conversation
const conversationId = `conv-${Date.now()}-${randomId}`;

// All tool calls in this conversation include the ID
mcpClient.callTool('forge.ping', {}, {
  metadata: { chatInstanceId: conversationId }
});

mcpClient.callTool('forge.build', { name: 'myapp', ... }, {
  metadata: { chatInstanceId: conversationId }
});
```

**Note:** This requires Bob IDE to be updated to pass conversation metadata through MCP. Until then, each tool call appears as a separate chat instance.

## Benefits

1. **Clear Separation** - Each MCP request is clearly separated and easy to identify
2. **Individual Tracking** - See exactly when each tool call was made
3. **Temporal Tracking** - Timestamps show when each request occurred
4. **Request Metadata** - Each group shows the tool name and input parameters
5. **Future-Ready** - Infrastructure ready for conversation grouping when Bob IDE supports it

## State Persistence

The following are persisted across VS Code reloads:
- `chatInstances` - All chat instance groups
- `currentChatInstanceId` - Active chat instance
- `subagents` - Flat list of all subagents (for backward compatibility)

## Migration Notes

**Current State:**
- Each MCP tool call gets its own chat instance automatically
- No code changes required in Bob IDE
- Clear separation of all requests

**Future State (Requires Bob IDE Update):**
- Bob IDE can provide `chatInstanceId` in MCP request metadata
- Related tool calls will be grouped under the same chat instance
- Enables true conversation-based grouping

## Future Enhancements

Potential improvements:
- Collapsible chat instance groups
- Search/filter by chat instance
- Export chat instance history
- Custom chat instance labels
- Chat instance metadata (user, mode, etc.)