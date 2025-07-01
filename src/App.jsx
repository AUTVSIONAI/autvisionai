import './App.css'
import AppRoutes from "./AppRoutes.jsx"
import { Toaster } from "@/components/ui/toaster"
import { SyncProvider } from "@/contexts/SyncContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { GamificationProvider } from "@/contexts/GamificationContext"

function App() {
  return (
    <AuthProvider>
      <SyncProvider>
        <GamificationProvider>
          <AppRoutes />
          <Toaster />
        </GamificationProvider>
      </SyncProvider>
    </AuthProvider>
  )
}

export default App