import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Play, 
  Pause, 
  Settings, 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Zap,
  GitBranch,
  User,
  Calendar,
  Target,
  BarChart3
} from 'lucide-react';

export default function N8NWorkflowDetailsModal({ workflow, isOpen, onClose, onAction }) {
  if (!workflow) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'inactive': return Pause;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      default: return Activity;
    }
  };

  const getNodeIcon = (type) => {
    switch (type) {
      case 'trigger': return Play;
      case 'webhook': return Target;
      case 'function': return Settings;
      case 'database': return Activity;
      case 'email': return User;
      case 'ai': return Zap;
      default: return GitBranch;
    }
  };

  const getNodeColor = (type) => {
    switch (type) {
      case 'trigger': return 'text-green-400';
      case 'webhook': return 'text-blue-400';
      case 'function': return 'text-purple-400';
      case 'database': return 'text-cyan-400';
      case 'email': return 'text-yellow-400';
      case 'ai': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  const StatusIcon = getStatusIcon(workflow.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span>{workflow.name}</span>
              <div className="flex items-center gap-2 mt-1">
                <StatusIcon className={`w-4 h-4 ${
                  workflow.status === 'active' ? 'text-green-400' :
                  workflow.status === 'warning' ? 'text-yellow-400' :
                  workflow.status === 'error' ? 'text-red-400' : 'text-gray-400'
                }`} />
                <Badge className={`${getStatusColor(workflow.status)} text-white text-xs`}>
                  {workflow.status}
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Informações Básicas */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Informações do Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Descrição</p>
                  <p className="text-white">{workflow.description}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Criado por</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <p className="text-white">{workflow.created_by}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Versão</p>
                  <Badge variant="outline" className="border-gray-500 text-gray-300">
                    v{workflow.version}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Última Execução</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-white text-sm">
                      {new Date(workflow.last_execution).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Tags</p>
                <div className="flex gap-2 flex-wrap">
                  {workflow.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-gray-500 text-gray-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Estatísticas de Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Total Execuções</p>
                  <p className="text-2xl font-bold text-white">{workflow.execution_count}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Taxa de Sucesso</p>
                  <p className={`text-2xl font-bold ${
                    workflow.success_rate >= 95 ? 'text-green-400' :
                    workflow.success_rate >= 90 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {workflow.success_rate}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Tempo Médio</p>
                  <p className="text-2xl font-bold text-blue-400">{workflow.avg_execution_time}s</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Conexões</p>
                  <p className="text-2xl font-bold text-purple-400">{workflow.connections}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nodes do Workflow */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                Estrutura do Workflow ({workflow.nodes?.length} nodes)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workflow.nodes?.map((node, index) => {
                  const NodeIcon = getNodeIcon(node.type);
                  const nodeColor = getNodeColor(node.type);
                  
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                      <div className={`w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center`}>
                        <NodeIcon className={`w-5 h-5 ${nodeColor}`} />
                      </div>
                      <div>
                        <p className="text-white font-medium">{node.name}</p>
                        <p className="text-gray-400 text-sm capitalize">{node.type}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex gap-4 pt-4">
            <Button 
              onClick={() => onAction(workflow.id, 'execute')}
              className="bg-blue-600 hover:bg-blue-700 flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              Executar Agora
            </Button>
            
            <Button 
              onClick={() => onAction(workflow.id, workflow.active ? 'deactivate' : 'activate')}
              variant="outline"
              className={`flex-1 ${
                workflow.active
                  ? 'border-red-600 text-red-400 hover:bg-red-600 hover:text-white'
                  : 'border-green-600 text-green-400 hover:bg-green-600 hover:text-white'
              }`}
            >
              {workflow.active ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Desativar
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Ativar
                </>
              )}
            </Button>
            
            <Button 
              onClick={() => onAction(workflow.id, 'settings')}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}