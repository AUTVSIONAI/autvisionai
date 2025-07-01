import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertTriangle, 
  RefreshCw, 
  Wifi, 
  Server, 
  Shield,
  Bug,
  Home
} from 'lucide-react';

// COMPONENTE DE ERRO BÁSICO
export const ErrorMessage = ({ 
  message = 'Algo deu errado', 
  onRetry = null,
  type = 'general',
  className = ''
}) => {
  const getIcon = () => {
    switch (type) {
      case 'network': return Wifi;
      case 'server': return Server;
      case 'permission': return Shield;
      case 'bug': return Bug;
      default: return AlertTriangle;
    }
  };

  const Icon = getIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg ${className}`}
    >
      <Icon className="w-5 h-5 text-red-500 flex-shrink-0" />
      <div className="flex-grow">
        <p className="text-red-700 dark:text-red-300 text-sm">{message}</p>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="border-red-300 text-red-700 hover:bg-red-100"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Tentar Novamente
        </Button>
      )}
    </motion.div>
  );
};

// ERRO FULL PAGE
export const FullPageError = ({ 
  title = 'Oops! Algo deu errado',
  message = 'Não foi possível carregar os dados. Verifique sua conexão.',
  onRetry = null,
  onGoHome = null
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <Card className="bg-white dark:bg-gray-800 shadow-xl">
          <CardContent className="p-8">
            {/* Logo AutVision */}
            <img 
              src="/assets/images/autvision-logo.png" 
              alt="AutVision Logo" 
              className="w-24 h-24 mx-auto mb-6 opacity-50"
            />
            
            {/* Ícone de erro */}
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {title}
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {message}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {onRetry && (
                <Button
                  onClick={onRetry}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
              )}
              
              {onGoHome && (
                <Button
                  onClick={onGoHome}
                  variant="outline"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

// ERRO PARA COMPONENTES/CARDS
export const InlineError = ({ message, onRetry }) => {
  return (
    <div className="flex items-center justify-center p-8 text-center">
      <div className="space-y-3">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="w-3 h-3 mr-1" />
            Tentar Novamente
          </Button>
        )}
      </div>
    </div>
  );
};

// ERRO PARA DADOS NÃO ENCONTRADOS
export const NotFoundError = ({ 
  title = 'Nada encontrado',
  message = 'Não há dados para exibir no momento.',
  actionLabel = 'Atualizar',
  onAction = null
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-12 h-12 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-sm">
        {message}
      </p>
      
      {onAction && (
        <Button onClick={onAction} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

// PropTypes
ErrorMessage.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
  type: PropTypes.oneOf(['general', 'network', 'server', 'auth']),
  className: PropTypes.string
};

FullPageError.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onRetry: PropTypes.func,
  onGoHome: PropTypes.func
};

InlineError.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func
};

NotFoundError.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func
};