// OTIMIZADOR DE API - BATCHING E DEBOUNCE
class ApiOptimizer {
  constructor() {
    this.batchQueue = new Map();
    this.batchTimeout = 50; // 50ms
    this.requestCache = new Map();
    this.retryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000
    };
  }

  // BATCH REQUESTS
  batch(endpoint, data) {
    return new Promise((resolve, reject) => {
      if (!this.batchQueue.has(endpoint)) {
        this.batchQueue.set(endpoint, []);
        
        setTimeout(() => {
          this.processBatch(endpoint);
        }, this.batchTimeout);
      }

      this.batchQueue.get(endpoint).push({ data, resolve, reject });
    });
  }

  async processBatch(endpoint) {
    const batch = this.batchQueue.get(endpoint);
    this.batchQueue.delete(endpoint);

    if (!batch || batch.length === 0) return;

    try {
      // Simular chamada de API em lote
      const results = await this.executeBatchRequest(endpoint, batch.map(item => item.data));
      
      batch.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      batch.forEach(item => {
        item.reject(error);
      });
    }
  }

  async executeBatchRequest(endpoint, dataArray) {
    // Implementação mockada - em produção faria chamada real de API
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
    return dataArray.map(data => ({ ...data, processed: true }));
  }

  // DEBOUNCE DE REQUESTS
  debounce(func, delay = 300) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      return new Promise((resolve) => {
        timeoutId = setTimeout(async () => {
          const result = await func(...args);
          resolve(result);
        }, delay);
      });
    };
  }

  // RETRY COM BACKOFF EXPONENCIAL
  async retryWithBackoff(fn, attempt = 1) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= this.retryConfig.maxRetries) {
        throw error;
      }

      const delay = Math.min(
        this.retryConfig.baseDelay * Math.pow(2, attempt - 1),
        this.retryConfig.maxDelay
      );

      await new Promise(resolve => setTimeout(resolve, delay));
      return this.retryWithBackoff(fn, attempt + 1);
    }
  }

  // REQUEST COM CACHE E RETRY
  async optimizedRequest(key, fetcher, options = {}) {
    // Verificar cache primeiro
    if (this.requestCache.has(key)) {
      const cached = this.requestCache.get(key);
      if (Date.now() - cached.timestamp < (options.ttl || 60000)) {
        return cached.data;
      }
    }

    // Request com retry
    const data = await this.retryWithBackoff(fetcher);
    
    // Salvar no cache
    this.requestCache.set(key, {
      data,
      timestamp: Date.now()
    });

    return data;
  }

  // CLEANUP DE CACHE
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.requestCache.entries()) {
      if (now - value.timestamp > 300000) { // 5 minutos
        this.requestCache.delete(key);
      }
    }
  }
}

export const apiOptimizer = new ApiOptimizer();

// Hook para usar API otimizada
export const useOptimizedApi = () => {
  return {
    batch: apiOptimizer.batch.bind(apiOptimizer),
    request: apiOptimizer.optimizedRequest.bind(apiOptimizer),
    debounce: apiOptimizer.debounce.bind(apiOptimizer)
  };
};