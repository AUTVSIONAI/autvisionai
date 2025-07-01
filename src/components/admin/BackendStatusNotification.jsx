import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, X, Wifi, WifiOff } from 'lucide-react';

export default function BackendStatusNotification() {
  const [isOnline, setIsOnline] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://autvisionai-backend-five.vercel.app';
        const response = await fetch(`${apiBaseUrl}/health`, {
          method: 'GET',
          timeout: 5000
        });
        
        if (response.ok) {
          if (!isOnline) {
            setIsOnline(true);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 5000);
          }
        } else {
          setIsOnline(false);
          setShowNotification(true);
        }
      } catch {
        if (isOnline) {
          setIsOnline(false);
          setShowNotification(true);
        }
      }
    };

    // Verificar imediatamente
    checkBackendStatus();

    // Verificar a cada 60 segundos ao invés de 10 (reduzindo carga)
    const interval = setInterval(checkBackendStatus, 60000);

    return () => clearInterval(interval);
  }, [isOnline]);

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className={`p-4 rounded-lg border backdrop-blur-md shadow-2xl ${
            isOnline 
              ? 'bg-green-900/90 border-green-500/50 text-green-100' 
              : 'bg-red-900/90 border-red-500/50 text-red-100'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                isOnline ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {isOnline ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                )}
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-sm">
                  {isOnline ? 'Backend Online' : 'Backend Offline'}
                </h4>
                <p className="text-xs opacity-90">
                  {isOnline 
                    ? 'Conexão com o servidor restabelecida!' 
                    : 'Servidor backend não está respondendo. Execute o script start-backend-win.bat'
                  }
                </p>
              </div>
              
              <button
                onClick={() => setShowNotification(false)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {!isOnline && (
              <div className="mt-3 text-xs space-y-1 opacity-80">
                <div className="flex items-center gap-2">
                  <WifiOff className="w-3 h-3" />
                  <span>Execute: start-backend-win.bat</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="w-3 h-3" />
                  <span>Porta: 3001</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
