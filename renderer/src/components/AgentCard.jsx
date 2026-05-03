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
    <div className={`agent-card status-${agent.status} ${isRunning ? 'active-task' : ''}`}>
      <div className="agent-header">
        <div className="agent-status-icon">{STATUS_ICON[agent.status]}</div>
        <div className="agent-name">{agent.name}</div>
        {agent.output && (
          <button
            className="copy-button"
            onClick={handleCopy}
            title="Copy output to clipboard"
            style={{
              background: copied ? 'var(--success-color)' : 'transparent',
              color: copied ? '#000' : 'var(--accent-cyan)',
              borderColor: copied ? 'var(--success-color)' : 'var(--accent-cyan)'
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </div>
      
      <div className="agent-body">
        <div>
          <div className="agent-section-label">Input</div>
          <div className="agent-desc">
            {agent.description}
          </div>
        </div>
        
        {isRunning && (
          <div className="agent-live-log">
            <span className="typing-cursor">_</span> Forge is processing...
          </div>
        )}

        {(agent.output || agent.error) && (
          <div>
            <div className="agent-section-label">
              {agent.error ? 'Error' : 'Output'}
            </div>
            <div
              className={agent.error ? 'agent-error-detail' : 'agent-output-summary'}
            >
              {agent.error || (typeof agent.output === 'string' ? agent.output : 'Success.')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
