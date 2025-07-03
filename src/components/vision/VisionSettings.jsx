// 🎯 VISION SETTINGS COMPONENT - Configurações do Vision para o usuário
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '@/contexts/AuthContext';
import { VisionPersonalizationService } from '@/services/visionPersonalizationService';
import { Settings, User, Volume2, Palette, Brain, AlertCircle, CheckCircle } from 'lucide-react';

const VisionSettings = ({ isVisible, onClose }) => {
  const { user } = useAuth();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [newName, setNewName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const loadVisionConfig = useCallback(async () => {
    try {
      setLoading(true);
      const visionConfig = await VisionPersonalizationService.getUserVisionConfig(user.id);
      setConfig(visionConfig);
      setNewName(visionConfig.vision_name || '');
    } catch (err) {
      showMessage('Erro ao carregar configurações', 'error');
      console.error('Erro ao carregar config:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isVisible && user) {
      loadVisionConfig();
    }
  }, [isVisible, user, loadVisionConfig]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleChangeName = async () => {
    if (!newName.trim() || newName.trim() === config.vision_name) {
      setShowNameInput(false);
      return;
    }

    try {
      setSaving(true);
      const result = await VisionPersonalizationService.changeVisionName(user.id, newName.trim());
      
      if (result.success) {
        setConfig(prev => ({
          ...prev,
          vision_name: result.new_name,
          has_customized_name: true,
          can_change_name: false
        }));
        showMessage(result.message, 'success');
        setShowNameInput(false);
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage(error.message || 'Erro ao alterar nome', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingUpdate = async (setting, value) => {
    try {
      setSaving(true);
      await VisionPersonalizationService.updateVisionSettings(user.id, {
        [setting]: value
      });
      
      setConfig(prev => ({
        ...prev,
        [setting]: value
      }));
      
      showMessage('Configuração atualizada!', 'success');
    } catch (err) {
      showMessage('Erro ao atualizar configuração', 'error');
      console.error('Erro ao atualizar:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Configurações do Vision</h2>
                <p className="text-blue-100 text-sm">Personalize seu assistente</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-300">Carregando configurações...</p>
            </div>
          ) : (
            <>
              {/* Message */}
              {message && (
                <div className={`p-3 rounded-lg flex items-center gap-2 ${
                  message.type === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span className="text-sm">{message.text}</span>
                </div>
              )}

              {/* Nome do Vision */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-gray-100">Nome do Assistente</h3>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  {!showNameInput ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-100">{config?.vision_name}</p>
                        <p className="text-sm text-gray-300">
                          {config?.can_change_name 
                            ? 'Você pode personalizar o nome uma vez' 
                            : 'Nome já foi personalizado'
                          }
                        </p>
                      </div>
                      {config?.can_change_name && (
                        <button
                          onClick={() => setShowNameInput(true)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          Alterar
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Digite o novo nome"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                        maxLength={50}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleChangeName}
                          disabled={saving || !newName.trim()}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {saving ? 'Salvando...' : 'Confirmar'}
                        </button>
                        <button
                          onClick={() => {
                            setShowNameInput(false);
                            setNewName(config?.vision_name || '');
                          }}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Configurações de Voz */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-gray-100">Configurações de Voz</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <p className="font-medium text-gray-100">Voz Ativada</p>
                      <p className="text-sm text-gray-300">Reproduzir respostas em áudio</p>
                    </div>
                    <button
                      onClick={() => handleSettingUpdate('voice_enabled', !config?.voice_enabled)}
                      disabled={saving}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        config?.voice_enabled ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        config?.voice_enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <p className="font-medium text-gray-100">Falar Automaticamente</p>
                      <p className="text-sm text-gray-300">Falar respostas sem clicar</p>
                    </div>
                    <button
                      onClick={() => handleSettingUpdate('auto_speak', !config?.auto_speak)}
                      disabled={saving}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        config?.auto_speak ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        config?.auto_speak ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Cor do Tema */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-gray-100">Cor do Tema</h3>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {VisionPersonalizationService.getAvailableThemes().map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => handleSettingUpdate('theme_color', theme.value)}
                      disabled={saving}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        config?.theme_color === theme.value
                          ? 'border-blue-400 bg-blue-900/30'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-800'
                      }`}
                    >
                      <div 
                        className="w-8 h-8 rounded-full mx-auto mb-1"
                        style={{ backgroundColor: theme.color }}
                      />
                      <span className="text-xs text-gray-300">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Personalidade */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-gray-100">Personalidade</h3>
                </div>
                
                <select
                  value={config?.vision_personality || ''}
                  onChange={(e) => handleSettingUpdate('vision_personality', e.target.value)}
                  disabled={saving}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                >
                  {VisionPersonalizationService.getAvailablePersonalities().map((personality) => (
                    <option key={personality} value={personality}>
                      {personality}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl">
          <p className="text-xs text-gray-500 text-center">
            💡 Dica: Suas configurações são salvas automaticamente
          </p>
        </div>
      </div>
    </div>
  );
};

// PropTypes
VisionSettings.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default VisionSettings;
