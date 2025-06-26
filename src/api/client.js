import axios from 'axios';

// Criar instância do Axios com configuração base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar API key e token de autenticação
api.interceptors.request.use(config => {
  // Adiciona API key para o backend
  config.headers['x-api-key'] = 'autvision_backend_secure_key_2025';
  
  // Adiciona token de autenticação se disponível
  const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'autvision_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
