import React, { useState, useEffect, useRef } from 'react'
import { useForgeStore } from '../store/forge'
import { useForgeOrchestrator } from '../hooks/useForgeOrchestrator'

export function ChatView() {
  const { chatHistory, bobStream, bobThinking, userPrompt } = useForgeStore()
  const { chat, start } = useForgeOrchestrator()
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatHistory, bobStream])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || bobThinking) return

    const message = input
    setInput('')
    
    const status = await chat(message)
    
    if (status === 'ready') {
      // Transition to planning/building
      // We need a project name. For now, use a default or derive from prompt.
      const projectName = `project-${Date.now()}`
      await start(projectName, userPrompt)
    }
  }

  return (
    <div className="page chat-view">
      <div className="chat-header">
        <h2 style={{ color: '#00f2fe' }}>⬡ Forge Consultant</h2>
        <div className="muted">Refining project details with Bob Shell</div>
      </div>

      <div className="chat-messages" ref={scrollRef}>
        {chatHistory.length === 0 && (
          <div className="message system">
            Bob is ready to hear your project idea.
          </div>
        )}
        
        {chatHistory.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            <div className="sender">{m.role === 'user' ? 'You' : 'Bob'}</div>
            <div className="content">{m.content}</div>
          </div>
        ))}

        {bobThinking && bobStream && (
          <div className="message bob thinking">
            <div className="sender">Bob</div>
            <div className="content">{bobStream}</div>
          </div>
        )}
      </div>

      <form className="chat-input-area" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={bobThinking ? "Bob is thinking..." : "Type your message..."}
          disabled={bobThinking}
          autoFocus
        />
        <button type="submit" disabled={bobThinking || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}
