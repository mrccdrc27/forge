import React from 'react'
import { useForgeStore } from '../store/forge'
import { AgentCard } from './AgentCard'

export function ActivityStream() {
  const chatInstances = useForgeStore((state) => state.chatInstances)
  
  // Show all chat instances, latest first
  const displayInstances = [...chatInstances].reverse()

  if (chatInstances.length === 0) {
    return (
      <div className="empty-state">
        No MCP requests detected yet...
      </div>
    )
  }

  return (
    <div className="activity-stream">
      <div className="panel-title">
        MCP REQUEST LOG
      </div>
      <div className="chat-instances-list">
        {displayInstances.map((instance) => (
          <div key={instance.id} className="chat-instance-group">
            <div className="chat-instance-header">
              <div>
                {instance.label}
              </div>
              <div>
                {new Date(instance.timestamp).toLocaleTimeString()}
              </div>
              <div>
                {instance.subagents.length} {instance.subagents.length === 1 ? 'request' : 'requests'}
              </div>
            </div>
            
            <div className="agents-list">
              {[...instance.subagents].reverse().map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
