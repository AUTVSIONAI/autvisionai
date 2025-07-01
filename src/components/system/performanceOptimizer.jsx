
// OTIMIZADOR DE PERFORMANCE - IMPLEMENTAÇÃO DAS SUGESTÕES
import React, { Suspense, lazy, memo, useCallback, useMemo } from 'react';

// 1. LAZY LOADING DE COMPONENTES PESADOS
export const LazyVisionCore = lazy(() => import('../vision/VisionCore'));
export const LazyImmersiveMode = lazy(() => import('../voice/ImmersiveVoiceMode'));
export const LazyAdmin = lazy(() => import('../../pages/Admin'));
export const LazyBusinessDashboard = lazy(() => import('../../pages/BusinessDashboard'));

// 2. COMPONENTE DE LOADING OTIMIZADO
export const OptimizedLoader = memo(({ className = "", size = "default" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8", 
    large: "w-12 h-12"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} border-2 border-blue-500 border-t-transparent rounded-full animate-spin`} />
    </div>
  );
});

// 3. HOOK DE DEBOUNCE PARA INPUTS
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// 4. HOOK DE INTERSECTION OBSERVER PARA LAZY LOADING
export const useIntersectionObserver = (options = {}) => {
  const [ref, setRef] = React.useState(null);
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return [setRef, isIntersecting];
};

// 5. COMPONENTE DE IMAGEM OTIMIZADA
export const OptimizedImage = memo(({ 
  src, 
  alt, 
  className = "", 
  fallback = "/placeholder.png",
  lazy = true,
  ...props 
}) => {
  const [imgRef, isVisible] = useIntersectionObserver({ 
    threshold: 0.1, 
    rootMargin: '50px' 
  });
  
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  const shouldLoad = lazy ? isVisible : true;

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {shouldLoad && (
        <img
          src={error ? fallback : src}
          alt={alt}
          className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          loading={lazy ? "lazy" : "eager"}
          {...props}
        />
      )}
      {!loaded && shouldLoad && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
    </div>
  );
});

// 6. HOOK DE CACHE EM MEMÓRIA
export const useMemoryCache = () => {
  const cache = React.useRef(new Map());

  const get = useCallback((key) => {
    return cache.current.get(key);
  }, []);

  const set = useCallback((key, value, ttl = 300000) => { // 5 minutos default
    cache.current.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }, []);

  const isValid = useCallback((key) => {
    const item = cache.current.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiry) {
      cache.current.delete(key);
      return false;
    }
    
    return true;
  }, []);

  const clear = useCallback(() => {
    cache.current.clear();
  }, []);

  return { get, set, isValid, clear };
};

// 7. HOC PARA MEMOIZAÇÃO AVANÇADA
export const withPerformanceOptimization = (Component) => {
  return memo(Component, (prevProps, nextProps) => {
    // Comparação personalizada para evitar re-renders desnecessários
    const prevKeys = Object.keys(prevProps);
    const nextKeys = Object.keys(nextProps);
    
    if (prevKeys.length !== nextKeys.length) return false;
    
    return prevKeys.every(key => {
      if (typeof prevProps[key] === 'function' && typeof nextProps[key] === 'function') {
        return true; // Assume funções são estáveis
      }
      return prevProps[key] === nextProps[key];
    });
  });
};

// 8. VIRTUAL SCROLLING PARA LISTAS GRANDES
export const VirtualizedList = memo(({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem,
  className = ""
}) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(visibleStart, visibleEnd);
  
  return (
    <div 
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={visibleStart + index}
            style={{
              position: 'absolute',
              top: (visibleStart + index) * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            {renderItem(item, visibleStart + index)}
          </div>
        ))}
      </div>
    </div>
  );
});

// 9. SERVICE WORKER REGISTRATION
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};
