// SISTEMA DE TRATAMENTO DE ERROS GLOBAL
import React from 'react';

class ErrorHandler {
  static logError(error, context = {}) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Em produção, enviar para serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error, { extra: errorData });
    } else {
      console.error('🚨 ERRO CAPTURADO:', errorData);
    }

    return errorData;
  }

  static handleApiError(error, fallbackMessage = "Erro inesperado") {
    if (error.response) {
      // Erro da API
      return {
        type: 'api_error',
        status: error.response.status,
        message: error.response.data?.message || fallbackMessage
      };
    } else if (error.request) {
      // Erro de rede
      return {
        type: 'network_error',
        message: 'Erro de conexão. Verifique sua internet.'
      };
    } else {
      // Erro interno
      return {
        type: 'internal_error',
        message: fallbackMessage
      };
    }
  }

  static createErrorBoundary() {
    return class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }

      componentDidCatch(error, errorInfo) {
        ErrorHandler.logError(error, errorInfo);
      }

      render() {
        if (this.state.hasError) {
          return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🤖</div>
                <h1 className="text-2xl font-bold mb-4">Ops! Algo deu errado</h1>
                <p className="text-gray-600 mb-6">
                  Nosso Vision está trabalhando para resolver isso.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  Recarregar Aplicação
                </button>
              </div>
            </div>
          );
        }

        return this.props.children;
      }
    };
  }
}

export default ErrorHandler;