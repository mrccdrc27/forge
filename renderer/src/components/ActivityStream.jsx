import React from 'react'
import { useForgeStore } from '../store/forge'
import { AgentCard } from './AgentCard'

export function ActivityStream() {
  const subagents = useForgeStore((state) => state.subagents)
  
  // Show all activities, latest first
  const displayAgents = [...subagents].reverse()

  if (subagents.length === 0) {
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
      <div className="agents-list">
        {displayAgents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  )
}
