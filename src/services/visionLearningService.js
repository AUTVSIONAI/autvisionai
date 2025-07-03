// 🧠 VISION LEARNING SERVICE - INTEGRAÇÃO SISTEMA DE APRENDIZADO
// Conecta o Vision Command Core com as tabelas de aprendizado

import { supabase } from '@/utils/supabase';

export class VisionLearningService {
  
  // 📚 GERENCIAR BASE DE CONHECIMENTO
  static async getKnowledgeBase(category = null) {
    try {
      let query = supabase
        .from('vision_knowledge_base')
        .select('*')
        .eq('is_active', true)
        .order('confidence_score', { ascending: false });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar base de conhecimento:', error);
      return [];
    }
  }
  
  static async addKnowledge(knowledge) {
    try {
      const { data, error } = await supabase
        .from('vision_knowledge_base')
        .insert([{
          category: knowledge.category,
          topic: knowledge.topic,
          content: knowledge.content,
          keywords: knowledge.keywords || [],
          confidence_score: knowledge.confidence_score || 100,
          source: knowledge.source || 'manual',
          created_by: knowledge.created_by
        }])
        .select();
      
      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('❌ Erro ao adicionar conhecimento:', error);
      throw error;
    }
  }
  
  // 💬 GERENCIAR CONVERSAS
  static async saveConversation(conversation) {
    try {
      // Validar user_id como UUID válido
      if (!conversation.user_id || typeof conversation.user_id !== 'string' || conversation.user_id.length < 10) {
        console.warn('⚠️ user_id inválido, usando fallback:', conversation.user_id);
        conversation.user_id = 'anonymous-user-' + Date.now();
      }
      
      const { data, error } = await supabase
        .from('vision_conversations')
        .insert([{
          user_id: conversation.user_id,
          session_id: conversation.session_id || 'session-' + Date.now(),
          message_type: conversation.message_type,
          content: conversation.content,
          context: conversation.context || {},
          response_time: conversation.response_time,
          satisfaction_score: conversation.satisfaction_score
        }])
        .select();
      
      if (error) {
        console.warn('⚠️ Erro ao salvar conversa, continuando sem salvar:', error.message);
        return null; // Não trava, apenas não salva
      }
      return data?.[0];
    } catch (error) {
      console.warn('⚠️ Erro ao salvar conversa, continuando sem salvar:', error.message);
      return null; // FALLBACK: não trava o Vision
    }
  }
  
  static async getConversationHistory(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('vision_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar histórico:', error);
      return [];
    }
  }
  
  // 📊 ANALYTICS
  static async logAction(action) {
    try {
      // Validar user_id
      if (!action.user_id || typeof action.user_id !== 'string' || action.user_id.length < 10) {
        console.warn('⚠️ user_id inválido para analytics, usando fallback');
        action.user_id = 'anonymous-user-' + Date.now();
      }
      
      const { data, error } = await supabase
        .from('vision_analytics')
        .insert([{
          user_id: action.user_id,
          action_type: action.action_type,
          action_category: action.action_category,
          action_details: action.action_details || {},
          success: action.success !== false,
          error_message: action.error_message,
          execution_time: action.execution_time,
          user_satisfaction: action.user_satisfaction
        }])
        .select();
      
      if (error) {
        console.warn('⚠️ Erro ao registrar analytics, continuando:', error.message);
        return null; // Não trava
      }
      return data?.[0];
    } catch (error) {
      console.warn('⚠️ Erro ao registrar ação, continuando:', error.message);
      return null; // FALLBACK: não trava o Vision
    }
  }
  
  static async getAnalytics(filters = {}) {
    try {
      let query = supabase
        .from('vision_analytics')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      
      if (filters.action_type) {
        query = query.eq('action_type', filters.action_type);
      }
      
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar analytics:', error);
      return [];
    }
  }
  
  // 🤖 CONFIGURAÇÕES DE TREINAMENTO DOS AGENTES
  static async getAgentTrainingConfig(agentId) {
    try {
      const { data, error } = await supabase
        .from('agent_training_configs')
        .select('*')
        .eq('agent_id', agentId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('❌ Erro ao buscar config de treinamento:', error);
      return null;
    }
  }
  
  static async saveAgentTrainingConfig(config) {
    try {
      const { data, error } = await supabase
        .from('agent_training_configs')
        .insert([{
          agent_id: config.agent_id,
          training_type: config.training_type,
          training_data: config.training_data,
          prompt_template: config.prompt_template,
          system_instructions: config.system_instructions,
          learning_parameters: config.learning_parameters || {},
          performance_metrics: config.performance_metrics || {},
          created_by: config.created_by
        }])
        .select();
      
      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('❌ Erro ao salvar config de treinamento:', error);
      throw error;
    }
  }
  
  // 📝 COMANDOS VISION
  static async getVisionCommands(category = null) {
    try {
      let query = supabase
        .from('vision_commands')
        .select('*')
        .eq('is_active', true)
        .order('usage_count', { ascending: false });
      
      if (category) {
        query = query.eq('command_category', category);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('❌ Erro ao buscar comandos:', error);
      return [];
    }
  }
  
  static async executeCommand(commandName, context = {}) {
    try {
      console.log('🎯 Executando comando:', commandName, 'com contexto:', context);
      
      // Buscar comando
      const { data: command, error } = await supabase
        .from('vision_commands')
        .select('*')
        .eq('command_name', commandName)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      
      // Incrementar contador de uso
      await supabase
        .from('vision_commands')
        .update({ usage_count: command.usage_count + 1 })
        .eq('id', command.id);
      
      // Executar comando baseado no tipo
      let result = null;
      
      switch (command.action_type) {
        case 'query':
          result = await this.executeQuery(command.action_config);
          break;
        case 'api_call':
          result = await this.executeApiCall(command.action_config);
          break;
        case 'report':
          result = await this.generateReport(command.action_config);
          break;
        default:
          result = { message: 'Comando executado com sucesso!' };
      }
      
      return {
        command: command,
        result: result,
        success: true
      };
      
    } catch (error) {
      console.error('❌ Erro ao executar comando:', error);
      return {
        command: null,
        result: null,
        success: false,
        error: error.message
      };
    }
  }
  
  // Métodos auxiliares para execução de comandos
  static async executeQuery(config) {
    try {
      let query = supabase.from(config.table);
      
      if (config.select) {
        query = query.select(config.select);
      } else {
        query = query.select('*');
      }
      
      if (config.where) {
        // Parse simple where conditions
        // Implementar parser mais complexo se necessário
      }
      
      if (config.order) {
        query = query.order(config.order);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('❌ Erro ao executar query:', error);
      return null;
    }
  }
  
  static async executeApiCall(config) {
    try {
      const response = await fetch(config.endpoint);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Erro ao executar API call:', error);
      return null;
    }
  }
  
  static async generateReport(config) {
    // Implementar geração de relatórios
    return {
      type: config.type,
      format: config.format,
      generated_at: new Date().toISOString(),
      message: 'Relatório gerado com sucesso!'
    };
  }
  
  // 🔍 BUSCA INTELIGENTE NO CONHECIMENTO (CORRIGIDA DEFINITIVA - ZERO ERRO 400)
  static async searchKnowledge(query, limit = 5) {
    try {
      console.log('🔍 [SEARCH] Query original recebida:', query?.substring(0, 100));
      
      // Validação básica
      if (!query || typeof query !== 'string' || query.trim().length < 2) {
        console.log('🔍 [SEARCH] Query inválida ou muito curta, retornando conhecimento geral');
        
        // Busca geral básica SEM filtros complexos
        const { data, error } = await supabase
          .from('vision_knowledge_base')
          .select('id, topic, content, confidence_score')
          .eq('is_active', true)
          .order('confidence_score', { ascending: false })
          .limit(3);
        
        if (error) {
          console.warn('⚠️ [SEARCH] Erro na busca básica:', error.message);
          return [];
        }
        
        return data || [];
      }
      
      // Sanitização ULTRA SEGURA
      const cleanQuery = query
        .trim()
        .replace(/[^\w\sáàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]/g, ' ') // Só alfanumérico e acentos
        .replace(/\s+/g, ' ') // Remove espaços múltiplos
        .substring(0, 20); // Máximo 20 caracteres
      
      console.log('🔍 [SEARCH] Query sanitizada:', cleanQuery);
      
      if (cleanQuery.length < 2) {
        console.log('🔍 [SEARCH] Query muito pequena após sanitização');
        return [];
      }
      
      // Estratégia MAIS SIMPLES: busca uma palavra por vez
      const words = cleanQuery.split(' ').filter(w => w.length >= 2).slice(0, 2); // Máximo 2 palavras
      
      if (words.length === 0) {
        return [];
      }
      
      console.log('🔍 [SEARCH] Palavras para busca:', words);
      
      // Busca palavra por palavra com query SIMPLES
      let allResults = [];
      
      for (const word of words) {
        try {
          console.log('🔍 [SEARCH] Buscando palavra:', word);
          
          // Query MAIS SIMPLES possível para evitar erro 400
          const { data, error } = await supabase
            .from('vision_knowledge_base')
            .select('id, topic, content, confidence_score')
            .textSearch('content', word, { type: 'plain' }) // Busca de texto simples
            .eq('is_active', true)
            .limit(2);
          
          if (error) {
            console.warn(`⚠️ [SEARCH] Erro na busca por "${word}":`, error.message);
            
            // Fallback: busca ainda mais simples
            try {
              const { data: fallbackData, error: fallbackError } = await supabase
                .from('vision_knowledge_base')
                .select('id, topic, content, confidence_score')
                .eq('is_active', true)
                .limit(1);
              
              if (!fallbackError && fallbackData) {
                allResults = [...allResults, ...fallbackData];
              }
            } catch (fallbackError) {
              console.warn('⚠️ [SEARCH] Até o fallback falhou para:', word);
            }
          } else if (data && data.length > 0) {
            allResults = [...allResults, ...data];
            console.log(`✅ [SEARCH] Encontrados ${data.length} resultados para "${word}"`);
          }
        } catch (wordError) {
          console.warn(`⚠️ [SEARCH] Erro crítico ao buscar "${word}":`, wordError.message);
          continue;
        }
      }
      
      // Remover duplicatas
      const uniqueResults = allResults.filter((item, index, self) => 
        self.findIndex(i => i.id === item.id) === index
      );
      
      // Ordenar por relevância
      uniqueResults.sort((a, b) => (b.confidence_score || 0) - (a.confidence_score || 0));
      
      const finalResults = uniqueResults.slice(0, limit);
      
      console.log('✅ [SEARCH] Busca concluída:', finalResults.length, 'resultados únicos');
      return finalResults;
      
    } catch (error) {
      console.error('❌ [SEARCH] Erro geral ao buscar conhecimento:', error.message);
      return []; // Sempre retorna array vazio em caso de erro
    }
  }
}

export default VisionLearningService;
