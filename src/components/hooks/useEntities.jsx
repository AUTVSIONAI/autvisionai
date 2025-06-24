import { useState, useEffect } from 'react';

// HOOK GENÉRICO PARA CARREGAR DADOS DE UMA ENTIDADE
export function useEntityData(entity) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await entity.list();
      setData(list);
    } catch (err) {
      console.error(`Erro ao carregar dados para ${entity.name}:`, err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (entity) {
      loadData();
    }
  }, [entity]);

  return { data, isLoading, error, refresh: loadData };
}