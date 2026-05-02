import React from 'react'
import { BuildView } from './pages/BuildView'
import { ChatView } from './pages/ChatView'
import { useForgeStore } from './store/forge'
import './App.css'

export default function App() {
  const phase = useForgeStore((state) => state.phase)
  const setPhase = useForgeStore((state) => state.setPhase)
  
  if (phase === 'idle') {
    return (
      <div className="page" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: '#00f2fe', fontSize: '4rem', margin: 0 }}>⬡ Forge</h1>
        <p style={{ color: '#888', marginBottom: '30px' }}>Orchestrating autonomous builds with Bob Shell & Watsonx</p>
        <button 
          onClick={() => setPhase('interview')}
          style={{ padding: '15px 40px', fontSize: '1.2rem' }}
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
