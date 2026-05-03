import React from 'react'
import { useForgeStore } from './store/forge'
import { BobcoinFuelGauge } from './components/BobcoinFuelGauge'
import { ActivityStream } from './components/ActivityStream'
import './App.css'

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true)
  const updateBobcoins = useForgeStore((state) => state.updateBobcoins)
  const spawnSubagent = useForgeStore((state) => state.spawnSubagent)
  const updateSubagent = useForgeStore((state) => state.updateSubagent)
  const setPhase = useForgeStore((state) => state.setPhase)
  const ensureChatInstance = useForgeStore((state) => state.ensureChatInstance)
  const initializeStorage = useForgeStore((state) => state.initializeStorage)
  const storageInitialized = useForgeStore((state) => state.storageInitialized)

  // Initialize storage on mount
  React.useEffect(() => {
    initializeStorage().then(() => {
      setIsLoading(false)
    })
  }, [initializeStorage])

  // Bind bridge to store
  React.useEffect(() => {
    if (window.forge) {
      window.forge._updateBobcoins = updateBobcoins
      window.forge._spawnSubagent = spawnSubagent
      window.forge._updateSubagent = updateSubagent
      window.forge._setPhase = setPhase
      window.forge._ensureChatInstance = ensureChatInstance
    }
  }, [updateBobcoins, spawnSubagent, updateSubagent, setPhase, ensureChatInstance])
  
  if (isLoading || !storageInitialized) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-icon">🔨</div>
          <div className="loading-text">Loading Forge...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="header">
        <h1>⬡ Forge</h1>
        <BobcoinFuelGauge compact />
      </div>
      
      <ActivityStream />
    </div>
  )
}
