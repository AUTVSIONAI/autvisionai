import axios from 'axios';
import { supabase } from '@/utils/supabase';

// Debug: Verificar variáveis de ambiente
console.log('🔍 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('🔍 Todas as env vars:', import.meta.env);

// Criar instância do Axios com configuração base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://autvisionai-backend-five.vercel.app',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

console.log('🚀 API baseURL final:', api.defaults.baseURL);

// Interceptor para adicionar API key e token de autenticação
api.interceptors.request.use(async config => {
  // Debug: Log da requisição
  console.log('🌐 Fazendo requisição para:', config.baseURL + config.url);
  console.log('🔧 Config completa:', config);
  
  // Adiciona API key para o backend (mesma do .env do backend)
  config.headers['x-api-key'] = 'autvision_backend_secure_key_2025';
  
  // Para FormData (upload de arquivos), remover Content-Type para deixar o browser definir
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
    console.log('📁 Upload de arquivo detectado - Content-Type removido para FormData');
  }
  
  // Adiciona token de autenticação do Supabase se disponível
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
      console.log('🔑 Token adicionado à requisição:', config.url);
    } else {
      console.warn('⚠️ Sem token de autenticação para:', config.url);
    }
  } catch (error) {
    console.warn('❌ Erro ao obter token Supabase:', error);
  }
  
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
      window.location.href = '/login';
    } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      // Backend offline - log do erro mas não interrompe a aplicação
      console.warn('⚠️ Backend indisponível:', error.message);
      console.info('💡 Algumas funcionalidades podem estar limitadas.');
    }
    return Promise.reject(error);
  }
);

export default api;
