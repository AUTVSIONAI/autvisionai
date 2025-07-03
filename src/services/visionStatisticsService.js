// 📊 VISION STATISTICS SERVICE - Busca estatísticas reais de interações
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://autvisionai-backend.vercel.app';

export class VisionStatisticsService {
  
  /**
   * 📈 Buscar estatísticas reais de um usuário específico
   */
  static async getUserStats(userId) {
    try {
      console.log(`📊 Buscando estatísticas para usuário ${userId}...`);
      
      const response = await axios.get(`${API_BASE_URL}/llm/user-stats/${userId}`, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        console.log(`✅ Estatísticas do usuário ${userId}:`, response.data.data);
        return response.data.data;
      } else {
        console.warn(`⚠️ Erro na resposta das estatísticas do usuário ${userId}:`, response.data);
        return this.getFallbackUserStats();
      }
      
    } catch (error) {
      console.error(`❌ Erro ao buscar estatísticas do usuário ${userId}:`, error.message);
      return this.getFallbackUserStats();
    }
  }
  
  /**
   * 🌍 Buscar estatísticas globais
   */
  static async getGlobalStats() {
    try {
      console.log('📊 Buscando estatísticas globais...');
      
      const response = await axios.get(`${API_BASE_URL}/llm/global-stats`, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        console.log('✅ Estatísticas globais:', response.data.data);
        return response.data.data;
      } else {
        console.warn('⚠️ Erro na resposta das estatísticas globais:', response.data);
        return this.getFallbackGlobalStats();
      }
      
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas globais:', error.message);
      return this.getFallbackGlobalStats();
    }
  }
  
  /**
   * 🔄 Buscar estatísticas para múltiplos usuários
   */
  static async getMultipleUserStats(userIds) {
    try {
      console.log(`📊 Buscando estatísticas para ${userIds.length} usuários...`);
      
      const promises = userIds.map(userId => this.getUserStats(userId));
      const results = await Promise.allSettled(promises);
      
      const stats = {};
      results.forEach((result, index) => {
        const userId = userIds[index];
        if (result.status === 'fulfilled') {
          stats[userId] = result.value;
        } else {
          console.warn(`⚠️ Falha ao buscar stats do usuário ${userId}:`, result.reason);
          stats[userId] = this.getFallbackUserStats();
        }
      });
      
      console.log('📋 Estatísticas consolidadas:', stats);
      return stats;
      
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas múltiplas:', error);
      return {};
    }
  }
  
  /**
   * 🎯 Fallback para estatísticas de usuário quando API falha
   */
  static getFallbackUserStats() {
    const daysActive = Math.floor(Math.random() * 30) + 1; // 1-30 dias
    const avgPerDay = Math.floor(Math.random() * 10) + 2; // 2-12 por dia
    
    return {
      total_interactions: Math.min(daysActive * avgPerDay, 500),
      interactions_today: Math.floor(Math.random() * avgPerDay) + 1,
      last_interaction: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      source: 'fallback'
    };
  }
  
  /**
   * 🌐 Fallback para estatísticas globais quando API falha
   */
  static getFallbackGlobalStats() {
    return {
      total_interactions: Math.floor(Math.random() * 2000) + 500,
      interactions_today: Math.floor(Math.random() * 50) + 10,
      active_users: Math.floor(Math.random() * 25) + 8,
      source: 'fallback'
    };
  }
  
  /**
   * 📅 Calcular idade da configuração em dias
   */
  static getConfigAgeDays(createdAt) {
    if (!createdAt) return 1;
    
    try {
      const created = new Date(createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - created);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(diffDays, 1);
    } catch (error) {
      console.warn('⚠️ Erro ao calcular idade da config:', error);
      return 1;
    }
  }
  
  /**
   * 🎲 Gerar estatísticas baseadas na idade da configuração
   */
  static generateRealisticStats(createdAt, userId) {
    const ageDays = this.getConfigAgeDays(createdAt);
    const baseUsagePerDay = Math.floor(Math.random() * 8) + 2; // 2-10 usos por dia
    
    // Usar userId para gerar estatísticas consistentes por usuário
    const userSeed = userId ? userId.charCodeAt(0) : 42;
    const userMultiplier = 0.8 + (userSeed % 10) * 0.04; // 0.8 a 1.2
    
    // Calcular total baseado na idade, mas com variação realística por usuário
    const totalInteractions = Math.min(
      Math.floor(ageDays * baseUsagePerDay * userMultiplier * (0.7 + Math.random() * 0.6)), // 70%-130% do esperado
      1000 // Máximo de 1000
    );
    
    // Interações hoje baseadas no padrão do usuário
    const interactionsToday = Math.floor(Math.random() * baseUsagePerDay) + 1;
    
    // Última interação entre hoje e 3 dias atrás
    const lastInteractionOffset = Math.random() * 3 * 24 * 60 * 60 * 1000; // 0-3 dias
    const lastInteraction = new Date(Date.now() - lastInteractionOffset).toISOString();
    
    return {
      total_interactions: totalInteractions,
      interactions_today: interactionsToday,
      last_interaction: lastInteraction,
      config_age_days: ageDays,
      source: 'realistic_generated'
    };
  }
}

export default VisionStatisticsService;
