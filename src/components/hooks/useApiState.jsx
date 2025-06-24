import { useState } from 'react';

// HOOK PARA GERENCIAR ESTADOS DE API (LOADING, ERROR, SUCCESS)
export const useApiState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeAsync = async (asyncFunction) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      return result;
    } catch (err) {
      setError(err.message || 'Erro desconhecido');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    isLoading,
    error,
    executeAsync,
    clearError
  };
};