/**
 * 🔥 SYSTEM STATUS - MARCHA EVOLUÇÃO 10.0
 * Componente para mostrar status de conectividade
 */

import { useState, useEffect } from 'react';
import { AlertTriangle, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import api from '@/api/client';

export default function SystemStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await api.get('/health', { timeout: 3000 });
        setIsOnline(true);
        if (showStatus) {
          // Se estava offline e voltou, esconder o alerta após 3s
          setTimeout(() => setShowStatus(false), 3000);
        }
      } catch {
        setIsOnline(false);
        setShowStatus(true);
      }
    };

    // Verificar imediatamente
    checkConnection();

    // Verificar a cada 60 segundos (reduzido de 30s para evitar spam)
    const interval = setInterval(checkConnection, 60000);

    return () => clearInterval(interval);
  }, [showStatus]);

  if (!showStatus || isOnline) {
    return null;
  }

  return (
    <Alert className="fixed top-4 right-4 w-auto max-w-md z-50 bg-yellow-500/10 border-yellow-500/50">
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
      <AlertDescription className="text-yellow-200">
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span>Modo Offline - Funcionalidades limitadas</span>
        </div>
      </AlertDescription>
    </Alert>
  );
}
