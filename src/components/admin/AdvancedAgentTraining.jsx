// 🤖 ADVANCED AGENT TRAINING - SISTEMA DE TREINAMENTO INTELIGENTE
// Sistema completo para treinar e otimizar agentes da AUTVISION

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Zap, 
  Save, 
  BarChart3,
  Lightbulb,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import VisionLearningService from '@/services/visionLearningService';
import { useSync } from '@/contexts/SyncContext';

export default function AdvancedAgentTraining({ agentId, onClose }) {
  const { globalData, syncModule } = useSync();
  const [agent, setAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personality');
  
  // Configurações de treinamento
  const [personalityConfig, setPersonalityConfig] = useState({
    tone: 'friendly',
    formality: 'casual',
    enthusiasm: 70,
    helpfulness: 85,
    creativity: 60,
    custom_traits: ''
  });
  
  const [skillsConfig, setSkillsConfig] = useState({
    primary_function: '',
    expertise_areas: [],
    response_style: 'detailed',
    problem_solving: 'analytical',
    learning_rate: 'medium'
  });
  
  const [knowledgeConfig, setKnowledgeConfig] = useState({
    knowledge_base: '',
    context_awareness: 80,
    memory_retention: 70,
    fact_checking: true,
    continuous_learning: true
  });
  
  const [performanceMetrics, setPerformanceMetrics] = useState({
    response_accuracy: 0,
    user_satisfaction: 0,
    task_completion: 0,
    learning_progress: 0,
    adaptability_score: 0
  });

  // Carregar dados do agente
  useEffect(() => {
    const loadAgentData = async () => {
      if (!agentId) return;
      
      setIsLoading(true);
      try {
        // Buscar agente
        await syncModule('agents');
        const foundAgent = globalData.agents?.find(a => a.id === agentId);
        setAgent(foundAgent);
        
        // Buscar configuração de treinamento existente
        const existingConfig = await VisionLearningService.getAgentTrainingConfig(agentId);
        if (existingConfig) {
          // Carregar configurações específicas
          if (existingConfig.training_data) {
            const data = existingConfig.training_data;
            if (data.personality) {
              setPersonalityConfig(data.personality);
            }
            if (data.skills) {
              setSkillsConfig(data.skills);
            }
            if (data.knowledge) {
              setKnowledgeConfig(data.knowledge);
            }
          }
          
          if (existingConfig.performance_metrics) {
            setPerformanceMetrics(existingConfig.performance_metrics);
          }
        }
        
      } catch (error) {
        console.error('❌ Erro ao carregar dados do agente:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAgentData();
  }, [agentId, syncModule, globalData.agents]); // Removido dependências desnecessárias

  // Salvar configurações de treinamento
  const handleSaveTraining = async () => {
    if (!agent) return;
    
    setIsSaving(true);
    try {
      const trainingData = {
        personality: personalityConfig,
        skills: skillsConfig,
        knowledge: knowledgeConfig,
        last_updated: new Date().toISOString()
      };
      
      const systemInstructions = generateSystemInstructions();
      const promptTemplate = generatePromptTemplate();
      
      console.log('🚀 Salvando configuração de treinamento:', {
        agent_id: agentId,
        training_data: trainingData,
        system_instructions: systemInstructions,
        prompt_template: promptTemplate
      });
      
      await VisionLearningService.saveAgentTrainingConfig({
        agent_id: agentId,
        training_type: 'complete',
        training_data: trainingData,
        prompt_template: promptTemplate,
        system_instructions: systemInstructions,
        learning_parameters: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 1000,
          context_window: 4000
        },
        performance_metrics: performanceMetrics,
        created_by: 'admin' // TODO: usar user ID real
      });
      
      console.log('✅ Configuração salva com sucesso!');
      alert('✅ Configurações de treinamento salvas com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao salvar treinamento:', error);
      alert(`❌ Erro ao salvar configurações: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Gerar instruções do sistema baseadas nas configurações
  const generateSystemInstructions = () => {
    return `Você é ${agent?.name}, um agente especializado da plataforma AUTVISION.

PERSONALIDADE:
- Tom: ${personalityConfig.tone}
- Formalidade: ${personalityConfig.formality}
- Entusiasmo: ${personalityConfig.enthusiasm}%
- Prestatividade: ${personalityConfig.helpfulness}%
- Criatividade: ${personalityConfig.creativity}%
${personalityConfig.custom_traits ? `- Características especiais: ${personalityConfig.custom_traits}` : ''}

HABILIDADES:
- Função principal: ${skillsConfig.primary_function}
- Áreas de expertise: ${skillsConfig.expertise_areas.join(', ')}
- Estilo de resposta: ${skillsConfig.response_style}
- Resolução de problemas: ${skillsConfig.problem_solving}

CONHECIMENTO:
- Base de conhecimento: ${knowledgeConfig.knowledge_base}
- Consciência contextual: ${knowledgeConfig.context_awareness}%
- Retenção de memória: ${knowledgeConfig.memory_retention}%
- Verificação de fatos: ${knowledgeConfig.fact_checking ? 'Ativa' : 'Desativa'}
- Aprendizado contínuo: ${knowledgeConfig.continuous_learning ? 'Ativo' : 'Desativo'}

INSTRUÇÕES:
- Sempre mantenha sua personalidade consistente
- Use suas habilidades especializadas para ajudar o usuário
- Seja preciso e útil em suas respostas
- Aprenda com cada interação para melhorar continuamente`;
  };

  // Gerar template de prompt
  const generatePromptTemplate = () => {
    return `[CONTEXTO DO AGENTE]
Nome: ${agent?.name}
Função: ${skillsConfig.primary_function}
Personalidade: ${personalityConfig.tone}, ${personalityConfig.formality}

[MENSAGEM DO USUÁRIO]
{user_message}

[INSTRUÇÕES DE RESPOSTA]
- Responda como ${agent?.name}
- Use tom ${personalityConfig.tone}
- Seja ${personalityConfig.formality === 'formal' ? 'formal' : 'casual'}
- Aplicar expertise em: ${skillsConfig.expertise_areas.join(', ')}
- Estilo: ${skillsConfig.response_style}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Carregando dados do agente...</span>
      </div>
    );
  }

  if (!agent) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Agente não encontrado. Verifique se o ID está correto.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {agent.icon || '🤖'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Treinamento Avançado</h2>
            <p className="text-gray-400">{agent.name}</p>
          </div>
        </div>
        <Button onClick={onClose} variant="outline">
          Fechar
        </Button>
      </div>

      {/* Métricas de Performance */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Métricas de Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Precisão das Respostas</Label>
              <Progress value={performanceMetrics.response_accuracy} className="h-2" />
              <span className="text-sm text-gray-400">{performanceMetrics.response_accuracy}%</span>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Satisfação do Usuário</Label>
              <Progress value={performanceMetrics.user_satisfaction} className="h-2" />
              <span className="text-sm text-gray-400">{performanceMetrics.user_satisfaction}%</span>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Conclusão de Tarefas</Label>
              <Progress value={performanceMetrics.task_completion} className="h-2" />
              <span className="text-sm text-gray-400">{performanceMetrics.task_completion}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Abas de Configuração */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
          <TabsTrigger value="personality" className="data-[state=active]:bg-blue-600">
            <Brain className="w-4 h-4 mr-2" />
            Personalidade
          </TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-purple-600">
            <Zap className="w-4 h-4 mr-2" />
            Habilidades
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="data-[state=active]:bg-green-600">
            <Lightbulb className="w-4 h-4 mr-2" />
            Conhecimento
          </TabsTrigger>
        </TabsList>

        {/* Aba Personalidade */}
        <TabsContent value="personality" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Configuração de Personalidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Tom de Voz</Label>
                  <Select value={personalityConfig.tone} onValueChange={(value) => 
                    setPersonalityConfig(prev => ({ ...prev, tone: value }))
                  }>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">Amigável</SelectItem>
                      <SelectItem value="professional">Profissional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="enthusiastic">Entusiasmado</SelectItem>
                      <SelectItem value="calm">Calmo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Nível de Formalidade</Label>
                  <Select value={personalityConfig.formality} onValueChange={(value) => 
                    setPersonalityConfig(prev => ({ ...prev, formality: value }))
                  }>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="semi-formal">Semi-formal</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="very-casual">Muito Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Entusiasmo: {personalityConfig.enthusiasm}%</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={personalityConfig.enthusiasm}
                    onChange={(e) => setPersonalityConfig(prev => ({ ...prev, enthusiasm: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Prestatividade: {personalityConfig.helpfulness}%</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={personalityConfig.helpfulness}
                    onChange={(e) => setPersonalityConfig(prev => ({ ...prev, helpfulness: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Criatividade: {personalityConfig.creativity}%</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={personalityConfig.creativity}
                    onChange={(e) => setPersonalityConfig(prev => ({ ...prev, creativity: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Características Personalizadas</Label>
                <Textarea
                  placeholder="Descreva características especiais que este agente deve ter..."
                  value={personalityConfig.custom_traits}
                  onChange={(e) => setPersonalityConfig(prev => ({ ...prev, custom_traits: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Habilidades */}
        <TabsContent value="skills" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Habilidades e Especializações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Função Principal</Label>
                <Input
                  placeholder="Ex: Assistente de vendas, Suporte técnico, etc."
                  value={skillsConfig.primary_function}
                  onChange={(e) => setSkillsConfig(prev => ({ ...prev, primary_function: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Estilo de Resposta</Label>
                  <Select value={skillsConfig.response_style} onValueChange={(value) => 
                    setSkillsConfig(prev => ({ ...prev, response_style: value }))
                  }>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brief">Breve e direto</SelectItem>
                      <SelectItem value="detailed">Detalhado</SelectItem>
                      <SelectItem value="conversational">Conversacional</SelectItem>
                      <SelectItem value="technical">Técnico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Abordagem de Problemas</Label>
                  <Select value={skillsConfig.problem_solving} onValueChange={(value) => 
                    setSkillsConfig(prev => ({ ...prev, problem_solving: value }))
                  }>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analytical">Analítica</SelectItem>
                      <SelectItem value="creative">Criativa</SelectItem>
                      <SelectItem value="methodical">Metódica</SelectItem>
                      <SelectItem value="intuitive">Intuitiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Conhecimento */}
        <TabsContent value="knowledge" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Base de Conhecimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Base de Conhecimento Específica</Label>
                <Textarea
                  placeholder="Insira conhecimentos específicos que este agente deve ter..."
                  value={knowledgeConfig.knowledge_base}
                  onChange={(e) => setKnowledgeConfig(prev => ({ ...prev, knowledge_base: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white h-32"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Consciência Contextual: {knowledgeConfig.context_awareness}%</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={knowledgeConfig.context_awareness}
                    onChange={(e) => setKnowledgeConfig(prev => ({ ...prev, context_awareness: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Retenção de Memória: {knowledgeConfig.memory_retention}%</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={knowledgeConfig.memory_retention}
                    onChange={(e) => setKnowledgeConfig(prev => ({ ...prev, memory_retention: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={knowledgeConfig.fact_checking}
                    onChange={(e) => setKnowledgeConfig(prev => ({ ...prev, fact_checking: e.target.checked }))}
                    className="rounded border-gray-600"
                  />
                  <span>Verificação de Fatos</span>
                </label>
                
                <label className="flex items-center space-x-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={knowledgeConfig.continuous_learning}
                    onChange={(e) => setKnowledgeConfig(prev => ({ ...prev, continuous_learning: e.target.checked }))}
                    className="rounded border-gray-600"
                  />
                  <span>Aprendizado Contínuo</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botões de Ação */}
      <div className="flex justify-end space-x-4">
        <Button
          onClick={handleSaveTraining}
          disabled={isSaving}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// PropTypes para validação
AdvancedAgentTraining.propTypes = {
  agentId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};
