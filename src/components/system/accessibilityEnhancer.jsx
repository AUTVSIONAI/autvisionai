// MELHORIAS DE ACESSIBILIDADE - IMPLEMENTAÇÃO COMPLETA
import React, { useEffect, useRef } from 'react';

// 1. HOOK PARA NAVEGAÇÃO POR TECLADO
export const useKeyboardNavigation = (items, onSelect) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isNavigating, setIsNavigating] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isNavigating) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % items.length);
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          onSelect(items[selectedIndex]);
          break;
        case 'Escape':
          event.preventDefault();
          setIsNavigating(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, isNavigating, onSelect]);

  return { selectedIndex, isNavigating, setIsNavigating };
};

// 2. COMPONENTE DE SKIP LINKS
export const SkipLinks = () => {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:relative"
      >
        Pular para o conteúdo principal
      </a>
      <a
        href="#navigation"
        className="absolute top-4 left-32 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:relative"
      >
        Pular para a navegação
      </a>
    </div>
  );
};

// 3. COMPONENTE ANUNCIADOR PARA SCREEN READERS
export const ScreenReaderAnnouncer = ({ children, priority = "polite" }) => {
  const [announcement, setAnnouncement] = React.useState("");

  React.useEffect(() => {
    if (children) {
      setAnnouncement(children);
      // Limpa o anúncio após um tempo para permitir novos anúncios
      const timer = setTimeout(() => setAnnouncement(""), 1000);
      return () => clearTimeout(timer);
    }
  }, [children]);

  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
};

// 4. HOOK PARA GESTÃO DE FOCO
export const useFocusManagement = () => {
  const previousFocus = useRef(null);

  const saveFocus = () => {
    previousFocus.current = document.activeElement;
  };

  const restoreFocus = () => {
    if (previousFocus.current) {
      previousFocus.current.focus();
    }
  };

  const trapFocus = (containerRef) => {
    useEffect(() => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };

      container.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => {
        container.removeEventListener('keydown', handleTabKey);
      };
    }, [containerRef]);
  };

  return { saveFocus, restoreFocus, trapFocus };
};

// 5. COMPONENTE DE BOTÃO ACESSÍVEL
export const AccessibleButton = React.forwardRef(({
  children,
  variant = "default",
  size = "default",
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  onClick,
  className = "",
  ...props
}, ref) => {
  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <button
      ref={ref}
      className={`
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        transition-all duration-200
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled || loading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {loading && (
        <span className="sr-only">Carregando...</span>
      )}
      {children}
    </button>
  );
});

// 6. COMPONENTE DE INPUT ACESSÍVEL
export const AccessibleInput = React.forwardRef(({
  label,
  error,
  helperText,
  required = false,
  className = "",
  ...props
}, ref) => {
  const id = React.useId();
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className={className}>
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="obrigatório">*</span>}
      </label>
      
      <input
        ref={ref}
        id={id}
        className={`
          w-full px-3 py-2 border rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={`${error ? errorId : ''} ${helperText ? helperId : ''}`.trim()}
        aria-required={required}
        {...props}
      />
      
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      
      {helperText && (
        <p id={helperId} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

// 7. MODAL ACESSÍVEL
export const AccessibleModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = "" 
}) => {
  const modalRef = useRef(null);
  const { saveFocus, restoreFocus, trapFocus } = useFocusManagement();

  useEffect(() => {
    if (isOpen) {
      saveFocus();
    } else {
      restoreFocus();
    }
  }, [isOpen]);

  trapFocus(modalRef);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div
        ref={modalRef}
        className={`
          relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4
          focus:outline-none
          ${className}
        `}
      >
        <div className="p-6">
          <h2 id="modal-title" className="text-lg font-semibold mb-4">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
};

// 8. TOAST ACESSÍVEL
export const AccessibleToast = ({ 
  message, 
  type = "info", 
  isVisible, 
  onClose 
}) => {
  const toastRef = useRef(null);

  useEffect(() => {
    if (isVisible && toastRef.current) {
      toastRef.current.focus();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const typeColors = {
    success: "bg-green-500",
    error: "bg-red-500", 
    warning: "bg-yellow-500",
    info: "bg-blue-500"
  };

  return (
    <div
      ref={toastRef}
      className={`
        fixed top-4 right-4 p-4 rounded-md text-white z-50
        focus:outline-none focus:ring-2 focus:ring-white
        ${typeColors[type]}
      `}
      role="alert"
      aria-live="assertive"
      tabIndex={-1}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none focus:ring-1 focus:ring-white rounded"
          aria-label="Fechar notificação"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// 9. HOOK PARA DETECTAR PREFERÊNCIAS DE ACESSIBILIDADE
export const useAccessibilityPreferences = () => {
  const [preferences, setPreferences] = React.useState({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersLargeText: false
  });

  useEffect(() => {
    const updatePreferences = () => {
      setPreferences({
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
        prefersLargeText: window.matchMedia('(prefers-reduced-data: reduce)').matches
      });
    };

    updatePreferences();
    
    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-reduced-data: reduce)')
    ];

    mediaQueries.forEach(mq => mq.addListener(updatePreferences));

    return () => {
      mediaQueries.forEach(mq => mq.removeListener(updatePreferences));
    };
  }, []);

  return preferences;
};

// 10. COMPONENTE DE NAVEGAÇÃO ACESSÍVEL
export const AccessibleNavigation = ({ items, currentPath }) => {
  const { selectedIndex, isNavigating, setIsNavigating } = useKeyboardNavigation(
    items, 
    (item) => {
      if (item.onClick) item.onClick();
      setIsNavigating(false);
    }
  );

  return (
    <nav 
      role="navigation" 
      aria-label="Navegação principal"
      onFocus={() => setIsNavigating(true)}
      onBlur={() => setIsNavigating(false)}
    >
      <ul className="flex space-x-4">
        {items.map((item, index) => (
          <li key={item.href || index}>
            <a
              href={item.href}
              className={`
                px-3 py-2 rounded-md transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${currentPath === item.href ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}
                ${isNavigating && selectedIndex === index ? 'ring-2 ring-blue-500' : ''}
              `}
              aria-current={currentPath === item.href ? 'page' : undefined}
              onClick={item.onClick}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};