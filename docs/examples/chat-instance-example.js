/**
 * Chat Instance Grouping - Usage Examples
 * 
 * This file demonstrates how to use the chat instance grouping feature
 * in the Forge sidebar.
 */

// ============================================================================
// Example 1: Basic Usage - Single Chat Instance
// ============================================================================

function example1_basicUsage() {
  // Generate a unique chat instance ID
  const chatId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Initialize the chat instance
  vscode.postMessage({
    command: 'NEW_CHAT_INSTANCE',
    payload: { chatInstanceId: chatId }
  });
  
  // Spawn multiple subagents in this chat instance
  vscode.postMessage({
    command: 'SPAWN_SUBAGENT',
    data: {
      id: 'task-1',
      name: 'Analyze Codebase',
      description: 'Analyzing project structure and dependencies',
      chatInstanceId: chatId
    }
  });
  
  vscode.postMessage({
    command: 'SPAWN_SUBAGENT',
    data: {
      id: 'task-2',
      name: 'Generate Documentation',
      description: 'Creating API documentation',
      chatInstanceId: chatId
    }
  });
  
  // Update subagent status
  vscode.postMessage({
    command: 'UPDATE_SUBAGENT',
    data: {
      id: 'task-1',
      patch: { status: 'done', output: 'Analysis complete!' }
    }
  });
}

// ============================================================================
// Example 2: Multiple Chat Instances
// ============================================================================

function example2_multipleChats() {
  // First conversation
  const chat1 = `chat-${Date.now()}-001`;
  vscode.postMessage({
    command: 'NEW_CHAT_INSTANCE',
    payload: { chatInstanceId: chat1 }
  });
  
  vscode.postMessage({
    command: 'SPAWN_SUBAGENT',
    data: {
      id: 'chat1-task1',
      name: 'Fix Authentication Bug',
      description: 'Investigating login issues',
      chatInstanceId: chat1
    }
  });
  
  // Second conversation (different topic)
  const chat2 = `chat-${Date.now()}-002`;
  vscode.postMessage({
    command: 'NEW_CHAT_INSTANCE',
    payload: { chatInstanceId: chat2 }
  });
  
  vscode.postMessage({
    command: 'SPAWN_SUBAGENT',
    data: {
      id: 'chat2-task1',
      name: 'Add Dark Mode',
      description: 'Implementing dark theme support',
      chatInstanceId: chat2
    }
  });
  
  // Result: Two separate groups in the sidebar
  // Chat #1: Fix Authentication Bug
  // Chat #2: Add Dark Mode
}

// ============================================================================
// Example 3: Auto-Grouping (No Chat Instance ID)
// ============================================================================

function example3_autoGrouping() {
  // If you don't provide chatInstanceId, it auto-creates one
  vscode.postMessage({
    command: 'SPAWN_SUBAGENT',
    data: {
      id: 'auto-task-1',
      name: 'Quick Task',
      description: 'This will be auto-grouped'
      // No chatInstanceId - system creates one automatically
    }
  });
  
  vscode.postMessage({
    command: 'SPAWN_SUBAGENT',
    data: {
      id: 'auto-task-2',
      name: 'Another Quick Task',
      description: 'This will be in the same auto-created group'
      // No chatInstanceId - uses current instance
    }
  });
}

// ============================================================================
// Example 4: Bob IDE Integration Pattern
// ============================================================================

class BobChatSession {
  constructor() {
    this.chatId = null;
    this.taskCounter = 0;
  }
  
  // Start a new conversation
  startNewConversation() {
    this.chatId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.taskCounter = 0;
    
    vscode.postMessage({
      command: 'NEW_CHAT_INSTANCE',
      payload: { chatInstanceId: this.chatId }
    });
    
    console.log(`Started new chat instance: ${this.chatId}`);
  }
  
  // Add a task to the current conversation
  addTask(name, description) {
    if (!this.chatId) {
      this.startNewConversation();
    }
    
    const taskId = `${this.chatId}-task-${++this.taskCounter}`;
    
    vscode.postMessage({
      command: 'SPAWN_SUBAGENT',
      data: {
        id: taskId,
        name: name,
        description: description,
        chatInstanceId: this.chatId
      }
    });
    
    return taskId;
  }
  
  // Update task status
  updateTask(taskId, status, output = null, error = null) {
    const patch = { status };
    if (output) patch.output = output;
    if (error) patch.error = error;
    
    vscode.postMessage({
      command: 'UPDATE_SUBAGENT',
      data: { id: taskId, patch }
    });
  }
  
  // End current conversation
  endConversation() {
    console.log(`Ended chat instance: ${this.chatId}`);
    this.chatId = null;
    this.taskCounter = 0;
  }
}

// Usage:
function example4_bobIntegration() {
  const session = new BobChatSession();
  
  // User asks: "Help me refactor this code"
  session.startNewConversation();
  const task1 = session.addTask('Analyze Code', 'Analyzing code structure');
  session.updateTask(task1, 'running');
  // ... do work ...
  session.updateTask(task1, 'done', 'Analysis complete');
  
  const task2 = session.addTask('Suggest Refactoring', 'Generating suggestions');
  session.updateTask(task2, 'running');
  // ... do work ...
  session.updateTask(task2, 'done', 'Suggestions ready');
  
  session.endConversation();
  
  // User asks a new question: "Add unit tests"
  session.startNewConversation();
  const task3 = session.addTask('Generate Tests', 'Creating test cases');
  session.updateTask(task3, 'running');
  // ... do work ...
  session.updateTask(task3, 'done', 'Tests created');
  
  session.endConversation();
  
  // Result in sidebar:
  // Chat #2 (11:30 AM) - 1 request
  //   └─ Generate Tests
  //
  // Chat #1 (11:15 AM) - 2 requests
  //   ├─ Analyze Code
  //   └─ Suggest Refactoring
}

// ============================================================================
// Example 5: Error Handling
// ============================================================================

function example5_errorHandling() {
  const chatId = `chat-${Date.now()}`;
  
  vscode.postMessage({
    command: 'NEW_CHAT_INSTANCE',
    payload: { chatInstanceId: chatId }
  });
  
  const taskId = 'error-task-1';
  vscode.postMessage({
    command: 'SPAWN_SUBAGENT',
    data: {
      id: taskId,
      name: 'Risky Operation',
      description: 'Attempting complex task',
      chatInstanceId: chatId
    }
  });
  
  // Update to running
  vscode.postMessage({
    command: 'UPDATE_SUBAGENT',
    data: {
      id: taskId,
      patch: { status: 'running' }
    }
  });
  
  // Simulate error
  vscode.postMessage({
    command: 'UPDATE_SUBAGENT',
    data: {
      id: taskId,
      patch: {
        status: 'failed',
        error: 'Operation failed: Network timeout'
      }
    }
  });
}

// ============================================================================
// Example 6: Reading State from Store
// ============================================================================

function example6_readingState() {
  // In React component or webview
  const { chatInstances, currentChatInstanceId } = useForgeStore();
  
  console.log('All chat instances:', chatInstances);
  console.log('Current chat:', currentChatInstanceId);
  
  // Find specific chat instance
  const currentChat = chatInstances.find(ci => ci.id === currentChatInstanceId);
  if (currentChat) {
    console.log(`Current chat has ${currentChat.subagents.length} requests`);
  }
  
  // Get all subagents across all chats
  const allSubagents = chatInstances.flatMap(ci => ci.subagents);
  console.log(`Total requests: ${allSubagents.length}`);
}

// ============================================================================
// Export for testing
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    example1_basicUsage,
    example2_multipleChats,
    example3_autoGrouping,
    example4_bobIntegration,
    example5_errorHandling,
    example6_readingState,
    BobChatSession
  };
}

// Made with Bob
