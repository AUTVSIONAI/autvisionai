import api from './client';

// Entidades conectadas ao backend real AUTVISION
// Endpoints alinhados com as rotas documentadas no backend

class BaseEntity {
  static endpoint = '';

  static async list(params = {}) {
    try {
      const response = await api.get(this.endpoint, { params });
      if (Array.isArray(response.data?.data)) return response.data.data;
      if (Array.isArray(response.data)) return response.data;
      return [];
    } catch (error) {
      console.warn(`${this.constructor.name}.list falhou:`, error);
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

// Usuário (endpoints que precisam ser implementados ou simulados)
export class User extends BaseEntity {
  static endpoint = '/users';

  static async me() {
    // Simulação temporária - implementar autenticação real
    return { 
      id: 'user_1', 
      full_name: 'Usuário AUTVISION', 
      email: 'user@autvision.ai',
      role: 'admin',
      tokens: 1000
    };
  }

  static async login(credentials) {
    // Simulação temporária - implementar autenticação real
    const mockToken = 'mock_jwt_token_autvision';
    localStorage.setItem('autvision_token', mockToken);
    return { 
      token: mockToken, 
      user: { 
        id: 'user_1', 
        full_name: credentials.email,
        email: credentials.email,
        role: 'admin',
        tokens: 1000
      } 
    };
  }

  static async register(data) {
    return this.login(data);
  }
}

// Entidades que serão implementadas conforme necessário
export class Agent extends BaseEntity { 
  static endpoint = '/agents';
  
  static async filter() {
    // Usar endpoint de configuração por enquanto
    const response = await api.get('/config/agents');
    if (Array.isArray(response.data?.data?.agents)) return response.data.data.agents;
    return [];
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
export class Plan extends BaseEntity { static endpoint = '/plans'; }
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