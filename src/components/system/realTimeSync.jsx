// SISTEMA DE SINCRONIZAÇÃO EM TEMPO REAL (PREPARADO PARA SUPABASE)
import React, { useState, useEffect } from 'react';

class RealTimeSync {
  constructor() {
    this.subscribers = new Map();
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxRetries = 5;
  }

  // Simular conexão WebSocket (será substituído por Supabase Realtime)
  connect() {
    if (this.isConnected) return;

    try {
      // Em produção, será: supabase.channel('public:*')
      console.log('🔄 Conectando ao sistema de tempo real...');
      
      // Simular conexão
      setTimeout(() => {
        this.isConnected = true;
        this.connectionAttempts = 0;
        console.log('✅ Conectado ao tempo real');
        
        // Notificar subscribers
        this.notifySubscribers('connection', { status: 'connected' });
      }, 1000);

    } catch (error) {
      this.handleConnectionError(error);
    }
  }

  disconnect() {
    this.isConnected = false;
    console.log('❌ Desconectado do tempo real');
  }

  // Subscrever a mudanças em uma entidade
  subscribe(entity, callback) {
    if (!this.subscribers.has(entity)) {
      this.subscribers.set(entity, new Set());
    }
    
    this.subscribers.get(entity).add(callback);
    
    // Auto-conectar se necessário
    if (!this.isConnected) {
      this.connect();
    }

    // Retornar função de cleanup
    return () => {
      const callbacks = this.subscribers.get(entity);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscribers.delete(entity);
        }
      }
    };
  }

  // Notificar mudanças (será chamado pelo Supabase)
  notifyChange(entity, change) {
    const callbacks = this.subscribers.get(entity);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(change);
        } catch (error) {
          console.error('Erro ao notificar mudança:', error);
        }
      });
    }
  }

  // Sincronizar dados offline (para PWA)
  syncOfflineChanges() {
    const offlineChanges = this.getOfflineChanges();
    
    offlineChanges.forEach(async (change) => {
      try {
        await this.applyChange(change);
        this.removeOfflineChange(change.id);
      } catch (error) {
        console.error('Erro ao sincronizar mudança offline:', error);
      }
    });
  }

  getOfflineChanges() {
    try {
      return JSON.parse(localStorage.getItem('offline_changes') || '[]');
    } catch {
      return [];
    }
  }

  saveOfflineChange(change) {
    const changes = this.getOfflineChanges();
    changes.push({
      ...change,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('offline_changes', JSON.stringify(changes));
  }

  removeOfflineChange(id) {
    const changes = this.getOfflineChanges().filter(c => c.id !== id);
    localStorage.setItem('offline_changes', JSON.stringify(changes));
  }

  handleConnectionError(error) {
    console.error('Erro de conexão tempo real:', error);
    
    if (this.connectionAttempts < this.maxRetries) {
      this.connectionAttempts++;
      const delay = Math.pow(2, this.connectionAttempts) * 1000;
      
      setTimeout(() => {
        console.log(`🔄 Tentativa ${this.connectionAttempts}/${this.maxRetries}`);
        this.connect();
      }, delay);
    }
  }

  notifySubscribers(event, data) {
    // Implementar notificação global
    window.dispatchEvent(new CustomEvent('realtime-event', {
      detail: { event, data }
    }));
  }
}

// Instância global
export const realTimeSync = new RealTimeSync();

// Hook para usar sincronização
export function useRealTime(entity) {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = realTimeSync.subscribe(entity, (change) => {
      setData(prevData => {
        switch (change.type) {
          case 'INSERT':
            return [...(prevData || []), change.new];
          case 'UPDATE':
            return (prevData || []).map(item => 
              item.id === change.new.id ? change.new : item
            );
          case 'DELETE':
            return (prevData || []).filter(item => item.id !== change.old.id);
          default:
            return prevData;
        }
      });
    });

    // Listener para status de conexão
    const handleConnection = (event) => {
      setIsConnected(event.detail.data.status === 'connected');
    };

    window.addEventListener('realtime-event', handleConnection);

    return () => {
      unsubscribe();
      window.removeEventListener('realtime-event', handleConnection);
    };
  }, [entity]);

  return { data, isConnected };
}