import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play, 
  RefreshCw,
  Database,
  Server,
  Wifi,
  Activity
} from 'lucide-react';

const TestPage = () => {
  const [tests, setTests] = useState([
    {
      id: 1,
      name: 'API Connection Test',
      description: 'Testa a conexão com a API backend',
      status: 'idle',
      result: null,
      duration: null
    },
    {
      id: 2,
      name: 'Database Connection',
      description: 'Verifica a conectividade com o banco de dados',
      status: 'idle',
      result: null,
      duration: null
    },
    {
      id: 3,
      name: 'Authentication Test',
      description: 'Testa o sistema de autenticação',
      status: 'idle',
      result: null,
      duration: null
    },
    {
      id: 4,
      name: 'Component Rendering',
      description: 'Verifica se os componentes estão renderizando corretamente',
      status: 'idle',
      result: null,
      duration: null
    }
  ]);

  const [isRunningAll, setIsRunningAll] = useState(false);

  const runTest = async (testId) => {
    setTests(prev => prev.map(test => 
      test.id === testId 
        ? { ...test, status: 'running', result: null, duration: null }
        : test
    ));

    const startTime = Date.now();
    
    // Simula execução do teste
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    
    const duration = Date.now() - startTime;
    const success = Math.random() > 0.3; // 70% de chance de sucesso

    setTests(prev => prev.map(test => 
      test.id === testId 
        ? { 
            ...test, 
            status: 'completed', 
            result: success ? 'success' : 'error',
            duration: duration
          }
        : test
    ));
  };

  const runAllTests = async () => {
    setIsRunningAll(true);
    
    for (const test of tests) {
      await runTest(test.id);
      await new Promise(resolve => setTimeout(resolve, 500)); // Pausa entre testes
    }
    
    setIsRunningAll(false);
  };

  const resetTests = () => {
    setTests(prev => prev.map(test => ({
      ...test,
      status: 'idle',
      result: null,
      duration: null
    })));
  };

  const getStatusIcon = (status, result) => {
    if (status === 'running') return <RefreshCw className="h-4 w-4 animate-spin" />;
    if (status === 'completed') {
      return result === 'success' 
        ? <CheckCircle className="h-4 w-4 text-green-500" />
        : <XCircle className="h-4 w-4 text-red-500" />;
    }
    return <Clock className="h-4 w-4 text-gray-400" />;
  };

  const getStatusBadge = (status, result) => {
    if (status === 'running') {
      return <Badge variant="secondary">Executando...</Badge>;
    }
    if (status === 'completed') {
      return result === 'success' 
        ? <Badge variant="default" className="bg-green-500">Sucesso</Badge>
        : <Badge variant="destructive">Falhou</Badge>;
    }
    return <Badge variant="outline">Aguardando</Badge>;
  };

  const completedTests = tests.filter(test => test.status === 'completed');
  const successfulTests = tests.filter(test => test.result === 'success');
  const failedTests = tests.filter(test => test.result === 'error');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <TestTube className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Página de Testes</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Execute testes para verificar o funcionamento dos componentes e serviços
          </p>
        </motion.div>

        {/* Estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Total de Testes</p>
                  <p className="text-2xl font-bold text-white">{tests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Sucessos</p>
                  <p className="text-2xl font-bold text-green-400">{successfulTests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-400" />
                <div>
                  <p className="text-sm text-gray-400">Falhas</p>
                  <p className="text-2xl font-bold text-red-400">{failedTests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-400">Completados</p>
                  <p className="text-2xl font-bold text-yellow-400">{completedTests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Controles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 justify-center"
        >
          <Button 
            onClick={runAllTests}
            disabled={isRunningAll}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRunningAll ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isRunningAll ? 'Executando...' : 'Executar Todos'}
          </Button>
          
          <Button 
            onClick={resetTests}
            variant="outline"
            disabled={isRunningAll}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Resetar
          </Button>
        </motion.div>

        {/* Lista de Testes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid gap-4"
        >
          {tests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status, test.result)}
                      <div>
                        <CardTitle className="text-white text-lg">{test.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {test.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {test.duration && (
                        <span className="text-sm text-gray-400">
                          {test.duration}ms
                        </span>
                      )}
                      {getStatusBadge(test.status, test.result)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      ID: {test.id}
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => runTest(test.id)}
                      disabled={test.status === 'running' || isRunningAll}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      {test.status === 'running' ? (
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Play className="h-3 w-3 mr-1" />
                      )}
                      {test.status === 'running' ? 'Executando' : 'Executar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Informações do Sistema */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Server className="h-5 w-5" />
                Informações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Database className="h-4 w-4 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Ambiente</p>
                    <p className="text-white font-medium">Desenvolvimento</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Wifi className="h-4 w-4 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Status da API</p>
                    <p className="text-green-400 font-medium">Online</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-400">Última Atualização</p>
                    <p className="text-white font-medium">{new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TestPage;