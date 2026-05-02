import React from 'react'
import { BuildView } from './pages/BuildView'
import { ChatView } from './pages/ChatView'
import { useForgeStore } from './store/forge'
import { BobcoinFuelGauge } from './components/BobcoinFuelGauge'
import './App.css'

export default function App() {
  const phase = useForgeStore((state) => state.phase)
  const setPhase = useForgeStore((state) => state.setPhase)
  const updateBobcoins = useForgeStore((state) => state.updateBobcoins)

  // Bind bridge to store
  React.useEffect(() => {
    if (window.forge) {
      window.forge._updateBobcoins = updateBobcoins
    }
  }, [updateBobcoins])
  
  if (phase === 'idle') {
    return (
      <div className="page" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: '#00f2fe', fontSize: '3rem', margin: 0 }}>⬡ Forge</h1>
        <p style={{ color: '#888', marginBottom: '20px' }}>Universal AI Orchestration</p>
        
        <BobcoinFuelGauge />

        <button 
          onClick={() => setPhase('interview')}
          style={{ padding: '12px 30px', fontSize: '1rem', marginTop: '20px' }}
        >
          Begin Discovery
        </button>
      </div>
    )
  }

  if (phase === 'interview') {
    return <ChatView />
  }

  return <BuildView />
}
