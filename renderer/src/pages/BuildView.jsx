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
  const { phase, bobStream, bobThinking, masterPlan, subagents, verificationReport, iteration } = useForgeStore()

  return (
    <div className="page build-view">
      <div className="build-header">
        <div className="phase-label">{PHASE_LABELS[phase]}</div>
        {iteration > 1 && (
          <div className="iteration-badge">iteration {iteration}</div>
        )}
      </div>

      <div className="build-layout">
        {/* Left: Bob stream */}
        <div className="bob-panel">
          <div className="panel-title">
            <span className={`dot ${bobThinking ? 'thinking' : ''}`} />
            Bob Shell
          </div>
          <pre className="bob-stream">
            {bobStream || <span className="muted">Waiting for Bob...</span>}
          </pre>
        </div>

        {/* Right: subagent cards + plan */}
        <div className="agents-panel">
          {masterPlan && (
            <div className="plan-summary">
              <div className="plan-stack">
                {masterPlan.stack?.framework} · {masterPlan.stack?.language}
              </div>
              <div className="plan-estimate">
                scope: {masterPlan.estimate}
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
  return (
    <div className={`agent-card status-${agent.status}`}>
      <div className="agent-status-icon">{STATUS_ICON[agent.status]}</div>
      <div className="agent-info">
        <div className="agent-name">{agent.name}</div>
        <div className="agent-desc">{agent.description}</div>
        {agent.error && (
          <div className="agent-error">{agent.error}</div>
        )}
      </div>
    </div>
  )
}
