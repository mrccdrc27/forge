import React from 'react'
import { useForgeStore } from '../store/forge'

export const BobcoinFuelGauge = ({ compact = false }) => {
  const { total, saved, limit } = useForgeStore((state) => state.bobcoins)
  
  const percentage = Math.min((total / limit) * 100, 100)
  const isWarning = total > limit * 0.8
  const isCritical = total >= limit

  if (compact) {
    return (
      <div
        className={`fuel-gauge-compact ${isCritical ? 'critical' : isWarning ? 'warning' : ''}`}
        title={`Bobcoin Usage: ${total}/${limit}${saved > 0 ? ` • Saved: ${saved}BC` : ''}`}
      >
        <div className="compact-track">
          <div className="compact-fill" style={{ width: `${percentage}%` }} />
        </div>
        <span className="compact-label">{total}BC</span>
      </div>
    )
  }

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

      {saved > 0 && (
        <div className="gauge-footer">
          <span className="saved-label">Arbitrage Savings</span>
          <span className="saved-value">+{saved} BC</span>
        </div>
      )}

      {isWarning && !isCritical && (
        <div className="gauge-alert">Approaching Budget Limit</div>
      )}
      {isCritical && (
        <div className="gauge-alert critical">Budget Exceeded</div>
      )}
    </div>
  )
}
