import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, Zap, Clock, Globe, Wifi } from "lucide-react";
import { motion } from "framer-motion";

export default function RealTimeMetrics() {
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 45,
    currentSessions: 32,
    activeAgents: 8,
    responseTime: 234,
    requests: 1247,
    errors: 3
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Simular atualizações em tempo real
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 6) - 3,
        currentSessions: prev.currentSessions + Math.floor(Math.random() * 4) - 2,
        activeAgents: Math.max(1, prev.activeAgents + Math.floor(Math.random() * 3) - 1),
        responseTime: Math.max(100, prev.responseTime + Math.floor(Math.random() * 100) - 50),
        requests: prev.requests + Math.floor(Math.random() * 10),
        errors: Math.max(0, prev.errors + Math.floor(Math.random() * 2) - 1)
      }));

      // Adicionar nova atividade
      const activities = [
        "Novo usuário se conectou",
        "Agente Financeiro executado",
        "Rotina de backup concluída",
        "Integração WhatsApp sincronizada",
        "Pagamento processado",
        "Vision companion ativado"
      ];

      setRecentActivity(prev => [
        {
          id: Date.now(),
          message: activities[Math.floor(Math.random() * activities.length)],
          timestamp: new Date(),
          type: Math.random() > 0.8 ? 'error' : 'success'
        },
        ...prev.slice(0, 9)
      ]);
    }, 60000); // Atualizações a cada 60 segundos ao invés de 3 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <motion.div
          key={realTimeData.activeUsers}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Usuários Online</p>
                  <p className="text-2xl font-bold text-green-400">{realTimeData.activeUsers}</p>
                </div>
                <div className="relative">
                  <Users className="w-6 h-6 text-green-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          key={realTimeData.currentSessions}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Sessões Ativas</p>
                  <p className="text-2xl font-bold text-blue-400">{realTimeData.currentSessions}</p>
                </div>
                <Wifi className="w-6 h-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          key={realTimeData.activeAgents}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Agentes Ativos</p>
                  <p className="text-2xl font-bold text-purple-400">{realTimeData.activeAgents}</p>
                </div>
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          key={realTimeData.responseTime}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Resposta Média</p>
                  <p className="text-2xl font-bold text-yellow-400">{realTimeData.responseTime}ms</p>
                </div>
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          key={realTimeData.requests}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Requisições</p>
                  <p className="text-2xl font-bold text-cyan-400">{realTimeData.requests}</p>
                </div>
                <Globe className="w-6 h-6 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          key={realTimeData.errors}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Erros</p>
                  <p className="text-2xl font-bold text-red-400">{realTimeData.errors}</p>
                </div>
                <Activity className="w-6 h-6 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Atividade em Tempo Real
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-2"></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentActivity.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'error' ? 'bg-red-400' : 'bg-green-400'
                    }`}></div>
                    <span className="text-gray-300">{activity.message}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {activity.timestamp.toLocaleTimeString()}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Status dos Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">API Principal</span>
                <Badge className="bg-green-500">Operacional</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Base de Dados</span>
                <Badge className="bg-green-500">Operacional</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Sistema de Pagamentos</span>
                <Badge className="bg-green-500">Operacional</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Integrações</span>
                <Badge className="bg-yellow-500">Parcial</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">CDN</span>
                <Badge className="bg-green-500">Operacional</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Sistema de Email</span>
                <Badge className="bg-green-500">Operacional</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}