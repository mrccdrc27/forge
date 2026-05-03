import React from 'react'
import { useForgeStore } from '../store/forge'
import { AgentCard } from './AgentCard'

export function ActivityStream() {
  const chatInstances = useForgeStore((state) => state.chatInstances)
  
  // Show all chat instances, latest first
  const displayInstances = [...chatInstances].reverse()

  if (chatInstances.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontStyle: 'italic' }}>
        No MCP requests detected yet...
      </div>
    )
  }

  return (
    <div className="activity-stream" style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
      <div className="panel-title" style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '15px', letterSpacing: '1.5px', borderBottom: '1px solid #333', paddingBottom: '8px' }}>
        MCP REQUEST LOG
      </div>
      <div className="chat-instances-list">
        {displayInstances.map((instance, idx) => (
          <div key={instance.id} className="chat-instance-group" style={{ marginBottom: '24px' }}>
            {/* Chat Instance Header */}
            <div className="chat-instance-header" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              padding: '8px 12px',
              background: 'rgba(0, 242, 254, 0.05)',
              borderLeft: '3px solid var(--accent-cyan)',
              borderRadius: '4px'
            }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 'bold',
                color: 'var(--accent-cyan)',
                letterSpacing: '0.5px'
              }}>
                {instance.label}
              </div>
              <div style={{
                fontSize: '0.65rem',
                color: '#666',
                marginLeft: 'auto'
              }}>
                {new Date(instance.timestamp).toLocaleTimeString()}
              </div>
              <div style={{
                fontSize: '0.65rem',
                color: '#888',
                background: 'rgba(0, 242, 254, 0.1)',
                padding: '2px 8px',
                borderRadius: '10px'
              }}>
                {instance.subagents.length} {instance.subagents.length === 1 ? 'request' : 'requests'}
              </div>
            </div>
            
            {/* Subagents for this chat instance */}
            <div className="agents-list" style={{ paddingLeft: '8px' }}>
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
