import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft,
  FileText,
  Scale,
  Shield,
  AlertTriangle,
  CheckCircle,
  Crown,
  Globe,
  Clock,
  Users
} from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">

      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl("LandingPage")} className="flex items-center gap-3">
            {/* Imagem removida: URL herdada da Base44/Supabase. Substitua por asset local ou nova URL. */}
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AutVision
            </span>
          </Link>

          <Link to={createPageUrl("LandingPage")}>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center">
              <Scale className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Termos de Serviço
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6">
            Regras claras e justas para usar nossa plataforma de automação revolucionária.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              Termos Justos
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Globe className="w-3 h-3 mr-1" />
              Lei Brasileira
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Clock className="w-3 h-3 mr-1" />
              Vigência: Janeiro 2024
            </Badge>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="space-y-8">

          {/* Seção 1 */}
          <Card className="bg-gray-900/90 border border-gray-700/50 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-400" />
                1. Aceitação dos Termos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                Ao acessar e usar a plataforma AutVision, você concorda integralmente com estes Termos de Serviço.
                Se não concordar com qualquer parte, não utilize nossos serviços.
              </p>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">📋 O que isso significa:</h4>
                <ul className="text-sm space-y-1 text-gray-300">
                  <li>• Estes termos são um contrato legal entre você e a AutVision</li>
                  <li>• Ao criar uma conta, você aceita automaticamente estes termos</li>
                  <li>• Podemos atualizar estes termos ocasionalmente com aviso prévio</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Seção 2 */}
          <Card className="bg-gray-900/90 border border-gray-700/50 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Crown className="w-6 h-6 text-yellow-400" />
                2. Descrição do Serviço
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                A AutVision fornece uma plataforma de automação inteligente que inclui:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3 bg-gray-800/50 p-4 rounded-lg border border-gray-700/30">
                  <h4 className="font-semibold text-white">🤖 Recursos Principais:</h4>
                  <ul className="text-sm space-y-1 text-gray-300">
                    <li>• Agentes de IA personalizáveis</li>
                    <li>• Rotinas de automação inteligente</li>
                    <li>• Integrações com serviços externos</li>
                    <li>• Dashboard de analytics avançado</li>
                    <li>• Vision companions interativos</li>
                  </ul>
                </div>

                <div className="space-y-3 bg-gray-800/50 p-4 rounded-lg border border-gray-700/30">
                  <h4 className="font-semibold text-white">💼 Modalidades de Uso:</h4>
                  <ul className="text-sm space-y-1 text-gray-300">
                    <li>• Uso pessoal (indivíduos)</li>
                    <li>• Uso empresarial (WhatsApp Business)</li>
                    <li>• Integrações de terceiros</li>
                    <li>• APIs para desenvolvedores</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-yellow-400 mb-2">⚠️ Importante:</h4>
                <p className="text-sm text-gray-300">
                  Nossos serviços estão em constante evolução. Novos recursos podem ser adicionados e
                  alguns podem ser descontinuados com aviso prévio de 30 dias.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Seção 3 */}
          <Card className="bg-gray-900/90 border border-gray-700/50 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Users className="w-6 h-6 text-green-400" />
                3. Contas de Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/30">
                  <h4 className="font-semibold text-white mb-3">✅ Suas Responsabilidades:</h4>
                  <ul className="text-sm space-y-2 text-gray-300">
                    <li>• Fornecer informações verdadeiras e atualizadas</li>
                    <li>• Manter a segurança da sua conta</li>
                    <li>• Não compartilhar credenciais de acesso</li>
                    <li>• Notificar sobre uso não autorizado</li>
                    <li>• Usar a plataforma conforme estes termos</li>
                  </ul>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/30">
                  <h4 className="font-semibold text-white mb-3">🚫 Uso Proibido:</h4>
                  <ul className="text-sm space-y-2 text-gray-300">
                    <li>• Atividades ilegais ou fraudulentas</li>
                    <li>• Violação de direitos de terceiros</li>
                    <li>• Spam ou comunicações não solicitadas</li>
                    <li>• Tentativas de hacking ou engenharia reversa</li>
                    <li>• Uso comercial não autorizado</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção 4 */}
          <Card className="bg-gray-900/90 border border-gray-700/50 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Shield className="w-6 h-6 text-purple-400" />
                4. Propriedade Intelectual
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <div className="space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-400 mb-2">🏢 Propriedade da AutVision:</h4>
                  <ul className="text-sm space-y-1 text-gray-300">
                    <li>• Código-fonte da plataforma</li>
                    <li>• Algoritmos de IA e machine learning</li>
                    <li>• Design, interface e experiência do usuário</li>
                    <li>• Marcas, logos e identidade visual</li>
                    <li>• Documentação e materiais de marketing</li>
                  </ul>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-green-400 mb-2">👤 Seus Direitos:</h4>
                  <ul className="text-sm space-y-1 text-gray-300">
                    <li>• Conteúdo criado por você (textos, configurações)</li>
                    <li>• Dados pessoais e informações de conta</li>
                    <li>• Rotinas e automações personalizadas</li>
                    <li>• Licença de uso da plataforma enquanto ativo</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção 5 */}
          <Card className="bg-gray-900/90 border border-gray-700/50 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                5. Limitações e Responsabilidades
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">⚠️ Limitação de Responsabilidade:</h4>
                <div className="text-sm space-y-2">
                  <p className="text-gray-300">
                    A AutVision fornece a plataforma "como está" e não garante operação ininterrupta.
                    Nossa responsabilidade está limitada ao valor pago pelos serviços nos últimos 12 meses.
                  </p>

                  <div className="mt-3">
                    <h5 className="font-semibold text-white mb-1">Não nos responsabilizamos por:</h5>
                    <ul className="space-y-1 text-gray-300">
                      <li>• Perda de dados devido a falhas de terceiros</li>
                      <li>• Interrupções causadas por manutenção programada</li>
                      <li>• Danos indiretos ou consequenciais</li>
                      <li>• Uso inadequado da plataforma pelo usuário</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">🛡️ Nossos Compromissos:</h4>
                <ul className="text-sm space-y-1 text-gray-300">
                  <li>• Disponibilidade de 99.9% (SLA)</li>
                  <li>• Backups automáticos diários</li>
                  <li>• Suporte técnico responsivo</li>
                  <li>• Segurança de dados de nível empresarial</li>
                  <li>• Atualizações regulares da plataforma</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Seção 6 */}
          <Card className="bg-gray-900/90 border border-gray-700/50 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Scale className="w-6 h-6 text-cyan-400" />
                6. Lei Aplicável e Jurisdição
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">🇧🇷 Jurisdição Brasileira:</h4>
                  <ul className="text-sm space-y-1 text-gray-300">
                    <li>• Estes termos são regidos pela lei brasileira</li>
                    <li>• Foro da cidade de São Paulo/SP</li>
                    <li>• Conformidade com Marco Civil da Internet</li>
                    <li>• Adequação à LGPD (Lei Geral de Proteção de Dados)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">⚖️ Resolução de Conflitos:</h4>
                  <ul className="text-sm space-y-1 text-gray-300">
                    <li>• Tentativa de resolução amigável primeiro</li>
                    <li>• Mediação antes de ação judicial</li>
                    <li>• Arbitragem para questões comerciais</li>
                    <li>• Prazo de 60 dias para contestações</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção 7 */}
          <Card className="bg-gray-900/90 border border-gray-700/50 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Clock className="w-6 h-6 text-orange-400" />
                7. Alterações e Encerramento
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">📝 Alterações nos Termos:</h4>
                  <ul className="text-sm space-y-1 text-gray-300">
                    <li>• Avisaremos com 30 dias de antecedência sobre mudanças importantes</li>
                    <li>• Mudanças menores serão notificadas na plataforma</li>
                    <li>• Você pode cancelar se não concordar com as alterações</li>
                    <li>• Continuidade do uso implica aceitação das mudanças</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">🔚 Encerramento do Serviço:</h4>
                  <ul className="text-sm space-y-1 text-gray-300">
                    <li>• Você pode cancelar sua conta a qualquer momento</li>
                    <li>• Podemos suspender contas por violação dos termos</li>
                    <li>• Dados serão mantidos por 30 dias após cancelamento</li>
                    <li>• Export de dados disponível antes do cancelamento</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/30 backdrop-blur-lg">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Dúvidas sobre os Termos?</h3>
              <p className="text-gray-300 mb-6">
                Nossa equipe jurídica está disponível para esclarecer qualquer questão sobre estes termos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  📧 legal@autvision.com
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  💬 Suporte Legal
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Footer da página */}
        <div className="text-center mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-400 text-sm mb-4">
            <strong>Vigência:</strong> Estes termos entram em vigor em Janeiro de 2024 e permanecem válidos até nova atualização.
          </p>
          <p className="text-gray-400 text-sm">
            Última atualização: Janeiro de 2024 • Versão 2.0
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to={createPageUrl("PrivacyPolicy")} className="text-purple-400 hover:text-purple-300 text-sm">
              Política de Privacidade
            </Link>
            <Link to={createPageUrl("LandingPage")} className="text-purple-400 hover:text-purple-300 text-sm">
              Voltar ao Site
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
