// 👥 VISION MANAGEMENT ADMIN - Lista todos os Visions personalizados dos usuários
import { useState, useEffect } from 'react';
import { useAdminData } from './AdminDataContext'; // 🔥 USANDO DADOS DO CONTEXTO
import { VisionPersonalizationService } from '@/services/visionPersonalizationService';
import { Users, User, Calendar, Eye, BarChart, Settings, Palette, Activity, TrendingUp, Clock } from 'lucide-react';

const VisionManagement = () => {
  const { data: adminData } = useAdminData(); // 🔥 USAR DADOS CENTRALIZADOS
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  // Usar dados do contexto admin ao invés de carregar independentemente
  const visionConfigs = adminData?.visions || [];

  // 🐛 DEBUG: Log dos dados recebidos
  useEffect(() => {
    if (adminData?.visions) {
      console.log('🔍 VisionManagement - Dados recebidos do AdminDataContext:');
      console.log('📊 Total de Visions:', adminData.visions.length);
      console.log('📋 Primeiro Vision:', adminData.visions[0]);
      console.log('📈 SystemStats.dataSource:', adminData.systemStats?.dataSource);
    } else {
      console.log('⚠️ VisionManagement - Nenhum dado de Vision recebido ainda');
    }
  }, [adminData]);

  useEffect(() => {
    const loadAdditionalStats = async () => {
      try {
        setLoading(true);
        // Calcular estatísticas baseadas nos dados do AdminDataContext
        if (adminData?.visions) {
          const configs = adminData.visions;
          const totalVisions = configs.length;
          const customizedNames = configs.filter(v => v.has_customized_name).length;
          const customizationRate = totalVisions > 0 ? Math.round((customizedNames / totalVisions) * 100) : 0;
          const recentCustomizations = configs.filter(v => {
            if (!v.customization_date) return false;
            const date = new Date(v.customization_date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return date > weekAgo;
          }).length;
          
          setStats({
            total_users: adminData.users?.length || 0,
            customized_names: customizedNames,
            customization_rate: customizationRate,
            recent_customizations: recentCustomizations
          });
        }
      } catch (error) {
        console.error('Erro ao calcular estatísticas dos Visions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAdditionalStats();
  }, [adminData]); // Depender dos dados do admin

  const getThemeColor = (themeColor) => {
    const themes = VisionPersonalizationService.getAvailableThemes();
    const theme = themes.find(t => t.value === themeColor);
    return theme?.color || '#3B82F6';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Não personalizado';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border-gray-700 rounded-xl shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-600 rounded w-1/4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-600 rounded"></div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8" />
              <div>
                <p className="text-blue-100 text-sm">Total de Usuários</p>
                <p className="text-2xl font-bold">{stats.total_users}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8" />
              <div>
                <p className="text-green-100 text-sm">Nomes Personalizados</p>
                <p className="text-2xl font-bold">{stats.customized_names}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <BarChart className="w-8 h-8" />
              <div>
                <p className="text-purple-100 text-sm">Taxa de Personalização</p>
                <p className="text-2xl font-bold">{stats.customization_rate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8" />
              <div>
                <p className="text-orange-100 text-sm">Esta Semana</p>
                <p className="text-2xl font-bold">{stats.recent_customizations}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Visions */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-gray-700 rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-white">Visions Personalizados</h2>
                <p className="text-gray-300">Lista de todos os assistentes personalizados pelos usuários</p>
              </div>
            </div>
            
            {/* Indicador de fonte dos dados */}
            {adminData?.systemStats?.dataSource?.visions && (
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                adminData.systemStats.dataSource.visions === 'real' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {adminData.systemStats.dataSource.visions === 'real' 
                  ? '📊 Dados Reais' 
                  : '🎭 Dados Mock'}
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {visionConfigs.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400">Nenhum Vision personalizado encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {visionConfigs.map((config) => (
                <div key={config.id} className="border border-gray-600 bg-gray-700/30 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Avatar do usuário */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {config.user_name?.[0] || config.user_email?.[0] || 'U'}
                      </div>

                      {/* Info do usuário e Vision */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white text-lg">
                            {config.name || config.vision_name || `Vision ${config.id}`}
                          </h3>
                          {config.status === 'active' ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              🟢 Ativo
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                              🔴 Inativo
                            </span>
                          )}
                          {config.is_recent && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              🔥 Recente
                            </span>
                          )}
                          {config.has_customized_name && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              ✨ Personalizado
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-300">Proprietário:</span>
                          <span className={`font-medium ${
                            config.user_source === 'api' ? 'text-white' : 'text-gray-400 italic'
                          }`}>
                            {config.user_source === 'api' 
                              ? config.user_name 
                              : (config.user_name?.startsWith('Usuário ') 
                                ? `${config.user_name} (carregando...)` 
                                : config.user_name || `Usuário ${config.user_id}`)}
                          </span>
                          {config.user_email && config.user_name && config.user_source === 'api' && (
                            <span className="text-gray-400 text-xs">({config.user_email})</span>
                          )}
                          {config.user_source && (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              config.user_source === 'api' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {config.user_source === 'api' ? '👤 Real' : '⏳ Carregando'}
                            </span>
                          )}
                          {config.data_source && (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              config.data_source === 'real' || config.data_source === 'simple' || config.data_source === 'userprofile' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {config.data_source === 'simple' ? '📊 Real' : 
                               config.data_source === 'userprofile' ? '📊 Completo' : 
                               config.data_source || '🎭 Mock'}
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Activity className="w-4 h-4 text-blue-400" />
                              <span className="text-gray-300">Hoje:</span>
                              <span className="font-medium text-white">{config.interactions_today || 0}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4 text-green-400" />
                              <span className="text-gray-300">Total:</span>
                              <span className="font-medium text-white">{config.total_interactions || 0}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-yellow-400" />
                              <span className="text-gray-300">Último uso:</span>
                              <span className="font-medium text-white">{config.last_used || 'N/A'}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Palette className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300">Tema:</span>
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: getThemeColor(config.theme_color) }}
                            />
                            <span className="text-sm capitalize text-white">{config.theme_color || 'Padrão'}</span>
                          </div>
                          
                          <p className="text-sm text-gray-300">
                            <strong className="text-white">Personalidade:</strong> {config.personality || config.vision_personality || 'Friendly'}
                          </p>
                          
                          <div className="flex gap-4 text-xs text-gray-400">
                            <span>Voz: {config.voice_enabled ? '✅' : '❌'}</span>
                            <span>Auto-fala: {config.auto_speak ? '✅' : '❌'}</span>
                            <span>Status: {config.status === 'active' ? '🟢 Ativo' : '🔴 Inativo'}</span>
                          </div>
                          
                          {/* Estatísticas de Interações */}
                          <div className="flex gap-4 text-xs mt-2">
                            <div className="flex items-center gap-1 text-blue-400">
                              <BarChart className="w-3 h-3" />
                              <span>Hoje: {config.interactions_today || 0}</span>
                            </div>
                            <div className="flex items-center gap-1 text-purple-400">
                              <Eye className="w-3 h-3" />
                              <span>Total: {config.total_interactions || 0}</span>
                            </div>
                            {config.last_used && (
                              <div className="flex items-center gap-1 text-green-400">
                                <Calendar className="w-3 h-3" />
                                <span>Último uso: {config.last_used}</span>
                              </div>
                            )}
                          </div>
                          
                          {config.description && (
                            <p className="text-sm text-gray-300 italic">
                              {config.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Data de personalização */}
                    <div className="text-right text-sm text-gray-400">
                      <div className="flex items-center gap-1 justify-end">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {config.last_used ? `Usado ${config.last_used}` : 'Criado em:'}
                        </span>
                      </div>
                      <p className="font-medium mt-1">
                        {config.last_used ? 
                          formatDate(config.last_interaction || config.customization_date || config.created_at) :
                          formatDate(config.customization_date || config.created_at)
                        }
                      </p>
                      {config.is_recent && (
                        <div className="mt-1">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            🔥 Ativo
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botões de ação */}
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedUser(config)}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-900/30 text-blue-400 rounded-lg hover:bg-blue-900/50 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Ver detalhes
                      </button>
                      
                      <button
                        className="flex items-center gap-2 px-3 py-1 bg-green-900/30 text-green-400 rounded-lg hover:bg-green-900/50 transition-colors text-sm"
                        title="Editar Vision"
                      >
                        <Settings className="w-4 h-4" />
                        Editar
                      </button>
                      
                      {adminData?.systemStats?.dataSource?.visions === 'real' && (
                        <button
                          className="flex items-center gap-2 px-3 py-1 bg-orange-900/30 text-orange-400 rounded-lg hover:bg-orange-900/50 transition-colors text-sm"
                          title="Estatísticas"
                        >
                          <BarChart className="w-4 h-4" />
                          Stats
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalhes do usuário */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-600">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Detalhes do Vision</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-300 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Usuário:</label>
                <p className="text-white">{selectedUser.user_name || selectedUser.user_email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300">Nome do Vision:</label>
                <p className="text-white font-medium">{selectedUser.name || selectedUser.vision_name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300">Personalidade:</label>
                <p className="text-white">{selectedUser.personality || selectedUser.vision_personality}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Voz Ativada:</label>
                  <p className="text-white">{selectedUser.voice_enabled ? 'Sim' : 'Não'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Auto-fala:</label>
                  <p className="text-white">{selectedUser.auto_speak ? 'Sim' : 'Não'}</p>
                </div>
              </div>
              
              {/* Estatísticas de Uso */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Estatísticas de Uso</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-400">Interações Hoje:</label>
                    <p className="text-lg font-bold text-blue-400">{selectedUser.interactions_today || 0}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400">Total de Interações:</label>
                    <p className="text-lg font-bold text-purple-400">{selectedUser.total_interactions || 0}</p>
                  </div>
                  {selectedUser.last_used && (
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-gray-400">Último Uso:</label>
                      <p className="text-sm text-white">{selectedUser.last_used}</p>
                    </div>
                  )}
                </div>
                {selectedUser.is_recent && (
                  <div className="mt-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      🔥 Vision Ativo - Usado Recentemente
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300">Cor do Tema:</label>
                <div className="flex items-center gap-2 mt-1">
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: getThemeColor(selectedUser.theme_color) }}
                  />
                  <span className="capitalize text-white">{selectedUser.theme_color}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300">Data de Personalização:</label>
                <p className="text-white">{formatDate(selectedUser.customization_date)}</p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-600">
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisionManagement;
