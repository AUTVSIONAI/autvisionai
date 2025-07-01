import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      ...toast,
      createdAt: Date.now(),
    };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toast = {
    success: (message, options = {}) => addToast({ type: 'success', message, ...options }),
    error: (message, options = {}) => addToast({ type: 'error', message, ...options }),
    warning: (message, options = {}) => addToast({ type: 'warning', message, ...options }),
    info: (message, options = {}) => addToast({ type: 'info', message, ...options }),
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info': return <Info className="w-5 h-5 text-blue-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success': return 'bg-green-900/90 border-green-500/50';
      case 'error': return 'bg-red-900/90 border-red-500/50';
      case 'warning': return 'bg-yellow-900/90 border-yellow-500/50';
      case 'info': return 'bg-blue-900/90 border-blue-500/50';
      default: return 'bg-gray-900/90 border-gray-500/50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
      className={`${getStyles()} backdrop-blur-md border rounded-lg p-4 shadow-lg max-w-sm`}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          {toast.title && (
            <h4 className="text-sm font-semibold text-white mb-1">{toast.title}</h4>
          )}
          <p className="text-sm text-gray-200">{toast.message}</p>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Exports para compatibilidade com toaster.jsx
export const Toast = ({ children, ...props }) => <div {...props}>{children}</div>;
export const ToastClose = (props) => <button {...props} />;
export const ToastDescription = ({ children }) => <div>{children}</div>;
export const ToastTitle = ({ children }) => <div>{children}</div>;
export const ToastViewport = (props) => <div {...props} />;

// PropTypes
ToastProvider.propTypes = {
  children: PropTypes.node.isRequired
};

ToastContainer.propTypes = {
  toasts: PropTypes.array.isRequired,
  removeToast: PropTypes.func.isRequired
};

ToastItem.propTypes = {
  toast: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
    message: PropTypes.string.isRequired,
    title: PropTypes.string
  }).isRequired,
  onRemove: PropTypes.func.isRequired
};

Toast.propTypes = {
  children: PropTypes.node
};

ToastDescription.propTypes = {
  children: PropTypes.node
};

ToastTitle.propTypes = {
  children: PropTypes.node
};