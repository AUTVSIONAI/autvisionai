import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Eye, 
  Settings, 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Zap,
  GitBranch
} from 'lucide-react';

export default function N8NWorkflowList({ workflows, onSelectWorkflow, onWorkflowAction }) {
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

  const formatExecutionTime = (time) => {
    return `${time}s`;
  };

  const formatLastExecution = (timestamp) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Workflows N8N ({workflows.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Workflow</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Execuções</TableHead>
                <TableHead className="text-gray-300">Taxa Sucesso</TableHead>
                <TableHead className="text-gray-300">Tempo Médio</TableHead>
                <TableHead className="text-gray-300">Última Execução</TableHead>
                <TableHead className="text-gray-300">Versão</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => {
                const StatusIcon = getStatusIcon(workflow.status);
                
                return (
                  <TableRow key={workflow.id} className="border-gray-700 hover:bg-gray-700/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{workflow.name}</p>
                          <p className="text-sm text-gray-400">{workflow.description}</p>
                          <div className="flex gap-1 mt-1">
                            {workflow.tags?.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-gray-500 text-gray-400">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`w-4 h-4 ${
                          workflow.status === 'active' ? 'text-green-400' :
                          workflow.status === 'warning' ? 'text-yellow-400' :
                          workflow.status === 'error' ? 'text-red-400' : 'text-gray-400'
                        }`} />
                        <Badge className={`${getStatusColor(workflow.status)} text-white text-xs`}>
                          {workflow.status}
                        </Badge>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-medium">{workflow.execution_count}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          workflow.success_rate >= 95 ? 'bg-green-400' :
                          workflow.success_rate >= 90 ? 'bg-yellow-400' : 'bg-red-400'
                        }`} />
                        <span className={`font-medium ${
                          workflow.success_rate >= 95 ? 'text-green-400' :
                          workflow.success_rate >= 90 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {workflow.success_rate}%
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{formatExecutionTime(workflow.avg_execution_time)}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <span className="text-gray-400 text-sm">
                        {formatLastExecution(workflow.last_execution)}
                      </span>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline" className="border-gray-500 text-gray-300">
                        v{workflow.version}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSelectWorkflow(workflow)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onWorkflowAction(workflow.id, 'execute')}
                          className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onWorkflowAction(workflow.id, workflow.active ? 'deactivate' : 'activate')}
                          className={`${
                            workflow.active
                              ? 'border-red-600 text-red-400 hover:bg-red-600 hover:text-white'
                              : 'border-green-600 text-green-400 hover:bg-green-600 hover:text-white'
                          }`}
                        >
                          {workflow.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onWorkflowAction(workflow.id, 'settings')}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}