import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// SPINNER BÁSICO
export const LoadingSpinner = ({ size = 'md', text = 'Carregando...', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizes[size]} animate-spin text-blue-500`} />
      {text && <span className="text-gray-600 dark:text-gray-300">{text}</span>}
    </div>
  );
};

// LOADING FULL PAGE COM LOGO AUTVISION
export const FullPageLoading = ({ message = 'Iniciando AutVision...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Partículas de fundo */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            animate={{
              x: [0, Math.random() * 100, 0],
              y: [0, Math.random() * 100, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        {/* Logo AutVision com pulso */}
        <div className="relative mb-8">
          <motion.img 
            src="/assets/images/autvision-logo.png" 
            alt="AutVision Logo" 
            className="w-48 mx-auto"
            animate={{ 
              scale: [1, 1.05, 1],
              filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          
          {/* Anel pulsante */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-blue-400/50"
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [0.5, 0, 0.5] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">{message}</h2>
        
        {/* Barra de progresso animada */}
        <div className="w-64 h-1 bg-gray-700 rounded-full mx-auto mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
            animate={{ x: [-100, 264] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </div>
        
        <p className="text-gray-300 text-sm">Preparando sua experiência...</p>
      </motion.div>
    </div>
  );
};

// LOADING PARA CARDS/COMPONENTES
export const CardLoading = ({ lines = 3 }) => {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
};

// LOADING PARA TABELAS
export const TableLoading = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="animate-pulse">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex space-x-4 py-4 border-b border-gray-200 dark:border-gray-700">
          {[...Array(cols)].map((_, j) => (
            <div key={j} className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  text: PropTypes.string,
  className: PropTypes.string
};

FullPageLoading.propTypes = {
  message: PropTypes.string
};

CardLoading.propTypes = {
  lines: PropTypes.number
};

TableLoading.propTypes = {
  rows: PropTypes.number,
  cols: PropTypes.number
};