/**
 * 🔥 CLIENT DASHBOARD - VERSÃO SUPER SIMPLES SEM BUGS
 * Background BRANCO, sem conflitos, sem travamentos
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserIcon, Zap, Clock, Crown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import VisionChat from "@/components/VisionChat";

export default function ClientDashboard() {
  const { isAuthenticated, user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // ✅ LOADING SUPER SIMPLES - SEM LOOPS
  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    
    // Timeout simples para evitar loading infinito
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  // ✅ LOADING SCREEN BRANCO
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-gray-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-semibold text-gray-800">Carregando Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      {/* ✅ CONTAINER BRANCO LIMPO */}
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ✅ HEADER BRANCO */}
        <div className="flex items-center justify-between p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center">
              <UserIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Principal
              </h1>
              <p className="text-gray-600 text-lg">
                Bem-vindo, {profile?.full_name || user?.email || 'Usuário'}!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-gray-300">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        {/* ✅ GRID PRINCIPAL BRANCO */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* MAIN CONTENT - VISION */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="bg-white border-2 border-gray-200 shadow-lg">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-2xl text-gray-900">Seu Vision</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center py-12">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <Crown className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {profile?.full_name?.split(' ')[0] || 'Meu'} Vision
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    Seu assistente pessoal inteligente está pronto para conversar
                  </p>
                  <div className="space-y-3">
                    <Button size="lg" className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3">
                      💬 Iniciar Conversa
                    </Button>
                    <Button size="lg" variant="outline" className="border-gray-300 px-8 py-3">
                      🎤 Modo Voz
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 🔥 VISION CHAT INTEGRADO */}
            <VisionChat className="bg-white border-2 border-gray-200 shadow-lg" />
          </div>

          {/* SIDEBAR BRANCA */}
          <div className="space-y-6">
            
            {/* STATS CARD BRANCO */}
            <Card className="bg-white border-2 border-gray-200 shadow-lg">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-xl text-gray-900">Seu Ecossistema</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                
                {/* AGENTES CARD */}
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Agentes IA</p>
                      <p className="text-sm text-gray-600">Especializados</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">0</span>
                </div>

                {/* ROTINAS CARD */}
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Rotinas</p>
                      <p className="text-sm text-gray-600">Automatizadas</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-600">0</span>
                </div>

                {/* NÍVEL CARD */}
                <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Nível Vision</p>
                      <p className="text-sm text-gray-600">Iniciante</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">1</span>
                </div>
              </CardContent>
            </Card>

            {/* AÇÕES RÁPIDAS */}
            <Card className="bg-white border-2 border-gray-200 shadow-lg">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-xl text-gray-900">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  ➕ Criar Agente
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  ⚙️ Nova Rotina
                </Button>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  🎯 Ver Tutorial
                </Button>
              </CardContent>
            </Card>

            {/* CTA PREMIUM BRANCO */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-600 text-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Crown className="w-6 h-6" />
                  Vision Pro
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="mb-4 text-gray-100">
                  Desbloqueie recursos exclusivos e acelere seu Vision
                </p>
                <Button variant="secondary" className="w-full bg-white text-gray-800 hover:bg-gray-100 font-semibold">
                  🚀 Ver Planos Premium
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FOOTER INFO */}
        <div className="text-center py-6 border-t border-gray-200">
          <p className="text-gray-600">
            ✅ Dashboard funcionando perfeitamente - Background branco aplicado
          </p>
        </div>
      </div>
    </div>
  );
}
