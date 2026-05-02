import React from 'react'
import { BuildView } from './pages/BuildView'
import { useForgeStore } from './store/forge'

export default function App() {
  const phase = useForgeStore((state) => state.phase)
  
  if (phase === 'idle') {
    return (
      <div style={{ padding: '20px' }}>
        <h1 style={{ color: '#00f2fe' }}>⬡ Forge</h1>
        <p>Ready to build. Enter a prompt to begin.</p>
        <button onClick={() => useForgeStore.getState().setPhase('planning')}>
          Start Mock Planning
        </button>
      </div>
    )
  }
  return <BuildView />
}
