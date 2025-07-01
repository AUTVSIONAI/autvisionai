// SISTEMA DE PERFORMANCE E CACHE
import { useState, useEffect, useRef, useMemo } from 'react';

// Cache simples em memória
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function useCache(key, fetcher, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    duration = CACHE_DURATION,
    dependencies = []
  } = options;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar cache
        const cached = cache.get(key);
        if (cached && Date.now() - cached.timestamp < duration) {
          setData(cached.data);
          setLoading(false);
          return;
        }

        // Buscar dados
        const result = await fetcher();
        
        // Salvar no cache
        cache.set(key, {
          data: result,
          timestamp: Date.now()
        });

        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key, ...dependencies]);

  const refresh = () => {
    cache.delete(key);
    return fetchData();
  };

  return { data, loading, error, refresh };
}

// Hook para debounce
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook para monitoramento de performance
export function usePerformanceMonitor() {
  const startTime = useRef(performance.now());
  const [metrics, setMetrics] = useState({});

  const mark = (label) => {
    const time = performance.now() - startTime.current;
    setMetrics(prev => ({
      ...prev,
      [label]: time
    }));

    // Log em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ Performance [${label}]: ${time.toFixed(2)}ms`);
    }
  };

  return { mark, metrics };
}

// Componente para lazy loading
export function useLazyLoad(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}