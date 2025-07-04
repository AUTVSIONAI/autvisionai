import axios from 'axios';
import { supabase } from '@/utils/supabase';

// Debug: Verificar variáveis de ambiente
console.log('🔍 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('🔍 Todas as env vars:', import.meta.env);

// 🚀 SISTEMA DE CACHE INTELIGENTE
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

const isCacheable = (config) => {
  // Só cachear GET requests que não sejam sensíveis
  return config.method === 'get' && 
         !config.url.includes('/auth') && 
         !config.url.includes('/realtime') &&
         !config.url.includes('/logs') &&
         !config.headers['no-cache'];
};

const getCacheKey = (config) => {
  return `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`;
};

// Criar instância do Axios com configuração base
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || 'https://autvisionai-backend-five.vercel.app').replace(/\/$/, ''),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

console.log('🚀 API baseURL final:', api.defaults.baseURL);

// Interceptor para adicionar API key, token de autenticação E cache
api.interceptors.request.use(async config => {
  // Debug: Log da requisição (corrigindo barras duplas)
  const fullUrl = (config.baseURL + config.url).replace(/([^:]\/)\/+/g, '$1');
  console.log('🌐 Fazendo requisição para:', fullUrl);
  
  // 🔄 VERIFICAR CACHE PRIMEIRO
  if (isCacheable(config)) {
    const cacheKey = getCacheKey(config);
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('💾 Cache hit para:', config.url);
      // Retornar promessa resolvida com dados do cache
      return Promise.reject({
        __cached: true,
        data: cached.data,
        status: 200,
        statusText: 'OK (cached)'
      });
    }
  }
  
  // Adiciona API key para o backend
  config.headers['x-api-key'] = 'autvision_backend_secure_key_2025';
  
  // Para FormData, remover Content-Type
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
    console.log('📁 Upload de arquivo detectado - Content-Type removido');
  }
  
  // Adiciona token de autenticação do Supabase se disponível
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
      console.log('🔑 Token adicionado à requisição');
    }
  } catch (error) {
    console.warn('❌ Erro ao obter token Supabase:', error);
  }
  
  return config;
});

// Interceptor para tratamento de erros E salvamento de cache
api.interceptors.response.use(
  response => {
    // 💾 SALVAR NO CACHE se for cacheável
    const config = response.config;
    if (isCacheable(config)) {
      const cacheKey = getCacheKey(config);
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
      console.log('💾 Dados salvos no cache para:', config.url);
    }
    
    return response;
  },
  error => {
    // ✅ TRATAR CACHE HITS
    if (error.__cached) {
      console.log('🎯 Retornando dados do cache');
      return Promise.resolve({
        data: error.data,
        status: error.status,
        statusText: error.statusText,
        cached: true
      });
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
      window.location.href = '/login';
    } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      console.warn('⚠️ Backend indisponível:', error.message);
      console.info('💡 Algumas funcionalidades podem estar limitadas.');
    }
    return Promise.reject(error);
  }
);

// 🧹 LIMPEZA PERIÓDICA DO CACHE
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`🧹 Cache limpo: ${cleaned} entradas expiradas removidas`);
  }
}, 2 * 60 * 1000); // Limpar a cada 2 minutos

export default api;
