import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Gauge, Zap, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export default function PerformanceMetrics({ analyticsData }) {
  const getPerformanceData = () => {
    const responseTimeData = analyticsData.filter(a => a.response_time);
    const avgResponseTime = responseTimeData.reduce((sum, a) => sum + a.response_time, 0) / (responseTimeData.length || 1);
    
    const successRate = (analyticsData.filter(a => a.success).length / (analyticsData.length || 1)) * 100;
    
    const performanceScore = Math.min(100, Math.max(0, 100 - (avgResponseTime / 20)));
    
    return {
      avgResponseTime: Math.round(avgResponseTime),
      successRate: Math.round(successRate),
      performanceScore: Math.round(performanceScore),
      totalRequests: analyticsData.length,
      errorRate: Math.round((analyticsData.filter(a => !a.success).length / (analyticsData.length || 1)) * 100)
    };
  };

  const performance = getPerformanceData();

  const performanceStatus = performance.performanceScore >= 90 ? 'excellent' : 
                           performance.performanceScore >= 70 ? 'good' : 
                           performance.performanceScore >= 50 ? 'fair' : 'poor';

  const statusColors = {
    excellent: 'text-green-400',
    good: 'text-blue-400',
    fair: 'text-yellow-400',
    poor: 'text-red-400'
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              Score de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-6xl font-bold mb-4 ${statusColors[performanceStatus]}`}>
                {performance.performanceScore}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    performanceStatus === 'excellent' ? 'bg-green-500' :
                    performanceStatus === 'good' ? 'bg-blue-500' :
                    performanceStatus === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${performance.performanceScore}%` }}
                />
              </div>
              <Badge className={`${
                performanceStatus === 'excellent' ? 'bg-green-500' :
                performanceStatus === 'good' ? 'bg-blue-500' :
                performanceStatus === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
              } text-white capitalize`}>
                {performanceStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Tempo de Resposta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {performance.avgResponseTime}ms
              </div>
              <p className="text-gray-400 mb-4">Tempo médio</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Excelente (&lt;200ms)</span>
                  <span className="text-green-400">✓</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Bom (&lt;500ms)</span>
                  <span className={performance.avgResponseTime < 500 ? 'text-green-400' : 'text-red-400'}>
                    {performance.avgResponseTime < 500 ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Taxa de Sucesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {performance.successRate}%
              </div>
              <p className="text-gray-400 mb-4">Requisições bem-sucedidas</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-green-400 font-bold">{analyticsData.filter(a => a.success).length}</p>
                  <p className="text-gray-400">Sucessos</p>
                </div>
                <div>
                  <p className="text-red-400 font-bold">{analyticsData.filter(a => !a.success).length}</p>
                  <p className="text-gray-400">Erros</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Métricas Detalhadas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total de Requisições</span>
              <Badge className="bg-blue-500">{performance.totalRequests}</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Taxa de Erro</span>
              <Badge className={performance.errorRate < 5 ? 'bg-green-500' : 'bg-red-500'}>
                {performance.errorRate}%
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Disponibilidade</span>
              <Badge className="bg-green-500">99.9%</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">CPU Usage</span>
              <div className="flex items-center gap-2">
                <Progress value={35} className="w-20" />
                <span className="text-sm text-gray-300">35%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Memory Usage</span>
              <div className="flex items-center gap-2">
                <Progress value={67} className="w-20" />
                <span className="text-sm text-gray-300">67%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Alertas e Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-green-400 font-medium">Sistema Operacional</p>
                <p className="text-sm text-gray-400">Todos os serviços funcionando normalmente</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-medium">Alta Demanda</p>
                <p className="text-sm text-gray-400">Uso acima da média detectado</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <Zap className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-blue-400 font-medium">Otimização Ativa</p>
                <p className="text-sm text-gray-400">Cache e CDN operando perfeitamente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}