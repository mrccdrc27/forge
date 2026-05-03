import React from 'react'
import { useForgeStore } from '../store/forge'

/**
 * Simple token counter display
 * Shows aggregated token count from all LLM usage
 */
export const BobcoinFuelGauge = ({ compact = false }) => {
  const tokenCount = useForgeStore((state) => state.tokenCount)
  
  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString()
  }

  if (compact) {
    return (
      <div
        className="fuel-gauge-compact"
        title={`Total Token Usage: ${formatNumber(tokenCount)} tokens`}
      >
        <span className="compact-label">🪙 {formatNumber(tokenCount)}</span>
      </div>
    )
  }

  return (
    <div className="fuel-gauge">
      <div className="gauge-header">
        <span className="gauge-title">Token Usage</span>
        <span className="gauge-stats">{formatNumber(tokenCount)} tokens</span>
      </div>
      
      <div className="gauge-info">
        <span className="info-label">Total LLM tokens consumed</span>
      </div>
    </div>
  )
}
