import React, { useState, useEffect } from 'react';
import { SystemConfig, LLM, Command, N8N, OVOS, VisionSupremo } from '../api/entities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Activity } from 'lucide-react';

const StatusPage = () => {
  const [status, setStatus] = useState({
    backend: null,
    health: null,
    config: null,
    llm: null,
    lastUpdate: null,
    isLoading: false
  });

  const checkSystemStatus = async () => {
    setStatus(prev => ({ ...prev, isLoading: true }));
    const results = {};

    try {
      // Test backend connectivity
      console.log('🔍 Testando conectividade do backend...');
      
      // Health check básico
      try {
        const healthResponse = await fetch('http://localhost:3001/health');
        results.health = {
          status: healthResponse.ok ? 'healthy' : 'error',
          data: healthResponse.ok ? await healthResponse.json() : null,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        results.health = {
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }

      // System config
      try {
        const configData = await SystemConfig.getHealth();
        results.config = {
          status: configData.success ? 'healthy' : 'warning',
          data: configData.data || configData,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        results.config = {
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }

      // LLM status
      try {
        const llmStats = await LLM.getStats();
        results.llm = {
          status: llmStats.success ? 'healthy' : 'warning',
          data: llmStats.data || llmStats,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        results.llm = {
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }

      // Backend overall status
      const healthyServices = Object.values(results).filter(r => r.status === 'healthy').length;
      const totalServices = Object.keys(results).length;
      
      results.backend = {
        status: healthyServices === totalServices ? 'healthy' : 
                healthyServices > 0 ? 'warning' : 'error',
        healthy: healthyServices,
        total: totalServices,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Erro ao verificar status:', error);
      results.backend = {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }

    setStatus({
      ...results,
      lastUpdate: new Date().toISOString(),
      isLoading: false
    });
  };

  useEffect(() => {
    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🚀 AUTVISION Status Monitor
          </h1>
          <p className="text-gray-300">
            Monitoramento em tempo real da conectividade Frontend ↔ Backend
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Button 
              onClick={checkSystemStatus} 
              disabled={status.isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {status.isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Atualizar Status
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                {getStatusIcon(status.backend?.status)}
                <span className="ml-2">Backend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(status.backend?.status)}>
                  {status.backend?.status || 'checking...'}
                </Badge>
                {status.backend && (
                  <span className="text-sm text-gray-400">
                    {status.backend.healthy}/{status.backend.total}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                {getStatusIcon(status.health?.status)}
                <span className="ml-2">Health</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={getStatusColor(status.health?.status)}>
                {status.health?.status || 'checking...'}
              </Badge>
              {status.health?.data?.uptime && (
                <p className="text-xs text-gray-400 mt-1">
                  Uptime: {Math.floor(status.health.data.uptime)}s
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                {getStatusIcon(status.config?.status)}
                <span className="ml-2">Config</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={getStatusColor(status.config?.status)}>
                {status.config?.status || 'checking...'}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                {getStatusIcon(status.llm?.status)}
                <span className="ml-2">LLM</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={getStatusColor(status.llm?.status)}>
                {status.llm?.status || 'checking...'}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Backend Details */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Backend Details</CardTitle>
              <CardDescription className="text-gray-400">
                Status detalhado dos serviços do backend
              </CardDescription>
            </CardHeader>
            <CardContent className="text-white">
              {status.health?.data ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-green-400">{status.health.data.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span>{Math.floor(status.health.data.uptime || 0)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory:</span>
                    <span>{Math.round((status.health.data.memory?.used || 0) / 1024 / 1024)}MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Timestamp:</span>
                    <span className="text-xs">{new Date(status.health.data.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ) : (
                <p className="text-red-400">
                  {status.health?.error || 'Sem conexão com o backend'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Configuration Details */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Configuration</CardTitle>
              <CardDescription className="text-gray-400">
                Status dos serviços e configurações
              </CardDescription>
            </CardHeader>
            <CardContent className="text-white">
              {status.config?.data ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Backend:</span>
                    <span className="text-green-400">{status.config.data.backend?.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supabase:</span>
                    <span className={status.config.data.supabase?.connected ? 'text-green-400' : 'text-red-400'}>
                      {status.config.data.supabase?.connected ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>OpenRouter:</span>
                    <span className="text-yellow-400">
                      {status.config.data.openrouter?.status || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>N8N:</span>
                    <span className="text-gray-400">
                      {status.config.data.n8n?.connected ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-red-400">
                  {status.config?.error || 'Erro ao carregar configurações'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Last Update */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          {status.lastUpdate && (
            <p>Última atualização: {new Date(status.lastUpdate).toLocaleString()}</p>
          )}
        </div>

        {/* Instructions */}
        <Card className="mt-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">🔧 Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <div className="space-y-2">
              <p><strong>❌ Backend não conecta:</strong></p>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Verifique se o backend está rodando: <code className="bg-gray-700 px-2 py-1 rounded">cd autvisionai-backend && npm start</code></li>
                <li>Confirme que a porta 3001 está livre</li>
                <li>Verifique o arquivo .env no backend</li>
              </ul>
              
              <p className="mt-4"><strong>⚠️ Serviços externos falham:</strong></p>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Supabase: Confirme URL e chaves no .env</li>
                <li>OpenRouter: Adicione chaves válidas de LLM</li>
                <li>N8N: Inicie o serviço na porta 5678</li>
                <li>OVOS: Inicie o serviço na porta 8181</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatusPage;
