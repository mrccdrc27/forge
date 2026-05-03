import React from 'react'
import { useForgeStore } from './store/forge'
import { BobcoinFuelGauge } from './components/BobcoinFuelGauge'
import { ActivityStream } from './components/ActivityStream'
import './App.css'

export default function App() {
  const updateBobcoins = useForgeStore((state) => state.updateBobcoins)
  const spawnSubagent = useForgeStore((state) => state.spawnSubagent)
  const updateSubagent = useForgeStore((state) => state.updateSubagent)
  const setPhase = useForgeStore((state) => state.setPhase)
  const ensureChatInstance = useForgeStore((state) => state.ensureChatInstance)

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
  
  return (
    <div className="page" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#00f2fe', fontSize: '1.5rem', margin: 0 }}>⬡ Forge</h1>
        <BobcoinFuelGauge compact />
      </div>
      
      <ActivityStream />
    </div>
  )
}
