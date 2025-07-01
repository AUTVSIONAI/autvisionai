// SISTEMA DE BACKUP E RECUPERAÇÃO
import React, { useState, useEffect } from 'react';

class BackupService {
  constructor() {
    this.backupInterval = 5 * 60 * 1000; // 5 minutos
    this.maxBackups = 10;
    this.init();
  }

  init() {
    // Backup automático
    setInterval(() => {
      this.createAutoBackup();
    }, this.backupInterval);

    // Backup antes de fechar a aba
    window.addEventListener('beforeunload', () => {
      this.createEmergencyBackup();
    });
  }

  // Criar backup completo dos dados
  async createBackup(label = 'manual') {
    try {
      const backupData = {
        id: `backup_${Date.now()}`,
        label,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        data: await this.gatherAllData()
      };

      this.saveBackup(backupData);
      console.log('✅ Backup criado:', backupData.id);
      return backupData.id;
    } catch (error) {
      console.error('❌ Erro ao criar backup:', error);
      throw error;
    }
  }

  async gatherAllData() {
    const data = {};

    // Dados do localStorage
    data.localStorage = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('autvision_')) {
        data.localStorage[key] = localStorage.getItem(key);
      }
    }

    // Dados do sessionStorage
    data.sessionStorage = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key.startsWith('autvision_')) {
        data.sessionStorage[key] = sessionStorage.getItem(key);
      }
    }

    // Dados do IndexedDB (se usado)
    // data.indexedDB = await this.exportIndexedDB();

    return data;
  }

  saveBackup(backupData) {
    const backups = this.getBackups();
    
    // Adicionar novo backup
    backups.push(backupData);
    
    // Manter apenas os últimos N backups
    if (backups.length > this.maxBackups) {
      backups.splice(0, backups.length - this.maxBackups);
    }
    
    localStorage.setItem('autvision_backups', JSON.stringify(backups));
  }

  getBackups() {
    try {
      return JSON.parse(localStorage.getItem('autvision_backups') || '[]');
    } catch {
      return [];
    }
  }

  async restoreBackup(backupId) {
    try {
      const backups = this.getBackups();
      const backup = backups.find(b => b.id === backupId);
      
      if (!backup) {
        throw new Error('Backup não encontrado');
      }

      // Confirmar restauração
      const confirmed = window.confirm(
        `Restaurar backup de ${new Date(backup.timestamp).toLocaleString()}?\n\n` +
        'ATENÇÃO: Isso substituirá todos os dados atuais!'
      );

      if (!confirmed) {
        return false;
      }

      // Restaurar localStorage
      if (backup.data.localStorage) {
        Object.entries(backup.data.localStorage).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });
      }

      // Restaurar sessionStorage
      if (backup.data.sessionStorage) {
        Object.entries(backup.data.sessionStorage).forEach(([key, value]) => {
          sessionStorage.setItem(key, value);
        });
      }

      console.log('✅ Backup restaurado:', backupId);
      
      // Recarregar a página para aplicar mudanças
      window.location.reload();
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao restaurar backup:', error);
      throw error;
    }
  }

  deleteBackup(backupId) {
    const backups = this.getBackups().filter(b => b.id !== backupId);
    localStorage.setItem('autvision_backups', JSON.stringify(backups));
  }

  exportBackup(backupId) {
    const backup = this.getBackups().find(b => b.id === backupId);
    if (!backup) {
      throw new Error('Backup não encontrado');
    }

    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `autvision_backup_${backup.timestamp.split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  async importBackup(file) {
    try {
      const text = await file.text();
      const backup = JSON.parse(text);
      
      // Validar estrutura do backup
      if (!backup.id || !backup.data || !backup.timestamp) {
        throw new Error('Arquivo de backup inválido');
      }
      
      // Salvar backup importado
      this.saveBackup(backup);
      
      console.log('✅ Backup importado:', backup.id);
      return backup.id;
    } catch (error) {
      console.error('❌ Erro ao importar backup:', error);
      throw error;
    }
  }

  createAutoBackup() {
    if (document.hidden) return; // Não fazer backup se aba não estiver ativa
    
    this.createBackup('auto').catch(error => {
      console.error('Erro no backup automático:', error);
    });
  }

  createEmergencyBackup() {
    try {
      this.createBackup('emergency');
    } catch (error) {
      console.error('Erro no backup de emergência:', error);
    }
  }

  // Verificação de integridade
  verifyBackup(backupId) {
    const backup = this.getBackups().find(b => b.id === backupId);
    if (!backup) return false;

    // Verificações básicas
    const checks = {
      hasId: !!backup.id,
      hasTimestamp: !!backup.timestamp,
      hasData: !!backup.data,
      hasVersion: !!backup.version,
      dataStructure: backup.data.localStorage || backup.data.sessionStorage
    };

    return Object.values(checks).every(check => check);
  }
}

// Instância global
export const backupService = new BackupService();

// Hook para backup
export function useBackup() {
  const [backups, setBackups] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    setBackups(backupService.getBackups());
  }, []);

  const createBackup = async (label) => {
    setIsCreating(true);
    try {
      const backupId = await backupService.createBackup(label);
      setBackups(backupService.getBackups());
      return backupId;
    } finally {
      setIsCreating(false);
    }
  };

  const restoreBackup = async (backupId) => {
    setIsRestoring(true);
    try {
      return await backupService.restoreBackup(backupId);
    } finally {
      setIsRestoring(false);
    }
  };

  const deleteBackup = (backupId) => {
    backupService.deleteBackup(backupId);
    setBackups(backupService.getBackups());
  };

  const exportBackup = (backupId) => {
    backupService.exportBackup(backupId);
  };

  const importBackup = async (file) => {
    const backupId = await backupService.importBackup(file);
    setBackups(backupService.getBackups());
    return backupId;
  };

  return {
    backups,
    isCreating,
    isRestoring,
    createBackup,
    restoreBackup,
    deleteBackup,
    exportBackup,
    importBackup
  };
}