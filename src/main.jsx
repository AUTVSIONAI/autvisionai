import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// 🔧 Ativar middleware de correção de URLs malformadas do Supabase
import '@/utils/supabaseUrlFixer.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)