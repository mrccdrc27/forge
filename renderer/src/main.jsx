import React from 'react'
import ReactDOM from 'react-dom/client'
import './bridge'
import App from './App'

console.log('Renderer process starting...')
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
