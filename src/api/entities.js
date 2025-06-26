import api from './client';

// Entidades conectadas ao backend real AUTVISION
// Endpoints alinhados com as rotas documentadas no backend

class BaseEntity {
  static endpoint = '';

  static async list(params = {}) {
    try {
      const response = await api.get(this.endpoint, { params, timeout: 5000 });
      if (Array.isArray(response.data?.data)) return response.data.data;
      if (Array.isArray(response.data)) return response.data;
      return [];
    } catch (error) {
      // Silenciar logs em produção para evitar spam
      if (import.meta.env.DEV) {
        console.warn(`${this.constructor.name}.list falhou (usando fallback):`, error.message);
      }
      return [];
    }
  }

  static async get(id) {
    const response = await api.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  static async create(data) {
    const response = await api.post(this.endpoint, data);
    return response.data;
  }

  static async update(id, data) {
    const response = await api.put(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  static async delete(id) {
    const response = await api.delete(`${this.endpoint}/${id}`);
    return response.data;
  }
}

// ========== ENTIDADES PRINCIPAIS ==========

// Configurações do Sistema (alinhado com /config/*)
export class SystemConfig extends BaseEntity {
  static endpoint = '/config/system';
  
  static async getLLMs() {
    const response = await api.get('/config/llms');
    return response.data;
  }
  
  static async getAgents() {
    const response = await api.get('/config/agents');
    return response.data;
  }
  
  static async getHealth() {
    const response = await api.get('/config/health');
    return response.data;
  }
}

// LLM (alinhado com /llm/*)
export class LLM extends BaseEntity {
  static endpoint = '/llm';
  
  static async ask(data) {
    const response = await api.post(`${this.endpoint}/ask`, data);
    return response.data;
  }
  
  static async invoke(data) {
    const response = await api.post(`${this.endpoint}/invoke`, data);
    return response.data;
  }
}

// Comandos (alinhado com /command/*)
export class Command extends BaseEntity {
  static endpoint = '/command';
  
  static async execute(data) {
    const response = await api.post(`${this.endpoint}/execute`, data);
    return response.data;
  }
  
  static async getHistory(agentId, params = {}) {
    const response = await api.get(`${this.endpoint}/history/${agentId}`, { params });
    return response.data;
  }
}

// N8N (alinhado com /n8n/*)
export class N8N extends BaseEntity {
  static endpoint = '/n8n';
  
  static async trigger(data) {
    const response = await api.post(`${this.endpoint}/trigger`, data);
    return response.data;
  }
  
  static async getWorkflows() {
    const response = await api.get(`${this.endpoint}/workflows`);
    return response.data;
  }
  
  static async getExecutions(workflowId) {
    const response = await api.get(`${this.endpoint}/executions/${workflowId}`);
    return response.data;
  }
}

// OVOS (alinhado com /ovos/*)
export class OVOS extends BaseEntity {
  static endpoint = '/ovos';
  
  static async getStatus() {
    const response = await api.get(`${this.endpoint}/status`);
    return response.data;
  }
  
  static async sendCommand(data) {
    const response = await api.post(`${this.endpoint}/command`, data);
    return response.data;
  }
}

// Vision Supremo (alinhado com /supremo/*)
export class VisionSupremo extends BaseEntity {
  static endpoint = '/supremo';
  
  static async getCompanionProfile(userId) {
    const response = await api.get(`${this.endpoint}/companion/profile/${userId}`);
    return response.data;
  }
  
  static async updateExperience(userId, data) {
    const response = await api.post(`${this.endpoint}/companion/experience/${userId}`, data);
    return response.data;
  }
  
  static async getDashboard(userId) {
    const response = await api.get(`${this.endpoint}/dashboard/${userId}`);
    return response.data;
  }
  
  static async syncData(userId, modules) {
    const response = await api.post(`${this.endpoint}/sync/${userId}`, { modules });
    return response.data;
  }
}

// Logs (alinhado com /logs/*)
export class SystemLog extends BaseEntity {
  static endpoint = '/logs';
}

// ========== ENTIDADES DE COMPATIBILIDADE ==========

// Usuário - INTEGRADO COM SUPABASE AUTH REAL 🔥
export class User extends BaseEntity {
  static endpoint = '/users';

  static async me() {
    // Usar contexto de auth do Supabase - será implementado via useAuth()
    // Este método é mantido para compatibilidade, mas o estado real vem do AuthContext
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch {
      // Se falhar, retornar null para indicar não autenticado
      return null;
    }
  }

  static async login() {
    // DEPRECADO: Use AuthContext.signIn() ao invés desta função
    console.warn('User.login() está deprecado. Use useAuth().signIn() ao invés disso.');
    throw new Error('Use AuthContext para autenticação real com Supabase');
  }

  static async register() {
    // DEPRECADO: Use AuthContext.signUp() ao invés desta função
    console.warn('User.register() está deprecado. Use useAuth().signUp() ao invés disso.');
    throw new Error('Use AuthContext para registro real com Supabase');
  }

  static async logout() {
    // DEPRECADO: Use AuthContext.signOut() ao invés desta função
    console.warn('User.logout() está deprecado. Use useAuth().signOut() ao invés disso.');
    throw new Error('Use AuthContext para logout real com Supabase');
  }

  static async updateMyUserData(data) {
    // Atualizar perfil via API backend
    try {
      const response = await api.put('/users/profile', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }
}

// Entidades que serão implementadas conforme necessário
export class Agent extends BaseEntity { 
  static endpoint = '/agents';
  
  // Método principal para obter todos os agentes
  static async getAll() {
    try {
      // Usar endpoint direto /agents que conecta à tabela real
      const response = await api.get('/agents');
      if (Array.isArray(response.data?.data)) {
        return this.enhanceAgentsWithImages(response.data.data);
      }
      
      // Fallback para dados mock com imagens
      return this.getMockAgents();
    } catch (error) {
      console.warn('Agent.getAll falhou, usando dados mock:', error);
      return this.getMockAgents();
    }
  }
  
  // Método legado para compatibilidade
  static async filter() {
    return this.getAll();
  }
  
  // Upload de imagem do agente
  static async uploadImage(id, imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.post(`/agents/${id}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  }

  static getMockAgents() {
    return [
      {
        id: "agent_echo",
        name: "Echo",
        function: "Comunicação por voz e escuta ativa",
        image: "/assets/images/agents/agent-echo.png",
        type: "communication",
        description: "Especialista em processamento de voz, comandos por áudio e comunicação interativa.",
        status: 'active',
        model: "openai-whisper",
        capabilities: ["voice_recognition", "audio_processing", "real_time_communication"]
      },
      {
        id: "agent_guardian", 
        name: "Guardian",
        function: "Segurança e vigilância do sistema",
        image: "/assets/images/agents/agent-guardian.png",
        type: "security",
        description: "Monitora segurança, detecta ameaças e protege seus dados e automações.",
        status: 'active',
        model: "security-llm",
        capabilities: ["threat_detection", "system_monitoring", "data_protection"]
      },
      {
        id: "agent_nova",
        name: "Nova",
        function: "Análise e insights de dados",
        image: "/assets/images/agents/agent-nova.png", 
        type: "analytics",
        description: "Processamento avançado de dados, análises preditivas e geração de insights.",
        status: 'active',
        model: "claude-3",
        capabilities: ["data_analysis", "predictive_analytics", "insight_generation"]
      },
      {
        id: "agent_vision",
        name: "Vision",
        function: "Processamento de imagem e visão computacional",
        image: "/assets/images/agents/agent-vision.png",
        type: "vision", 
        description: "Especialista em análise de imagens, reconhecimento visual e visão computacional.",
        status: 'active',
        model: "gpt-4-vision",
        capabilities: ["image_analysis", "visual_recognition", "computer_vision"]
      },
      {
        id: "agent_ada",
        name: "ADA", 
        function: "Assistente de desenvolvimento e automação",
        image: "/assets/images/agents/agent-ADA.jpeg",
        type: "development",
        description: "Auxilia no desenvolvimento, automação de tarefas e otimização de processos.",
        status: 'active',
        model: "claude-3-sonnet",
        capabilities: ["code_generation", "task_automation", "process_optimization"]
      },
      {
        id: "agent_social",
        name: "Social",
        function: "Gestão de redes sociais e engajamento",
        image: "/assets/images/agents/agent-Social.jpeg",
        type: "social",
        description: "Gerencia presença online, cria conteúdo e monitora engajamento em redes sociais.",
        status: 'active',
        model: "gpt-4",
        capabilities: ["content_creation", "social_monitoring", "engagement_optimization"]
      }
    ];
  }

  static enhanceAgentsWithImages(agents) {
    const imageMap = {
      "vision": "/assets/images/agents/agent-vision.png",
      "echo": "/assets/images/agents/agent-echo.png", 
      "guardian": "/assets/images/agents/agent-guardian.png",
      "nova": "/assets/images/agents/agent-nova.png",
      "ada": "/assets/images/agents/agent-ADA.jpeg",
      "social": "/assets/images/agents/agent-Social.jpeg"
    };

    return agents.map(agent => ({
      ...agent,
      image: imageMap[agent.type?.toLowerCase()] || 
             imageMap[agent.name?.toLowerCase()] || 
             "/assets/images/agents/agent-vision.png",
      function: agent.function || agent.description || "Agente especializado",
      capabilities: agent.capabilities || ["ai_processing"]
    }));
  }
}

export class Routine extends BaseEntity { 
  static endpoint = '/routines';
  
  static async list(params = {}) {
    try {
      const response = await api.get(this.endpoint, { params });
      if (Array.isArray(response.data?.data)) return response.data.data;
      if (Array.isArray(response.data)) return response.data;
      return [];
    } catch (error) {
      console.warn('Routine.list falhou, retornando array vazio:', error);
      return [];
    }
  }
  
  static async filter(params = {}) {
    try {
      const response = await api.get(this.endpoint, { params });
      if (Array.isArray(response.data?.data)) return response.data.data;
      if (Array.isArray(response.data)) return response.data;
      return [];
    } catch (error) {
      console.warn('Routine.filter falhou, retornando array vazio:', error);
      return [];
    }
  }
}
export class Integration extends BaseEntity { 
  static endpoint = '/integrations';
  
  static async filter(params = {}) {
    try {
      const response = await api.get(this.endpoint, { params });
      if (Array.isArray(response.data?.data)) return response.data.data;
      if (Array.isArray(response.data)) return response.data;
      return [];
    } catch (error) {
      console.warn('Integration.filter falhou, retornando array vazio:', error);
      return [];
    }
  }
}
export class Plan extends BaseEntity { 
  static endpoint = '/plans'; 
  
  static async filter(params = {}) {
    try {
      // Temporariamente retornando dados mock até implementarmos a rota no backend
      const mockPlans = [
        {
          id: 1,
          name: 'Starter',
          price: 0,
          description: 'Plano gratuito para começar',
          features: ['5 agentes', '100 mensagens/mês', 'Suporte básico'],
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Pro',
          price: 29.90,
          description: 'Plano profissional com recursos avançados',
          features: ['20 agentes', '1000 mensagens/mês', 'Suporte prioritário', 'Integrações avançadas'],
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Enterprise',
          price: 99.90,
          description: 'Plano empresarial com recursos ilimitados',
          features: ['Agentes ilimitados', 'Mensagens ilimitadas', 'Suporte 24/7', 'Customizações'],
          is_active: true,
          created_at: new Date().toISOString()
        }
      ];

      // Filtrar por parâmetros se fornecidos
      if (params.is_active !== undefined) {
        return mockPlans.filter(plan => plan.is_active === params.is_active);
      }
      
      return mockPlans;
    } catch (error) {
      console.warn('Plan.filter falhou, retornando dados mock:', error);
      return [
        {
          id: 1,
          name: 'Starter',
          price: 0,
          description: 'Plano gratuito',
          features: ['Recursos básicos'],
          is_active: true
        }
      ];
    }
  }
}
export class Tutorial extends BaseEntity { 
  static endpoint = '/tutorials'; 
  static async filter(params = {}) {
    try {
      const response = await api.get(this.endpoint, { params });
      if (Array.isArray(response.data?.data)) return response.data.data;
      if (Array.isArray(response.data)) return response.data;
      return [];
    } catch (error) {
      console.warn('Tutorial.filter falhou, retornando array vazio:', error);
      return [];
    }
  }
  
  static async create(data) {
    try {
      const response = await api.post(this.endpoint, data);
      return response.data;
    } catch (error) {
      console.warn('Tutorial.create falhou:', error);
      return { id: Date.now(), ...data }; // Mock fallback
    }
  }
}
export class Mission extends BaseEntity { 
  static endpoint = '/missions';
  
  static async filter(params = {}) {
    try {
      const response = await api.get(this.endpoint, { params });
      if (Array.isArray(response.data?.data)) return response.data.data;
      if (Array.isArray(response.data)) return response.data;
      return [];
    } catch (error) {
      console.warn('Mission.filter falhou, retornando array vazio:', error);
      return [];
    }
  }
}

export class Badge extends BaseEntity { 
  static endpoint = '/badges';
  
  static async filter(params = {}) {
    try {
      const response = await api.get(this.endpoint, { params });
      if (Array.isArray(response.data?.data)) return response.data.data;
      if (Array.isArray(response.data)) return response.data;
      return [];
    } catch (error) {
      console.warn('Badge.filter falhou, retornando array vazio:', error);
      return [];
    }
  }
}

// VisionCompanion - usar Vision Supremo
export class VisionCompanion extends BaseEntity {
  static endpoint = '/supremo';

  static async filter(params = {}) {
    try {
      const response = await api.get(`${this.endpoint}/companion`, { params });
      if (Array.isArray(response.data?.data)) return response.data.data;
      if (response.data?.data) return [response.data.data];
      return [];
    } catch (error) {
      console.warn('VisionCompanion.filter falhou, retornando array vazio:', error);
      return [];
    }
  }

  static async create(data) {
    try {
      const response = await api.post(`${this.endpoint}/companion`, data);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Erro ao criar VisionCompanion:', error);
      // Retorna objeto mock se falhar
      return {
        id: 'mock_vision_' + Date.now(),
        name: data.name || 'Vision',
        created_by: data.created_by,
        total_interactions: 0,
        created_at: new Date().toISOString()
      };
    }
  }

  static async update(id, data) {
    try {
      const response = await api.put(`${this.endpoint}/companion/${id}`, data);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Erro ao atualizar VisionCompanion:', error);
      return data; // Retorna dados enviados se falhar
    }
  }
}

// Entidades administrativas (a implementar conforme necessário)
export class Affiliate extends BaseEntity { static endpoint = '/affiliates'; }
export class VisionAdmin extends BaseEntity { static endpoint = '/vision-admin'; }
export class LLMConfig extends BaseEntity { static endpoint = '/llm-config'; }
export class PlatformConfig extends BaseEntity { static endpoint = '/platform-config'; }
export class Transaction extends BaseEntity { static endpoint = '/transactions'; }
export class Wallet extends BaseEntity { static endpoint = '/wallets'; }
export class Notification extends BaseEntity { static endpoint = '/notifications'; }
export class Analytics extends BaseEntity { static endpoint = '/analytics'; }
export class Business extends BaseEntity { static endpoint = '/business'; }
export class PaymentGateway extends BaseEntity { static endpoint = '/payment-gateways'; }