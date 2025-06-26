import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import { AuthProvider } from '@/contexts/AuthContext'
import { SyncProvider } from '@/contexts/SyncContext'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <SyncProvider>
      <App />
    </SyncProvider>
  </AuthProvider>
) 