// SUPORTE OFFLINE E PWA
import React, { useState, useEffect } from 'react';

class OfflineManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.init();
  }

  init() {
    // Listeners para status de conexão
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineData();
      this.notifyConnectionChange(true);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyConnectionChange(false);
    });

    // Tentar sincronizar na inicialização
    if (this.isOnline) {
      this.syncOfflineData();
    }
  }

  // Salvar dados offline
  saveOffline(key, data) {
    try {
      const offlineData = this.getOfflineData();
      offlineData[key] = {
        data,
        timestamp: Date.now(),
        synced: false
      };
      localStorage.setItem('offline_data', JSON.stringify(offlineData));
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados offline:', error);
      return false;
    }
  }

  // Recuperar dados offline
  getOffline(key) {
    const offlineData = this.getOfflineData();
    return offlineData[key]?.data || null;
  }

  // Adicionar operação à fila de sincronização
  queueSync(operation) {
    this.syncQueue.push({
      ...operation,
      id: Date.now().toString(),
      timestamp: Date.now()
    });
    this.saveSyncQueue();

    // Tentar sincronizar imediatamente se online
    if (this.isOnline) {
      this.syncOfflineData();
    }
  }

  // Sincronizar dados offline
  async syncOfflineData() {
    if (!this.isOnline || this.syncQueue.length === 0) {
      return;
    }

    console.log('🔄 Sincronizando dados offline...');

    const pendingOperations = [...this.syncQueue];
    
    for (const operation of pendingOperations) {
      try {
        await this.executeOperation(operation);
        this.removeSyncOperation(operation.id);
        console.log('✅ Operação sincronizada:', operation.type);
      } catch (error) {
        console.error('❌ Erro ao sincronizar operação:', error);
        // Manter na fila para tentar novamente
      }
    }

    this.saveSyncQueue();
  }

  async executeOperation(operation) {
    // Simular execução da operação
    switch (operation.type) {
      case 'CREATE':
        return await this.syncCreate(operation);
      case 'UPDATE':
        return await this.syncUpdate(operation);
      case 'DELETE':
        return await this.syncDelete(operation);
      default:
        throw new Error(`Operação desconhecida: ${operation.type}`);
    }
  }

  async syncCreate(operation) {
    // Em produção, fazer chamada real para API
    console.log('Criando:', operation.entity, operation.data);
    return { success: true };
  }

  async syncUpdate(operation) {
    console.log('Atualizando:', operation.entity, operation.id, operation.data);
    return { success: true };
  }

  async syncDelete(operation) {
    console.log('Deletando:', operation.entity, operation.id);
    return { success: true };
  }

  getOfflineData() {
    try {
      return JSON.parse(localStorage.getItem('offline_data') || '{}');
    } catch {
      return {};
    }
  }

  getSyncQueue() {
    try {
      return JSON.parse(localStorage.getItem('sync_queue') || '[]');
    } catch {
      return [];
    }
  }

  saveSyncQueue() {
    localStorage.setItem('sync_queue', JSON.stringify(this.syncQueue));
  }

  removeSyncOperation(id) {
    this.syncQueue = this.syncQueue.filter(op => op.id !== id);
  }

  notifyConnectionChange(isOnline) {
    const event = new CustomEvent('connection-change', {
      detail: { isOnline }
    });
    window.dispatchEvent(event);
  }

  // Cache de recursos para PWA
  cacheResource(url, data) {
    if ('caches' in window) {
      caches.open('autvision-v1').then(cache => {
        cache.put(url, new Response(JSON.stringify(data)));
      });
    }
  }

  async getCachedResource(url) {
    if ('caches' in window) {
      const cache = await caches.open('autvision-v1');
      const response = await cache.match(url);
      if (response) {
        return await response.json();
      }
    }
    return null;
  }
}

// Instância global
export const offlineManager = new OfflineManager();

// Hook para suporte offline
export function useOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(0);

  useEffect(() => {
    const handleConnectionChange = (event) => {
      setIsOnline(event.detail.isOnline);
    };

    window.addEventListener('connection-change', handleConnectionChange);
    
    // Verificar operações pendentes
    setPendingSync(offlineManager.getSyncQueue().length);

    return () => {
      window.removeEventListener('connection-change', handleConnectionChange);
    };
  }, []);

  const saveOffline = (key, data) => {
    return offlineManager.saveOffline(key, data);
  };

  const getOffline = (key) => {
    return offlineManager.getOffline(key);
  };

  const queueSync = (operation) => {
    offlineManager.queueSync(operation);
    setPendingSync(prev => prev + 1);
  };

  return {
    isOnline,
    pendingSync,
    saveOffline,
    getOffline,
    queueSync
  };
}