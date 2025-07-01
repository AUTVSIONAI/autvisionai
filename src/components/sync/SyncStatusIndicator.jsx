import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSync, SYNC_EVENTS } from '@/contexts/SyncContext';
import { RefreshCw, CheckCircle, ArrowLeftRight, Users, Bot, Clock } from 'lucide-react';

export default function SyncStatusIndicator() {
  const { isOnline, syncInProgress, lastSync, on } = useSync();
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // LISTENERS PARA EVENTOS DE SINCRONIZAÇÃO
    const unsubscribeDataRefresh = on(SYNC_EVENTS.DATA_REFRESH, () => {
      setRecentUpdates(prev => [...prev, {
        id: Date.now(),
        type: 'refresh',
        message: 'Dados sincronizados',
        timestamp: new Date().toISOString()
      }]);
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 3000);
    });

    const unsubscribeUserUpdated = on(SYNC_EVENTS.USER_UPDATED, () => {
      setRecentUpdates(prev => [...prev, {
        id: Date.now(),
        type: 'user',
        message: 'Usuários atualizados',
        timestamp: new Date().toISOString()
      }]);
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 3000);
    });

    const unsubscribeAgentUpdated = on(SYNC_EVENTS.AGENT_UPDATED, () => {
      setRecentUpdates(prev => [...prev, {
        id: Date.now(),
        type: 'agent',
        message: 'Agentes atualizados',
        timestamp: new Date().toISOString()
      }]);
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 3000);
    });

    const unsubscribeRoutineUpdated = on(SYNC_EVENTS.ROUTINE_UPDATED, () => {
      setRecentUpdates(prev => [...prev, {
        id: Date.now(),
        type: 'routine',
        message: 'Rotinas atualizadas',
        timestamp: new Date().toISOString()
      }]);
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 3000);
    });

    const unsubscribeVisionInteraction = on(SYNC_EVENTS.VISION_INTERACTION, () => {
      setRecentUpdates(prev => [...prev, {
        id: Date.now(),
        type: 'interaction',
        message: 'Interação registrada',
        timestamp: new Date().toISOString()
      }]);
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 2000);
    });

    return () => {
      unsubscribeDataRefresh();
      unsubscribeUserUpdated();
      unsubscribeAgentUpdated();
      unsubscribeRoutineUpdated();
      unsubscribeVisionInteraction();
    };
  }, [on]);

  // LIMPAR UPDATES ANTIGOS
  useEffect(() => {
    const cleanup = setInterval(() => {
      setRecentUpdates(prev => prev.filter(update => 
        Date.now() - new Date(update.timestamp).getTime() < 10000 // 10 segundos
      ));
    }, 5000);

    return () => clearInterval(cleanup);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'user': return Users;
      case 'agent': return Bot;
      case 'routine': return Clock;
      case 'refresh': return RefreshCw;
      case 'interaction': return ArrowLeftRight;
      default: return CheckCircle;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'user': return 'text-blue-400';
      case 'agent': return 'text-teal-400';
      case 'routine': return 'text-orange-400';
      case 'refresh': return 'text-green-400';
      case 'interaction': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <>
      {/* INDICADOR FIXO DE STATUS */}
      <div className="fixed bottom-4 left-4 z-40">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-md shadow-lg transition-all duration-300 ${
          isOnline 
            ? 'bg-green-900/80 border border-green-500/50' 
            : 'bg-red-900/80 border border-red-500/50'
        }`}>
          {syncInProgress ? (
            <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
          ) : (
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isOnline ? 'bg-green-400' : 'bg-red-400'
            }`} />
          )}
          <span className={`text-xs font-medium ${
            isOnline ? 'text-green-300' : 'text-red-300'
          }`}>
            {syncInProgress ? 'Sincronizando...' : (isOnline ? 'Online' : 'Offline')}
          </span>
          {lastSync && (
            <span className="text-xs text-gray-400">
              {new Date(lastSync).toLocaleTimeString('pt-BR')}
            </span>
          )}
        </div>
      </div>

      {/* NOTIFICAÇÕES DE SINCRONIZAÇÃO */}
      <AnimatePresence>
        {showIndicator && recentUpdates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed bottom-20 left-4 z-50"
          >
            <div className="bg-gray-900/90 backdrop-blur-md border border-cyan-500/30 rounded-lg p-3 shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">Sincronização</span>
              </div>
              <div className="space-y-1">
                {recentUpdates.slice(-3).map(update => {
                  const Icon = getIcon(update.type);
                  return (
                    <div key={update.id} className="flex items-center gap-2">
                      <Icon className={`w-3 h-3 ${getColor(update.type)}`} />
                      <span className="text-xs text-gray-300">{update.message}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
