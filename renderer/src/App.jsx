import React from 'react'
import { useForgeStore } from './store/forge'
import { BobcoinFuelGauge } from './components/BobcoinFuelGauge'
import { ActivityStream } from './components/ActivityStream'
import { SettingsPage } from './components/SettingsPage'
import './App.css'

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true)
  const currentView = useForgeStore((state) => state.currentView)
  const setCurrentView = useForgeStore((state) => state.setCurrentView)
  const updateTokenCount = useForgeStore((state) => state.updateTokenCount)
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
      window.forge._updateTokenCount = updateTokenCount
      window.forge._spawnSubagent = spawnSubagent
      window.forge._updateSubagent = updateSubagent
      window.forge._setPhase = setPhase
      window.forge._ensureChatInstance = ensureChatInstance
    }
  }, [updateTokenCount, spawnSubagent, updateSubagent, setPhase, ensureChatInstance])
  
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

  const toggleSettings = () => {
    setCurrentView(currentView === 'main' ? 'settings' : 'main')
  }

  return (
    <div className="page">
      <div className="header">
        <h1>⬡ Forge</h1>
        <div className="header-actions">
          <BobcoinFuelGauge compact />
          <button
            className="settings-toggle-button"
            onClick={toggleSettings}
            title={currentView === 'main' ? 'Open Settings' : 'Back to Main'}
          >
            {currentView === 'main' ? '⚙️' : '←'}
          </button>
        </div>
      </div>
      
      {currentView === 'main' ? (
        <ActivityStream />
      ) : (
        <SettingsPage />
      )}
    </div>
  )
}
