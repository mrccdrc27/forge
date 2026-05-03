import React from 'react'

export function SettingsPage() {
  const handleConfigureWatsonx = () => {
    if (window.forge) {
      window.forge.executeCommand('forge.configureWatsonx')
    }
  }

  const handleVerifyWatsonx = () => {
    if (window.forge) {
      window.forge.executeCommand('forge.verifyWatsonx')
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>⚙️ Settings</h2>
        <p className="settings-subtitle">Configure your Forge environment</p>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">IBM Watsonx Configuration</h3>
        <p className="settings-section-description">
          Configure your IBM Watsonx API credentials to enable AI-powered features.
        </p>
        
        <div className="settings-actions">
          <button
            className="settings-button primary"
            onClick={handleConfigureWatsonx}
            title="Configure IBM Watsonx API credentials"
          >
            <span className="button-icon">🔑</span>
            <span className="button-text">Configure Watsonx</span>
          </button>
          
          <button
            className="settings-button secondary"
            onClick={handleVerifyWatsonx}
            title="Test your Watsonx connection"
          >
            <span className="button-icon">✓</span>
            <span className="button-text">Verify Connection</span>
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">About Forge</h3>
        <p className="settings-section-description">
          Forge is a powerful development tool that integrates with IBM Watsonx to provide
          AI-assisted coding capabilities and MCP request monitoring.
        </p>
      </div>
    </div>
  )
}

// Made with Bob
