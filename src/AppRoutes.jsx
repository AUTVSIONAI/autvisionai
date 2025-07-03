import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '@/contexts/AuthContext';
import ClientPage from './pages/ClientPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import LandingPage from './pages/LandingPage';
import Admin from './pages/Admin';
import ClientLayout from './pages/ClientLayout';
import Settings from './pages/Settings';
import Agents from './pages/Agents';
import Routines from './pages/Routines';
import Integrations from './pages/Integrations';
import Plans from './pages/Plans';
import Gamification from './components/client/Gamification';
import SmartRedirect from './components/SmartRedirect';
import TestPage from './pages/TestPage';

// COMPONENTE DE ROTA PROTEGIDA
function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  
  // Aguardar carregamento inicial
  if (initializing) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }
  
  // Se não autenticado, redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

// ROTAS PRINCIPAIS DA APLICAÇÃO
export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* ROTA INICIAL - LANDING PAGE DIRETA */}
        <Route 
          path="/" 
          element={<LandingPage />}
        />
        
        {/* REDIRECIONAMENTO INTELIGENTE PARA USUÁRIOS LOGADOS */}
        <Route 
          path="/dashboard" 
          element={<SmartRedirect />}
        />
        
        {/* PAINEL CLIENTE - USANDO CLIENT LAYOUT */}
        <Route 
          path="/client" 
          element={
            <ProtectedRoute>
              <ClientLayout currentPageName="client">
                <ClientPage />
              </ClientLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* PAINEL ADMIN - SEM LAYOUT WRAPPER (TEM LAYOUT PRÓPRIO) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        
        {/* CONFIGURAÇÕES - CLIENTE */}
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <ClientLayout currentPageName="Settings">
                <Settings />
              </ClientLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* AGENTES - CLIENTE */}
        <Route 
          path="/agents" 
          element={
            <ProtectedRoute>
              <ClientLayout currentPageName="Agents">
                <Agents />
              </ClientLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* ROTINAS - CLIENTE */}
        <Route 
          path="/Routines" 
          element={
            <ProtectedRoute>
              <ClientLayout currentPageName="Routines">
                <Routines />
              </ClientLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* INTEGRAÇÕES - CLIENTE */}
        <Route 
          path="/Integrations" 
          element={
            <ProtectedRoute>
              <ClientLayout currentPageName="Integrations">
                <Integrations />
              </ClientLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* PLANOS - CLIENTE */}
        <Route 
          path="/Plans" 
          element={
            <ProtectedRoute>
              <ClientLayout currentPageName="Plans">
                <Plans />
              </ClientLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* GAMIFICAÇÃO - CLIENTE */}
        <Route 
          path="/Gamification" 
          element={
            <ProtectedRoute>
              <ClientLayout currentPageName="Gamification">
                <Gamification />
              </ClientLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* PÁGINAS PÚBLICAS */}
        <Route path="/LandingPage" element={<LandingPage />} />
        
        {/* AUTENTICAÇÃO */}
        <Route path="/login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        
        {/* PÁGINA DE TESTE */}
        <Route path="/test" element={<TestPage />} />
        
        {/* REDIRECT PADRÃO */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// EXEMPLO DE USO NO App.js:
/*
import AppRoutes from './AppRoutes';
import './App.css';

function App() {
  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
*/
