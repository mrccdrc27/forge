import React from 'react'
import { useForgeStore } from '../store/forge'

const PHASE_LABELS = {
  planning: 'Bob is planning...',
  building: 'Watson is building...',
  verifying: 'Bob is verifying...'
}

const STATUS_ICON = {
  queued: '○',
  running: '◌',
  done: '●',
  failed: '✕'
}

export function BuildView() {
  const { phase, bobStream, bobThinking, masterPlan, subagents, verificationReport, iteration, bobcoins } = useForgeStore()
  const isCritical = bobcoins.total >= bobcoins.limit

  return (
    <div className="page build-view">
      {isCritical && (
        <div className="global-warning">
          ⚠️ BUDGET EXCEEDED: Resource Sentry has gated further actions.
        </div>
      )}
      
      <div className="build-header">
        <div className="phase-label">{PHASE_LABELS[phase]}</div>
        <div className="header-actions">
          <BobcoinFuelGauge compact />
          {iteration > 1 && (
            <div className="iteration-badge">iteration {iteration}</div>
          )}
        </div>
      </div>

      <div className="build-layout">
        {/* Left: Bob stream */}
        <div className="bob-panel">
          <div className="panel-title">
            <span className={`dot ${bobThinking ? 'thinking' : ''}`} />
            Bob Shell (Planning & Logic)
          </div>
          <pre className="bob-stream">
            {bobStream || <span className="muted">Waiting for Bob to stream thoughts...</span>}
          </pre>
        </div>

        {/* Right: subagent cards + plan */}
        <div className="agents-panel">
          <div className="panel-title">Active Contractor Status</div>
          {masterPlan && (
            <div className="plan-summary">
              <div className="plan-stack">
                {masterPlan.stack?.framework} · {masterPlan.stack?.language}
              </div>
            </div>
          )}

          <div className="agents-list">
            {subagents.length === 0 && (
              <div className="muted">Subagents will appear here...</div>
            )}
            {subagents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>

          {verificationReport && (
            <div className={`verification-report verdict-${verificationReport.verdict}`}>
              <div className="verdict-label">
                {verificationReport.verdict === 'pass' ? '✓ Verified' : '↻ Retrying'}
              </div>
              <div className="verdict-notes">{verificationReport.notes}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AgentCard({ agent }) {
  const isRunning = agent.status === 'running'
  
  return (
    <div className={`agent-card status-${agent.status} ${isRunning ? 'active-task' : ''}`}>
      <div className="agent-header">
        <div className="agent-status-icon">{STATUS_ICON[agent.status]}</div>
        <div className="agent-name">{agent.name}</div>
      </div>
      
      <div className="agent-body">
        <div className="agent-desc">{agent.description}</div>
        
        {isRunning && (
          <div className="agent-live-log">
            <span className="typing-cursor">_</span> IBM Granite is working...
          </div>
        )}

        {agent.output && (
          <div className="agent-output-summary">
             {typeof agent.output === 'string' ? agent.output : 'Task completed successfully.'}
          </div>
        )}

        {agent.error && (
          <div className="agent-error-detail">
            <strong>Error:</strong> {agent.error}
          </div>
        )}
      </div>
    </div>
  )
}
