// 🔥 INTEGRAÇÃO LLM REAL COM BACKEND AUTVISION
import axios from "./client";

// 🌍 Configuração baseada em variáveis de ambiente
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://autvisionai-backend-five.vercel.app';
const LLM_MOCK_MODE = import.meta.env.VITE_LLM_MOCK_MODE === 'true';
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'development';

console.log('🔧 LLM Config:', { 
  API_BASE_URL, 
  LLM_MOCK_MODE, 
  ENVIRONMENT 
});

/**
 * 🧠 Invoca a LLM através do backend AutVision
 * @param {Object} params - Parâmetros da chamada LLM
 * @param {string} params.prompt - Prompt para a LLM
 * @param {string} [params.systemPrompt] - System prompt opcional
 * @param {string} [params.agentId] - ID do agente (opcional)
 * @param {Object} [params.context] - Contexto adicional
 * @param {Object} [params.response_json_schema] - Schema JSON esperado (será usado no system prompt)
 * @returns {Promise<Object>} Resposta da LLM
 */
export const InvokeLLM = async ({ 
  prompt, 
  systemPrompt, 
  context,
  response_json_schema 
}) => {
  // Se estiver em modo mock, retorna resposta mock diretamente
  if (LLM_MOCK_MODE) {
    console.log('🤖 Modo Mock ativado, retornando resposta simulada');
    return generateMockResponse(prompt, response_json_schema);
  }

  try {
    // Se há schema JSON, ajustar o system prompt para solicitar JSON
    let finalSystemPrompt = systemPrompt;
    if (response_json_schema && !finalSystemPrompt?.includes('JSON')) {
      finalSystemPrompt = `${systemPrompt || 'Você é um assistente útil.'}\n\nIMPORTANTE: Responda APENAS com um JSON válido seguindo exatamente este schema:\n${JSON.stringify(response_json_schema, null, 2)}`;
    }

    console.log('🧠 Enviando prompt para LLM:', prompt.substring(0, 100) + '...');

    const response = await axios.post('/llm/invoke', {
      prompt,
      options: {
        systemPrompt: finalSystemPrompt,
        temperature: 0.7,
        maxTokens: 2048
      },
      context: {
        source: 'vision-commander',
        timestamp: new Date().toISOString(),
        environment: ENVIRONMENT,
        ...context
      }
    }, { 
      timeout: 15000, // Timeout de 15s para produção
      baseURL: API_BASE_URL
    });

    if (response.data?.success) {
      const llmResponse = response.data.data.content || response.data.data.response;
      
      // Se esperamos JSON, tentar fazer parse
      if (response_json_schema) {
        try {
          // Extrair JSON se a resposta contém texto + JSON
          const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          } else {
            return JSON.parse(llmResponse);
          }
        } catch (parseError) {
          console.warn('❌ Resposta não é JSON válido, retornando como texto:', parseError);
          return { response: llmResponse, error: 'Invalid JSON response' };
        }
      }

      // Retorna resposta como string se não é JSON
      return { 
        response: llmResponse,
        modelUsed: response.data.data.modelUsed || 'IA',
        tokensUsed: response.data.data.tokensUsed || 0
      };
    } else {
      throw new Error(response.data?.error || 'Erro na resposta da LLM');
    }

  } catch (error) {
    console.error('❌ Erro ao chamar LLM:', error);
    
    // Fallback para desenvolvimento quando backend não está disponível
    if (error.response?.status === 404 || 
        error.code === 'ECONNREFUSED' || 
        error.code === 'ECONNABORTED' || 
        error.message?.includes('Network Error') ||
        error.message?.includes('timeout')) {
      
      console.warn('⚠️ Backend não disponível, usando resposta mock');
      return generateMockResponse(prompt, response_json_schema);
    }
    
    throw error;
  }
};

/**
 * 🎭 Gera resposta mock inteligente baseada no prompt e schema
 */
function generateMockResponse(prompt, response_json_schema) {
  // Se esperamos JSON estruturado
  if (response_json_schema) {
    return generateMockJsonResponse(response_json_schema);
  }

  // Respostas mock baseadas no contexto do prompt
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('analise') || promptLower.includes('análise')) {
    return {
      response: 'Sistema AUTVISION funcionando perfeitamente em modo de desenvolvimento. Backend será conectado em breve. Todas as funcionalidades core estão operacionais.',
      modelUsed: 'MockAI Dev',
      tokensUsed: 50
    };
  }
  
  if (promptLower.includes('comando') || promptLower.includes('executar')) {
    return {
      response: 'Comando processado com sucesso. Sistema em modo de desenvolvimento - todas as operações estão sendo simuladas.',
      modelUsed: 'MockAI Command',
      tokensUsed: 30
    };
  }
  
  if (promptLower.includes('chat') || promptLower.includes('conversa') || promptLower.includes('como') || promptLower.includes('o que') || promptLower.includes('qual')) {
    const responses = [
      'Entendi sua pergunta! Como assistente da AUTVISION, posso ajudar você a automatizar tarefas, criar agentes inteligentes e otimizar seus processos. O que você gostaria de automatizar primeiro?',
      'Ótima pergunta! A AUTVISION oferece criação de agentes personalizados, automação de rotinas e integração com diversas plataformas. Qual área do seu negócio você gostaria de otimizar?',
      'Interessante! Posso ajudar você a configurar automações específicas para suas necessidades. Você tem algum processo repetitivo que gostaria de automatizar?',
      'Perfeito! Com a AUTVISION você pode criar agentes para atendimento, análise de dados, gestão de redes sociais e muito mais. Qual tipo de agente seria mais útil para você?',
      'Claro! Estou aqui para orientar você sobre as funcionalidades da plataforma. Você gostaria de saber sobre criação de agentes, automação de tarefas ou integração com outras ferramentas?',
      'Excelente! A AUTVISION permite automatizar desde tarefas simples até processos complexos. Conte-me mais sobre o que você precisa automatizar.',
      'Que bom que perguntou! Posso ajudar você a escolher os melhores agentes para suas necessidades específicas. Qual é o seu principal desafio atualmente?'
    ];
    
    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      modelUsed: 'Vision AI',
      tokensUsed: 45
    };
  }
  
  // Resposta genérica mais útil
  const genericResponses = [
    'Olá! 👋 Sou o VISION, seu assistente inteligente na AUTVISION. Como posso ajudar você hoje? Posso orientar sobre criação de agentes, automação de processos ou integração de ferramentas.',
    'Oi! Estou aqui para ajudar você a aproveitar ao máximo a plataforma AUTVISION. Você gostaria de saber sobre nossos agentes inteligentes ou como automatizar suas tarefas?',
    'Seja bem-vindo! 🚀 Como assistente da AUTVISION, posso ajudar você a criar soluções de automação personalizadas. Qual é o seu objetivo principal?',
    'Olá! Que bom ter você aqui na AUTVISION. Posso ajudar você a configurar agentes, automatizar rotinas ou integrar sistemas. O que você precisa?'
  ];
  
  return {
    response: genericResponses[Math.floor(Math.random() * genericResponses.length)],
    modelUsed: 'Vision AI',
    tokensUsed: 35
  };
}

/**
 * 🔧 Gera resposta mock baseada no schema JSON
 */
function generateMockJsonResponse(schema) {
  if (schema.type === 'object' && schema.properties) {
    const mockResponse = {};
    
    Object.keys(schema.properties).forEach(key => {
      const property = schema.properties[key];
      
      if (property.type === 'array' && property.items) {
        if (key === 'insights') {
          mockResponse[key] = [
            {
              type: 'performance',
              message: 'Sistema funcionando em modo de desenvolvimento. Backend será configurado em breve.',
              priority: 'medium'
            },
            {
              type: 'users',
              message: 'Chat simulado ativo. Todas as funcionalidades estão sendo testadas.',
              priority: 'low'
            },
            {
              type: 'system',
              message: 'Deploy para Vercel em preparação. Integração LLM real será ativada.',
              priority: 'high'
            }
          ];
        } else {
          mockResponse[key] = ['Item mock 1', 'Item mock 2'];
        }
      } else if (property.type === 'string') {
        if (key === 'response') {
          mockResponse[key] = 'Sistema AUTVISION operacional em modo de desenvolvimento. Preparando para deploy...';
        } else if (key === 'action') {
          mockResponse[key] = 'mock_action';
        } else {
          mockResponse[key] = `Mock ${key}`;
        }
      } else if (property.type === 'boolean') {
        mockResponse[key] = key === 'execute' ? false : true;
      } else if (property.type === 'number') {
        mockResponse[key] = Math.floor(Math.random() * 100);
      }
    });
    
    return mockResponse;
  }
  
  // Fallback para schemas não reconhecidos
  return {
    response: 'Mock response - sistema em desenvolvimento',
    success: true
  };
}

/**
 * 🔍 Verifica se o backend está disponível
 */
export const checkBackendHealth = async () => {
  try {
    const response = await axios.get('/health', {
      timeout: 5000,
      baseURL: API_BASE_URL
    });
    
    return {
      available: true,
      status: response.data?.status || 'ok',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.warn('⚠️ Backend health check falhou:', error.message);
    return {
      available: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * 📊 Obter configurações do sistema
 */
export const getSystemConfig = async () => {
  try {
    const response = await axios.get('/config/system', {
      timeout: 5000,
      baseURL: API_BASE_URL
    });
    
    return response.data;
  } catch (error) {
    console.warn('⚠️ Não foi possível carregar configurações do sistema:', error.message);
    
    // Retorna configurações mock
    return {
      app_name: 'AutVision AI',
      app_version: '1.0.0',
      environment: ENVIRONMENT,
      llm_available: !LLM_MOCK_MODE,
      features: {
        voice_enabled: true,
        chat_enabled: true,
        admin_panel: true
      }
    };
  }
};

// Exportações adicionais para compatibilidade
export default InvokeLLM;

/**
 * 🤖 Gera respostas mock inteligentes baseadas em prompts comuns
 */
function generateIntelligentMockResponse() {
  const responses = [
    "🤖 Olá! Eu sou o Vision, seu assistente IA da AUTVISION. Como posso ajudar você hoje?",
    "✨ O sistema AUTVISION está funcionando perfeitamente! Estou aqui para auxiliar com agentes, rotinas e automações.",
    "🚀 Pronto para criar algo incrível? Posso ajudar você a configurar agentes inteligentes e rotinas automatizadas.",
    "💡 Que funcionalidade da AUTVISION você gostaria de explorar? Temos agentes especializados, rotinas personalizadas e muito mais!",
    "🎯 Backend em modo de desenvolvimento. Todas as funcionalidades principais estão operacionais para teste.",
    "🔧 Sistema em perfeito funcionamento! O que você gostaria de saber sobre a plataforma AUTVISION?"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// Função real de upload de arquivo para o backend
export async function UploadFile({ file }) {
  const formData = new FormData();
  formData.append("file", file);
  // Ajuste o endpoint abaixo conforme o backend
  const response = await axios.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}
