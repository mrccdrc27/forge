import React from 'react'
import { useForgeStore } from '../store/forge'

export const BobcoinFuelGauge = () => {
  const { total, saved, limit } = useForgeStore((state) => state.bobcoins)
  
  const percentage = Math.min((total / limit) * 100, 100)
  const isWarning = total > limit * 0.8
  const isCritical = total >= limit

  return (
    <div className="fuel-gauge">
      <div className="gauge-header">
        <span className="gauge-title">Bobcoin Fuel</span>
        <span className="gauge-stats">{total} / {limit} BC</span>
      </div>
      
      <div className="gauge-track">
        <div 
          className={`gauge-fill ${isCritical ? 'critical' : isWarning ? 'warning' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="gauge-footer">
        <span className="saved-label">Arbitrage Savings:</span>
        <span className="saved-value">+{saved} BC</span>
      </div>

      {isWarning && !isCritical && <div className="gauge-alert">Approaching Budget Limit!</div>}
      {isCritical && <div className="gauge-alert critical">BUDGET EXCEEDED!</div>}
    </div>
  )
}
