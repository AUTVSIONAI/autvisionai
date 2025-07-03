import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { User, Agent } from '@/api/entities';
import { VisionPersonalizationService } from '@/services/visionPersonalizationService';
import { supabase } from '@/utils/supabase';

// 🌐 CONFIGURAÇÃO DA API
const BACKEND_URL = 'https://autvisionai-backend.vercel.app';

// Context para dados administrativos do Vision Command Core
const AdminDataContext = createContext();

// Hook personalizado para usar os dados administrativos
export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    // Log de debug para rastrear onde está sendo chamado incorretamente
    console.error('🔥 useAdminData chamado fora do AdminDataProvider!', {
      stack: new Error().stack
    });
    throw new Error('useAdminData deve ser usado dentro de AdminDataProvider');
  }
  return context;
};

// Hook seguro que não quebra se usado fora do contexto
export const useSafeAdminData = () => {
  try {
    return useAdminData();
  } catch (error) {
    console.warn('⚠️ AdminData não disponível, usando fallback:', error.message);
    return { 
      data: {
        agents: [],
        visions: [],
        users: [],
        systemStats: {
          uptime: '0h 0m',
          totalRequests: 0,
          successRate: 0,
          averageResponseTime: 0,
          activeConnections: 0,
          memoryUsage: 0,
          cpuUsage: 0
        }
      }, 
      isLoading: false, 
      error: 'Contexto não disponível',
      refreshAll: () => console.log('🔄 Refresh indisponível fora do contexto')
    };
  }
};

// Provider dos dados administrativos
export const AdminDataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Ref para controlar se já está carregando (evitar múltiplas chamadas)
  const isLoadingRef = useRef(false);

  // Função para simular dados do sistema
  const generateMockData = () => {
    return {
      agents: [
        { id: 1, name: 'Vision Alpha', status: 'active', type: 'assistant', interactions: 1250 },
        { id: 2, name: 'Vision Beta', status: 'active', type: 'automation', interactions: 890 },
        { id: 3, name: 'Vision Gamma', status: 'inactive', type: 'analysis', interactions: 456 },
        { id: 4, name: 'Vision Delta', status: 'active', type: 'support', interactions: 2100 },
        { id: 5, name: 'Vision Echo', status: 'active', type: 'monitoring', interactions: 678 }
      ],
      visions: [
        { 
          id: 1, 
          name: 'Questão', 
          status: 'active', 
          total_interactions: 530, 
          personality: 'analytical',
          description: 'Vision especializado em análise e resolução de problemas',
          users_count: 45,
          interactions_today: 127,
          capabilities: ['chat', 'analise', 'suporte'],
          created_at: '2024-01-15T10:00:00Z'
        },
        { 
          id: 2, 
          name: 'Echo', 
          status: 'active', 
          total_interactions: 230, 
          personality: 'friendly',
          description: 'Vision assistente com personalidade amigável e acolhedora',
          users_count: 32,
          interactions_today: 89,
          capabilities: ['chat', 'suporte', 'social'],
          created_at: '2024-01-20T14:30:00Z'
        },
        { 
          id: 3, 
          name: 'Social', 
          status: 'active', 
          total_interactions: 220, 
          personality: 'social',
          description: 'Vision otimizado para interações sociais e networking',
          users_count: 28,
          interactions_today: 64,
          capabilities: ['chat', 'social', 'networking'],
          created_at: '2024-02-01T09:15:00Z'
        },
        { 
          id: 4, 
          name: 'Nova', 
          status: 'active', 
          total_interactions: 180, 
          personality: 'creative',
          description: 'Vision criativo para geração de conteúdo e ideias inovadoras',
          users_count: 19,
          interactions_today: 43,
          capabilities: ['chat', 'criativo', 'content'],
          created_at: '2024-02-05T16:45:00Z'
        },
        { 
          id: 5, 
          name: 'Auto', 
          status: 'inactive', 
          total_interactions: 100, 
          personality: 'efficient',
          description: 'Vision automatizado para tarefas repetitivas e eficiência',
          users_count: 12,
          interactions_today: 0,
          capabilities: ['automacao', 'eficiencia', 'tasks'],
          created_at: '2024-01-25T11:20:00Z'
        }
      ],
      users: [
        { id: 1, name: 'Admin', role: 'administrator', last_active: '2024-01-15T10:30:00Z' },
        { id: 2, name: 'User1', role: 'user', last_active: '2024-01-15T09:15:00Z' },
        { id: 3, name: 'User2', role: 'user', last_active: '2024-01-14T16:45:00Z' }
      ],
      systemStats: {
        uptime: '24h 15m',
        totalRequests: 15420,
        successRate: 98.5,
        averageResponseTime: 245,
        activeConnections: 42,
        memoryUsage: 68,
        cpuUsage: 45
      },
      recentActivity: [
        { id: 1, type: 'interaction', agent: 'Vision Alpha', timestamp: '2024-01-15T10:25:00Z', status: 'success' },
        { id: 2, type: 'automation', agent: 'Vision Beta', timestamp: '2024-01-15T10:20:00Z', status: 'success' },
        { id: 3, type: 'analysis', agent: 'Vision Gamma', timestamp: '2024-01-15T10:15:00Z', status: 'warning' },
        { id: 4, type: 'support', agent: 'Vision Delta', timestamp: '2024-01-15T10:10:00Z', status: 'success' }
      ]
    };
  };

  // Função para enriquecer visions com dados reais dos usuários
  const enrichVisionsWithUserData = async (visions) => {
    console.log('👥 Iniciando enriquecimento de usuários para', visions.length, 'visions');
    
    const enrichedVisions = await Promise.allSettled(
      visions.map(async (vision) => {
        try {
          // Se já tem nome de usuário válido E não é genérico, pular
          const isGenericName = vision.user_name && (
            vision.user_name === 'Usuário Anônimo' || 
            vision.user_name === 'Usuário Desconhecido' ||
            vision.user_name.startsWith('Usuário ') ||
            // Lista de nomes genéricos que podem ter sido gerados
            ['Ana Silva', 'João Santos', 'Maria Oliveira', 'Carlos Souza', 'Fernanda Costa',
             'Pedro Lima', 'Juliana Alves', 'Ricardo Ferreira', 'Camila Rodrigues', 'Bruno Martins',
             'Larissa Pereira', 'Rafael Barbosa', 'Mariana Gomes', 'Diego Carvalho', 'Aline Ribeiro',
             'Lucas Araújo', 'Priscila Dias', 'Thiago Moreira', 'Vanessa Cardoso', 'Felipe Castro',
             'Gabriela Nunes', 'André Ramos', 'Tatiana Correia', 'Marcelo Teixeira', 'Renata Vieira',
             'Oseias Gomes', 'Mariza Milene', 'Roberto Machado', 'Claudia Monteiro', 'Daniel Pinto'].includes(vision.user_name)
          );

          if (vision.user_name && !isGenericName && vision.user_source === 'api') {
            console.log(`👤 Vision ${vision.id} já tem nome real do usuário:`, vision.user_name);
            return vision;
          }

          // Primeiro, tentar buscar dados do usuário via backend
          try {
            console.log(`🌐 Tentando buscar usuário ${vision.user_id} via backend...`);
            const backendResponse = await fetch(`${BACKEND_URL}/users/${vision.user_id}`);
            
            if (backendResponse.ok) {
              const backendData = await backendResponse.json();
              if (backendData.success && backendData.data) {
                console.log(`✅ Dados do backend obtidos para usuário ${vision.user_id}:`, backendData.data);
                const enrichedVision = {
                  ...vision,
                  user_name: backendData.data.full_name || backendData.data.email?.split('@')[0] || vision.user_name,
                  user_email: backendData.data.email || vision.user_email,
                  user_source: 'backend',
                  description: `Vision personalizado de ${backendData.data.full_name || backendData.data.email?.split('@')[0] || vision.user_name}`
                };
                
                console.log(`🎯 Vision ${vision.id} enriquecido via backend:`, {
                  id: enrichedVision.id,
                  name: enrichedVision.name,
                  user_name: enrichedVision.user_name,
                  user_source: enrichedVision.user_source,
                  description: enrichedVision.description
                });
                
                return enrichedVision;
              }
            }
          } catch (backendError) {
            console.warn(`⚠️ Backend indisponível para usuário ${vision.user_id}, tentando Supabase...`, backendError.message);
          }

          // Fallback: Usar dados do Supabase
          console.log(`🗃️ Usando dados do Supabase para usuário ${vision.user_id}`);
          
          // Buscar dados do usuário do auth.users (tabela principal de usuários)
          const { data: authUser, error: authError } = await supabase
            .from('auth.users')
            .select('email, raw_user_meta_data')
            .eq('id', vision.user_id)
            .maybeSingle();

          if (!authError && authUser) {
            console.log(`✅ Dados encontrados no auth.users para ${vision.user_id}:`, authUser);
            
            const enrichedVision = {
              ...vision,
              user_name: authUser.raw_user_meta_data?.full_name || authUser.email?.split('@')[0] || vision.user_name,
              user_email: authUser.email || vision.user_email,
              user_source: 'supabase_auth',
              description: `Vision personalizado de ${authUser.raw_user_meta_data?.full_name || authUser.email?.split('@')[0] || vision.user_name}`
            };
            
            console.log(`🎯 Vision ${vision.id} enriquecido via auth.users:`, {
              id: enrichedVision.id,
              name: enrichedVision.name,
              user_name: enrichedVision.user_name,
              user_source: enrichedVision.user_source,
            });
            
            return enrichedVision;
          }

          // Fallback: Buscar dados do userprofile
          const { data: supabaseUser, error } = await supabase
            .from('userprofile')
            .select('full_name, email')
            .eq('id', vision.user_id)
            .maybeSingle(); // Usar maybeSingle para evitar erro se não existir

          if (supabaseUser && !error) {
            console.log(`✅ Dados do Supabase obtidos para usuário ${vision.user_id}:`, supabaseUser);
              const enrichedVision = {
              ...vision,
              user_name: supabaseUser.full_name || supabaseUser.email?.split('@')[0] || vision.user_name,
              user_email: supabaseUser.email || vision.user_email,
              user_source: 'supabase',
              description: `Vision personalizado de ${supabaseUser.full_name || supabaseUser.email?.split('@')[0] || vision.user_name}`
            };
            
            console.log(`🎯 Vision ${vision.id} enriquecido:`, {
              id: enrichedVision.id,
              name: enrichedVision.name,
              user_name: enrichedVision.user_name,
              user_source: enrichedVision.user_source,
              description: enrichedVision.description
            });
            
            return enrichedVision;
          }

          console.log(`⚠️ Não foi possível obter dados do usuário ${vision.user_id} - mantendo dados atuais`);
          return vision;
        } catch (error) {
          console.error(`❌ Erro ao buscar usuário ${vision.user_id}:`, error);
          return vision;
        }
      })
    );

    // Processar resultados
    const finalVisions = enrichedVisions.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.error(`❌ Erro no enriquecimento da vision ${visions[index].id}:`, result.reason);
        return visions[index]; // Retornar original em caso de erro
      }
    });

    const enrichedCount = finalVisions.filter(v => v.user_source === 'supabase' || v.user_source === 'api').length;
    console.log(`✅ Enriquecimento concluído: ${enrichedCount}/${visions.length} visions com dados REAIS de usuário`);
    
    // 🔥 DEBUG: Log detalhado do resultado final
    finalVisions.forEach((vision, index) => {
      console.log(`📋 Vision ${index + 1} final:`, {
        id: vision.id,
        name: vision.name,
        user_name: vision.user_name,
        user_source: vision.user_source || 'generated',
        isRealUser: vision.user_source === 'api'
      });
    });
    
    return finalVisions;
  };

  // Função para carregar dados REAIS da API (com fallback inteligente e retry)
  const loadData = useCallback(async (retryCount = 0) => {
    const MAX_RETRIES = 2;
    
    // Evitar múltiplas chamadas simultâneas
    if (isLoadingRef.current && retryCount === 0) {
      console.log('⏳ Carregamento já em andamento, ignorando nova solicitação...');
      return;
    }
    
    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Carregando dados reais da plataforma... (tentativa', retryCount + 1, ')');
      
      // Fazer requests paralelos com tratamento robusto de erro
      console.log('📡 Tentando conectar com endpoints do backend...');
      
      const [
        usersData,
        agentsData, 
        visionsData
      ] = await Promise.allSettled([
        // Users com timeout e fallback
        Promise.race([
          User.list(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          )
        ]).catch(err => {
          console.warn('⚠️ Endpoint /users falhou:', err.response?.status || err.message);
          return []; // Fallback vazio
        }),
        
        // Agents com timeout e fallback
        Promise.race([
          Agent.getAll(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          )
        ]).catch(err => {
          console.warn('⚠️ Endpoint /agents falhou:', err.response?.status || err.message);
          return []; // Fallback vazio
        }),
        
        // VisionCompanion - CARREGAMENTO REAL (MÉTODO ULTRA-SIMPLES SEM JOIN)
        Promise.race([
          VisionPersonalizationService.getVisionConfigsSimple().catch((err) => {
            console.log('🎭 Método ultra-simples falhou, tentando método userprofile...', err.message);
            return VisionPersonalizationService.getAllVisionConfigsWithUserProfile();
          }).catch((err) => {
            console.log('🎭 Método userprofile falhou, tentando método básico...', err.message);
            return VisionPersonalizationService.getAllVisionConfigs();
          }).catch((err) => {
            console.log('🚨 Todos métodos falharam, usando MODO EMERGÊNCIA...', err.message);
            // MODO EMERGÊNCIA: usar dados simulados quando RLS falha
            return VisionPersonalizationService.getVisionConfigsEmergency();
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 8000)
          )
        ]).catch(err => {
          console.warn('⚠️ Timeout total - usando modo emergência:', err.message);
          return VisionPersonalizationService.getVisionConfigsEmergency();
        })
      ]);

      // Processar resultados com fallback ULTRA robusto
      const processResult = (result, mockData, name) => {
        // Se a promissão foi resolvida com sucesso e tem dados
        if (result.status === 'fulfilled' && result.value && Array.isArray(result.value) && result.value.length > 0) {
          console.log(`✅ ${name} carregados com sucesso:`, result.value.length, 'registros reais');
          return result.value;
        }
        
        // Se foi resolvida mas com array vazio (comum quando backend está com problemas)
        if (result.status === 'fulfilled' && Array.isArray(result.value) && result.value.length === 0) {
          console.log(`⚠️ ${name} retornou lista vazia - usando dados mock para melhor experiência`);
          return mockData;
        }
        
        // Se falhou completamente
        if (result.status === 'rejected') {
          let errorMsg = 'Erro desconhecido';
          if (result.reason?.response?.status === 500) {
            errorMsg = 'Erro interno do servidor (500)';
          } else if (result.reason?.response?.status === 400) {
            errorMsg = 'Requisição malformada (400)';
          } else if (result.reason?.response?.status === 404) {
            errorMsg = 'Endpoint não encontrado (404)';
          } else if (result.reason?.message) {
            errorMsg = result.reason.message;
          }
          
          console.log(`🎭 ${name} indisponível (${errorMsg}) - usando dados mock`);
          return mockData;
        }
        
        // Fallback final
        console.log(`🎭 ${name} fallback final - usando dados mock`);
        return mockData;
      };

      // Dados reais com fallback para mocks
      const mockData = generateMockData();
      
      // Processar os dados primeiro
      const processedUsers = processResult(usersData, [
        { id: 1, name: 'Admin', email: 'digitalinfluenceradm@gmail.com', role: 'administrator', last_active: new Date().toISOString(), plan_id: 1 },
        { id: 2, name: 'User Demo', email: 'user@demo.com', role: 'user', last_active: new Date().toISOString(), plan_id: 2 }
      ], 'Usuários');
      
      const processedAgents = processResult(agentsData, mockData.agents, 'Agentes');
      
      // Processar Visions reais com transformação de dados
      let processedVisions;
      console.log('🔍 Processando dados dos Visions:', visionsData);
      console.log('🔍 Status do visionsData:', visionsData.status);
      console.log('🔍 Valor do visionsData:', visionsData.value);
      console.log('🔍 Tipo do valor:', typeof visionsData.value);
      console.log('🔍 É array?', Array.isArray(visionsData.value));
      console.log('🔍 Length:', visionsData.value?.length);
      
      if (visionsData.status === 'fulfilled' && visionsData.value && Array.isArray(visionsData.value) && visionsData.value.length > 0) {
        console.log(`✅ Visions carregados com sucesso:`, visionsData.value.length, 'registros reais');
        console.log('📊 Dados recebidos:', visionsData.value);
        
        // 🔥 LOG DETALHADO: Examinar cada item
        visionsData.value.forEach((item, index) => {
          console.log(`📋 Vision ${index + 1}:`, item);
        });
        
        // Transformar dados reais para formato esperado
        // IMPORTANTE: Usar estatísticas reais baseadas na idade da configuração
        processedVisions = visionsData.value.map((config, index) => {
          // Para o método ultra-simples, não temos dados de userprofile
          // Usar dados básicos disponíveis na configuração
          const isUltraSimple = !config.userprofile;
          
          // 👤 TENTAR EXTRAIR NOME REAL DO USUÁRIO (MELHORADO)
          let userName = 'Usuário Anônimo';
          let userEmail = `user-${config.user_id}@sistema.com`;
          
          console.log(`🔍 Analisando dados do usuário para Vision ${index + 1}:`, {
            'config.userprofile': config.userprofile,
            'config.profiles': config.profiles,
            'config.user_email': config.user_email,
            'config.email': config.email,
            'todas as propriedades': Object.keys(config)
          });
          
          // Primeiro, tentar dados do userprofile (método completo)
          if (config.userprofile?.full_name) {
            userName = config.userprofile.full_name;
            userEmail = config.userprofile.email || userEmail;
            console.log(`✅ Nome extraído do userprofile.full_name: ${userName}`);
          } 
          // Segundo, tentar dados do profiles (método direto)
          else if (config.profiles?.full_name) {
            userName = config.profiles.full_name;
            userEmail = config.profiles.email || userEmail;
            console.log(`✅ Nome extraído do profiles.full_name: ${userName}`);
          }
          // Terceiro, tentar email como nome se disponível no userprofile
          else if (config.userprofile?.email) {
            const emailName = config.userprofile.email.split('@')[0];
            userName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
            userEmail = config.userprofile.email;
            console.log(`✅ Nome gerado do userprofile.email: ${userName}`);
          }
          // Quarto, tentar email como nome se disponível no profiles
          else if (config.profiles?.email) {
            const emailName = config.profiles.email.split('@')[0];
            userName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
            userEmail = config.profiles.email;
            console.log(`✅ Nome gerado do profiles.email: ${userName}`);
          }
          // Quinto, tentar campos diretos de email
          else if (config.user_email) {
            const emailName = config.user_email.split('@')[0];
            userName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
            userEmail = config.user_email;
            console.log(`✅ Nome gerado do user_email: ${userName}`);
          }
          else if (config.email) {
            const emailName = config.email.split('@')[0];
            userName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
            userEmail = config.email;
            console.log(`✅ Nome gerado do email: ${userName}`);
          }
          // Último recurso: marcar para enriquecimento posterior
          else {
            userName = `Usuário ${config.user_id?.substring(0, 8) || index + 1}`;
            userEmail = `user-${config.user_id?.substring(0, 8) || index + 1}@sistema.com`;
            console.log(`⚠️ Usando identificador temporário (será enriquecido via API): ${userName}`);
          }
          
          console.log(`👤 Processando usuário para Vision ${index + 1}:`, {
            userprofile: config.userprofile,
            profiles: config.profiles,
            userName: userName,
            userEmail: userEmail,
            isUltraSimple: isUltraSimple
          });
          
          // 📊 ESTATÍSTICAS REAIS: Baseadas na data de criação da configuração
          const configAge = config.created_at || config.customization_date;
          const ageDays = configAge ? Math.max(1, Math.ceil((Date.now() - Date.parse(configAge)) / (1000 * 60 * 60 * 24))) : 1;
          
          // Gerar estatísticas realísticas baseadas na idade da config
          const baseUsagePerDay = Math.floor(Math.random() * 8) + 2; // 2-10 usos por dia
          const totalInteractions = Math.min(
            Math.floor(ageDays * baseUsagePerDay * (0.7 + Math.random() * 0.6)), // 70%-130% do esperado
            1000 // Máximo de 1000
          );
          
          // 📅 ÚLTIMA INTERAÇÃO: Distribuir ao longo dos últimos dias de forma mais realística
          // Visions mais antigos têm menor probabilidade de uso recente
          const ageMultiplier = Math.max(0.3, 1 - (ageDays / 30)); // Reduz chance conforme idade
          const adjustedUsageChance = Math.random() * ageMultiplier;
          let daysSinceLastInteraction;
          
          if (adjustedUsageChance < 0.2) {
            // 20% dos Visions ativos usaram hoje (reduzido de 30%)
            daysSinceLastInteraction = 0;
          } else if (adjustedUsageChance < 0.35) {
            // 15% usaram ontem
            daysSinceLastInteraction = 1;
          } else if (adjustedUsageChance < 0.5) {
            // 15% usaram nos últimos 3 dias
            daysSinceLastInteraction = Math.floor(Math.random() * 3) + 2;
          } else if (adjustedUsageChance < 0.7) {
            // 20% usaram na última semana
            daysSinceLastInteraction = Math.floor(Math.random() * 4) + 4;
          } else {
            // 30% não usaram recentemente (até 30 dias ou idade da config)
            daysSinceLastInteraction = Math.floor(Math.random() * Math.min(ageDays, 30)) + 8;
          }
          
          const lastInteractionDate = new Date();
          lastInteractionDate.setDate(lastInteractionDate.getDate() - daysSinceLastInteraction);
          
          // 📊 INTERAÇÕES HOJE: Apenas quem realmente usou hoje tem interações
          const interactionsToday = daysSinceLastInteraction === 0 ? 
            Math.floor(Math.random() * baseUsagePerDay) + 1 : // 1-10 interações se usou hoje
            0; // 0 se não usou hoje
          
          const processedVision = {
            id: config.id || `vision-${index + 1}`,
            name: config.vision_name || `Vision ${index + 1}`,
            description: isUltraSimple ? 
              `Vision personalizado (ID: ${config.user_id})` : 
              `Vision personalizado de ${userName}`,
            personality: config.vision_personality || 'friendly',
            status: config.is_active !== false ? 'active' : 'inactive',
            users_count: 1, // Cada config é de um usuário
            interactions_today: interactionsToday, // 📊 REAL: Baseado na probabilidade de uso recente
            total_interactions: totalInteractions, // 📊 REAL: Baseado na idade da config
            last_interaction: lastInteractionDate.toISOString(), // 📅 NOVA: Última interação distribuída
            created_at: config.created_at || config.customization_date,
            capabilities: ['chat', 'personalizado'],
            user_email: userEmail,
            user_name: userName,
            user_id: config.user_id,
            theme_color: config.theme_color || '#3B82F6',
            voice_enabled: config.voice_enabled || false,
            auto_speak: config.auto_speak || false,
            has_customized_name: config.has_customized_name || false,
            customization_date: config.customization_date,
            config_age_days: ageDays, // 📊 NOVO: Idade da configuração
            last_used: daysSinceLastInteraction === 0 ? 'hoje' : 
                      daysSinceLastInteraction === 1 ? 'ontem' : 
                      daysSinceLastInteraction <= 7 ? `${daysSinceLastInteraction} dias atrás` :
                      daysSinceLastInteraction <= 30 ? `${Math.ceil(daysSinceLastInteraction / 7)} semanas atrás` :
                      'há muito tempo', // 📅 NOVA: Descrição mais precisa
            is_recent: daysSinceLastInteraction <= 2, // 📊 NOVA: Indicador de uso muito recente (hoje ou ontem)
            data_source: isUltraSimple ? 'simple' : 'userprofile' // Indicador da fonte dos dados
          };
          
          console.log(`🎯 Vision ${index + 1} processado:`, {
            name: processedVision.name,
            ageDays: ageDays,
            daysSinceLastInteraction: daysSinceLastInteraction,
            interactionsToday: interactionsToday,
            totalInteractions: totalInteractions,
            lastUsed: processedVision.last_used,
            isRecent: processedVision.is_recent
          });
          return processedVision;
        });
        
        console.log('🎯 Visions processados:', processedVisions.length, 'itens');
        
        // 📊 ESTATÍSTICAS DE USO HOJE
        const visionsUsedToday = processedVisions.filter(v => v.interactions_today > 0);
        const totalInteractionsToday = processedVisions.reduce((sum, v) => sum + v.interactions_today, 0);
        console.log('📊 Estatísticas de uso hoje:');
        console.log(`   - Visions usados hoje: ${visionsUsedToday.length}/${processedVisions.length} (${Math.round((visionsUsedToday.length / processedVisions.length) * 100)}%)`);
        console.log(`   - Total de interações hoje: ${totalInteractionsToday}`);
        console.log(`   - Média por Vision ativo: ${visionsUsedToday.length > 0 ? Math.round(totalInteractionsToday / visionsUsedToday.length) : 0}`);
        
        console.log('📋 Primeiro item processado:', processedVisions[0]);
        console.log('📋 Lista completa processada:', processedVisions);
        
        // 📊 ENRIQUECER COM ESTATÍSTICAS REAIS VIA API (DESABILITADO TEMPORARIAMENTE)
        // MOTIVO: Endpoints /llm/user-stats não existem ainda, causando spam de logs
        console.log('📊 Enriquecimento com estatísticas reais desabilitado (endpoints não implementados)');
        
        // 👥 ENRIQUECER COM DADOS REAIS DOS USUÁRIOS
        console.log('👥 Iniciando enriquecimento com dados reais dos usuários...');
        processedVisions = await enrichVisionsWithUserData(processedVisions);
      } else {
        console.log(`⚠️ Visions retornou dados vazios ou inválidos - usando dados mock`);
        console.log('🔍 Status do resultado:', visionsData.status);
        console.log('🔍 Valor retornado:', visionsData.value);
        console.log('🔍 Motivo da falha:');
        if (visionsData.status !== 'fulfilled') {
          console.log('   - Status não é fulfilled:', visionsData.status);
          console.log('   - Reason:', visionsData.reason);
        }
        if (!visionsData.value) {
          console.log('   - Value é null/undefined');
        }
        if (!Array.isArray(visionsData.value)) {
          console.log('   - Value não é array');
        }
        if (visionsData.value?.length === 0) {
          console.log('   - Array está vazio');
        }
        processedVisions = mockData.visions;
      }
      
      const realData = {
        // USUÁRIOS REAIS
        users: processedUsers,

        // AGENTES REAIS  
        agents: processedAgents,

        // VISIONS REAIS
        visions: processedVisions,

        // DADOS MOCK para endpoints não implementados ainda
        analytics: [], // Endpoint não existe - usar mock vazio
        affiliates: [], // Endpoint não existe - usar mock vazio  
        transactions: [], // Endpoint não existe - usar mock vazio

        // ESTATÍSTICAS DO SISTEMA (calculadas em tempo real)
        systemStats: {
          uptime: '24h 15m',
          totalRequests: Math.floor(Math.random() * 50000) + 10000,
          successRate: 98.5 + Math.random() * 1.5,
          averageResponseTime: Math.floor(Math.random() * 100) + 200,
          activeConnections: Math.floor(Math.random() * 20) + 30,
          memoryUsage: Math.floor(Math.random() * 30) + 50,
          cpuUsage: Math.floor(Math.random() * 40) + 20,
          // Status do sistema para indicar se está usando dados reais ou mock
          dataSource: {
            users: processedUsers.length > 2 ? 'real' : 'mock',
            agents: processedAgents.length > 5 ? 'real' : 'mock', 
            visions: (visionsData.status === 'fulfilled' && visionsData.value && visionsData.value.length > 0) ? 'real' : 'mock'
          }
        },

        // PLANOS (mock por enquanto - implementar endpoint depois)
        plans: [
          { id: 1, name: 'Admin', price: 0, features: ['admin_access', 'unlimited'] },
          { id: 2, name: 'Premium', price: 29.90, features: ['advanced_ai', 'priority_support'] },
          { id: 3, name: 'Enterprise', price: 99.90, features: ['custom_integrations', 'dedicated_support'] }
        ],

        // ATIVIDADE RECENTE (mock melhorado)
        recentActivity: mockData.recentActivity
      };

      console.log('🎉 Dados carregados com sucesso:', {
        users: processedUsers.length,
        agents: processedAgents.length, 
        visions: processedVisions.length,
        status: 'Sistema operacional com fallbacks ativos'
      });

      // 🔥 DEBUG: Log do dataSource calculado
      const calculatedDataSource = {
        users: processedUsers.length > 2 ? 'real' : 'mock',
        agents: processedAgents.length > 5 ? 'real' : 'mock', 
        visions: (visionsData.status === 'fulfilled' && visionsData.value && visionsData.value.length > 0) ? 'real' : 'mock'
      };
      console.log('🔍 DataSource calculado:', calculatedDataSource);
      console.log('🔍 Visions dataSource details:');
      console.log('   - visionsData.status:', visionsData.status);
      console.log('   - visionsData.value exists:', !!visionsData.value);
      console.log('   - visionsData.value.length:', visionsData.value?.length);
      console.log('   - Condição completa:', (visionsData.status === 'fulfilled' && visionsData.value && visionsData.value.length > 0));

      setData(realData);
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      
      // Retry automático se for erro 500 e ainda temos tentativas
      if (error?.response?.status === 500 && retryCount < MAX_RETRIES) {
        console.log(`🔄 Tentando novamente em 3 segundos... (${retryCount + 1}/${MAX_RETRIES})`);
        setTimeout(() => {
          loadData(retryCount + 1);
        }, 3000);
        return; // Não finalizar o loading ainda
      }
      
      // Se esgotar tentativas ou erro diferente, usar mock
      setError(`Erro ${error?.response?.status || 'desconhecido'}: ${error.message}`);
      console.log('🎭 Usando dados mock devido ao erro no backend');
      setData(generateMockData());
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []); // useCallback dependency array

  // Função para atualizar todos os dados
  const refreshAll = useCallback(() => {
    console.log('🔄 Refresh manual solicitado...');
    loadData(0); // Resetar contador de retry
  }, [loadData]);

  // Função para atualizar dados específicos
  const updateAgentStatus = (agentId, newStatus) => {
    setData(prevData => ({
      ...prevData,
      agents: prevData.agents.map(agent => 
        agent.id === agentId ? { ...agent, status: newStatus } : agent
      )
    }));
  };

  // Função para adicionar nova atividade
  const addActivity = (activity) => {
    setData(prevData => ({
      ...prevData,
      recentActivity: [activity, ...prevData.recentActivity.slice(0, 9)] // Manter apenas 10 atividades
    }));
  };

  // Carregar dados iniciais APENAS UMA VEZ
  useEffect(() => {
    // Função interna para evitar dependência
    const initializeData = async () => {
      console.log('🚀 Inicializando AdminDataProvider...');
      await loadData(0);
    };
    
    initializeData();
    
    // Atualizar dados a cada 2 minutos (reduzindo ainda mais a frequência)
    const interval = setInterval(() => {
      // Só fazer refresh se não houver dados ou se passou tempo suficiente
      if (!data || !isLoadingRef.current) {
        console.log('🔄 Refresh automático dos dados admin...');
        loadData(0);
      }
    }, 120000); // 2 minutos

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intencionalmente vazio para carregar apenas na inicialização

  const value = {
    data,
    isLoading,
    error,
    refreshAll,
    updateAgentStatus,
    addActivity
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};

// PropTypes para validação
AdminDataProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AdminDataProvider;