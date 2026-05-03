import React, { useState } from 'react'

const STATUS_ICON = {
  queued: '○',
  running: '◌',
  done: '●',
  failed: '✕'
}

export function AgentCard({ agent }) {
  const isRunning = agent.status === 'running'
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (agent.output) {
      const text = typeof agent.output === 'string' ? agent.output : JSON.stringify(agent.output, null, 2)
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  return (
    <div className={`agent-card status-${agent.status} ${isRunning ? 'active-task' : ''}`} style={{ borderLeft: '3px solid var(--accent-cyan)' }}>
      <div className="agent-header" style={{ marginBottom: '12px' }}>
        <div className="agent-status-icon" style={{ fontSize: '1rem' }}>{STATUS_ICON[agent.status]}</div>
        <div className="agent-name" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>{agent.name}</div>
        {agent.output && (
          <button 
            className="copy-button" 
            onClick={handleCopy}
            title="Copy output to clipboard"
            style={{ 
              marginLeft: 'auto', 
              fontSize: '0.6rem', 
              padding: '2px 8px',
              background: copied ? '#00ff88' : 'rgba(0, 242, 254, 0.1)',
              color: copied ? 'black' : 'var(--accent-cyan)',
              border: '1px solid var(--accent-cyan)',
              borderRadius: '4px',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      
      <div className="agent-body" style={{ paddingLeft: '0' }}>
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '0.65rem', color: '#888', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>Input</div>
          <div className="agent-desc" style={{ 
            fontFamily: 'monospace', 
            fontSize: '0.7rem', 
            background: '#000', 
            padding: '8px', 
            borderRadius: '4px', 
            whiteSpace: 'pre-wrap',
            maxHeight: '150px',
            overflowY: 'auto'
          }}>
            {agent.description}
          </div>
        </div>
        
        {isRunning && (
          <div className="agent-live-log" style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', margin: '10px 0' }}>
            <span className="typing-cursor">_</span> Forge is processing...
          </div>
        )}

        {(agent.output || agent.error) && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.65rem', color: '#888', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
              {agent.error ? 'Error' : 'Output'}
            </div>
            <div className="agent-output-summary" style={{ 
              whiteSpace: 'pre-wrap', 
              maxHeight: '300px', 
              overflowY: 'auto', 
              fontSize: '0.7rem',
              background: agent.error ? 'rgba(255, 68, 68, 0.1)' : '#000',
              color: agent.error ? '#ff4444' : '#fff',
              border: agent.error ? '1px solid #ff4444' : 'none'
            }}>
               {agent.error || (typeof agent.output === 'string' ? agent.output : 'Success.')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
