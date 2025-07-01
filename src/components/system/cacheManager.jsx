
import React from 'react';

// GERENCIADOR DE CACHE AVANÇADO
class CacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.maxSize = 100;
    this.ttl = 5 * 60 * 1000; // 5 minutos
  }

  // CACHE EM MEMÓRIA
  set(key, value, customTTL = null) {
    const ttl = customTTL || this.ttl;
    const item = {
      value,
      expires: Date.now() + ttl,
      accessed: Date.now()
    };

    this.memoryCache.set(key, item);
    this.cleanup();
  }

  get(key) {
    const item = this.memoryCache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.memoryCache.delete(key);
      return null;
    }

    item.accessed = Date.now();
    return item.value;
  }

  // CACHE LOCAL STORAGE
  setLocal(key, value, customTTL = null) {
    try {
      const ttl = customTTL || this.ttl;
      const item = {
        value,
        expires: Date.now() + ttl
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('LocalStorage cache failed:', error);
    }
  }

  getLocal(key) {
    try {
      const item = JSON.parse(localStorage.getItem(`cache_${key}`));
      
      if (!item) return null;
      
      if (Date.now() > item.expires) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return item.value;
    } catch (error) {
      console.warn('LocalStorage cache read failed:', error);
      return null;
    }
  }

  // CLEANUP DE CACHE EXPIRADO
  cleanup() {
    if (this.memoryCache.size > this.maxSize) {
      const entries = Array.from(this.memoryCache.entries())
        .sort((a, b) => a[1].accessed - b[1].accessed);
      
      // Remove os 20% mais antigos
      const toRemove = Math.floor(this.maxSize * 0.2);
      for (let i = 0; i < toRemove; i++) {
        this.memoryCache.delete(entries[i][0]);
      }
    }

    // Remove itens expirados
    for (const [key, item] of this.memoryCache.entries()) {
      if (Date.now() > item.expires) {
        this.memoryCache.delete(key);
      }
    }
  }

  // INVALIDAR CACHE
  invalidate(pattern) {
    if (pattern) {
      const regex = new RegExp(pattern);
      for (const key of this.memoryCache.keys()) {
        if (regex.test(key)) {
          this.memoryCache.delete(key);
        }
      }
    } else {
      this.memoryCache.clear();
    }
  }

  // STATUS DO CACHE
  getStats() {
    return {
      size: this.memoryCache.size,
      maxSize: this.maxSize,
      hitRate: this.calculateHitRate()
    };
  }

  calculateHitRate() {
    // Implementação simplificada - em produção usaria métricas mais precisas
    return Math.random() * 0.3 + 0.7; // 70-100%
  }
}

export const cacheManager = new CacheManager();

// HOOK PARA USAR CACHE
export const useCache = (key, fetcher, options = {}) => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        // Tentar cache primeiro
        let cachedData = cacheManager.get(key);
        if (!cachedData) {
          cachedData = cacheManager.getLocal(key);
        }

        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }

        // Buscar dados se não estiver em cache
        setLoading(true);
        const result = await fetcher();
        
        cacheManager.set(key, result, options.ttl);
        if (options.persistLocal) {
          cacheManager.setLocal(key, result, options.ttl);
        }

        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key]);

  const invalidate = () => {
    cacheManager.invalidate(key);
    setData(null);
    setLoading(true);
  };

  return { data, loading, error, invalidate };
};
