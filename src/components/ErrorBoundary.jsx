/**
 * 🛡️ ERROR BOUNDARY - PROTEÇÃO TOTAL CONTRA CRASHES
 * Captura erros React e mostra uma tela amigável
 */

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o state para mostrar a UI de erro
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log do erro para debug
    console.error('🔥 Error Boundary capturou um erro:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // UI de erro customizada
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3">
                Oops! Algo deu errado
              </h2>
              
              <p className="text-gray-400 mb-6">
                Encontramos um problema inesperado. Não se preocupe, 
                nossos devs supremos já estão trabalhando nisso! 🚀
              </p>
              
              {/* Detalhes do erro em desenvolvimento */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-gray-800 rounded-lg p-4 mb-6 text-left">
                  <p className="text-red-400 text-sm font-mono mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="text-gray-500 text-xs overflow-auto max-h-32">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
              
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={this.handleReload}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Recarregar
                </Button>
                
                <Button 
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Início
                </Button>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mt-4">
              Se o problema persistir, entre em contato com o suporte.
            </p>
          </div>
        </div>
      );
    }

    // Se não há erro, renderiza os children normalmente
    return this.props.children;
  }
}

export default ErrorBoundary;
