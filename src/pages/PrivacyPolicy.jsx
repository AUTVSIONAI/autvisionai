import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Shield, Lock, Eye, FileText, Clock, Globe } from 'lucide-react';

export default function PrivacyPolicy() {
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
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Política de Privacidade
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6">
            Transparência total sobre como proteemos e utilizamos seus dados com segurança de nível militar.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
              <Lock className="w-3 h-3 mr-1" />
              Criptografia Militar
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Globe className="w-3 h-3 mr-1" />
              LGPD Compliant
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Clock className="w-3 h-3 mr-1" />
              Atualizado: Janeiro 2024
            </Badge>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="space-y-8">
          
          {/* Seção 1 */}
          <Card className="bg-gray-900/90 border border-gray-700/50 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Eye className="w-6 h-6 text-blue-400" />
                1. Informações que Coletamos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                A AutVision coleta informações essenciais para fornecer nossos serviços de automação inteligente:
              </p>
              
              <div className="space-y-3">
                <div className="pl-4 border-l-2 border-blue-500/30 bg-gray-800/50 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-white mb-2">Informações de Conta</h4>
                  <p className="text-gray-300">Nome, email, informações de perfil fornecidas durante o registro via Google OAuth.</p>
                </div>
                
                <div className="pl-4 border-l-2 border-purple-500/30 bg-gray-800/50 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-white mb-2">Dados de Uso</h4>
                  <p className="text-gray-300">Interações com agentes IA, rotinas criadas, integrações configuradas e métricas de performance.</p>
                </div>
                
                <div className="pl-4 border-l-2 border-green-500/30 bg-gray-800/50 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-white mb-2">Dados Técnicos</h4>
                  <p className="text-gray-300">Logs de sistema, informações de dispositivo, endereços IP e dados de sessão para segurança.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção 2 */}
          <Card className="bg-gray-900/90 border border-gray-700/50 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Lock className="w-6 h-6 text-green-400" />
                2. Como Protegemos Seus Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                Implementamos as mais avançadas medidas de segurança da indústria:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700/30">
                  <h4 className="font-semibold text-white mb-2">🔐 Criptografia AES-256</h4>
                  <p className="text-sm text-gray-300">Todos os dados são criptografados em trânsito e em repouso usando padrões militares.</p>
                </div>
                
                <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700/30">
                  <h4 className="font-semibold text-white mb-2">🛡️ Autenticação Multifatorial</h4>
                  <p className="text-sm text-gray-300">Múltiplas camadas de verificação para acessar seus dados.</p>
                </div>
                
                <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700/30">
                  <h4 className="font-semibold text-white mb-2">🔍 Monitoramento 24/7</h4>
                  <p className="text-sm text-gray-300">Sistemas de detecção de intrusão em tempo real.</p>
                </div>
                
                <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700/30">
                  <h4 className="font-semibold text-white mb-2">🏆 Compliance Total</h4>
                  <p className="text-sm text-gray-300">Conformidade com LGPD, GDPR e SOC 2 Type II.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção 3 */}
          <Card className="bg-gray-900/90 border border-gray-700/50 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Globe className="w-6 h-6 text-purple-400" />
                3. Como Utilizamos Suas Informações
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>Utilizamos seus dados exclusivamente para:</p>
              
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">Fornecer e melhorar nossos serviços de automação inteligente</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">Personalizar sua experiência com agentes IA e rotinas</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">Garantir segurança e prevenir uso fraudulento</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">Comunicar atualizações importantes sobre o serviço</span>
                </li>
              </ul>
              
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-red-400 mb-2">⚠️ Nunca Fazemos:</h4>
                <ul className="text-sm space-y-1 text-gray-300">
                  <li>• Venda de dados pessoais para terceiros</li>
                  <li>• Compartilhamento sem consentimento explícito</li>
                  <li>• Uso de dados para publicidade externa</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Seção 4 */}
          <Card className="bg-gray-900/90 border border-gray-700/50 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <FileText className="w-6 h-6 text-cyan-400" />
                4. Seus Direitos e Controles
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>Você tem controle total sobre seus dados:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3 bg-gray-800/50 p-4 rounded-lg border border-gray-700/30">
                  <h4 className="font-semibold text-white">✅ Direitos Garantidos:</h4>
                  <ul className="text-sm space-y-1 text-gray-300">
                    <li>• Acessar todos os seus dados</li>
                    <li>• Corrigir informações incorretas</li>
                    <li>• Excluir sua conta a qualquer momento</li>
                    <li>• Exportar seus dados (portabilidade)</li>
                    <li>• Revogar consentimentos</li>
                  </ul>
                </div>
                
                <div className="space-y-3 bg-gray-800/50 p-4 rounded-lg border border-gray-700/30">
                  <h4 className="font-semibold text-white">🔧 Como Exercer:</h4>
                  <ul className="text-sm space-y-1 text-gray-300">
                    <li>• Configurações da conta</li>
                    <li>• Email: privacy@autvision.com</li>
                    <li>• Chat de suporte na plataforma</li>
                    <li>• Resposta em até 72 horas</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção 5 */}
          <Card className="bg-gray-900/90 border border-gray-700/50 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Clock className="w-6 h-6 text-orange-400" />
                5. Retenção e Cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/30">
                  <h4 className="font-semibold text-white mb-3">📅 Retenção de Dados</h4>
                  <ul className="text-sm space-y-1 text-gray-300">
                    <li>• Dados de conta: Até exclusão pelo usuário</li>
                    <li>• Logs de sistema: 90 dias</li>
                    <li>• Dados de backup: 30 dias após exclusão</li>
                    <li>• Dados analíticos: 2 anos (anonimizados)</li>
                  </ul>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/30">
                  <h4 className="font-semibold text-white mb-3">🍪 Uso de Cookies</h4>
                  <ul className="text-sm space-y-1 text-gray-300">
                    <li>• Essenciais: Funcionamento da plataforma</li>
                    <li>• Performance: Otimização da experiência</li>
                    <li>• Funcionais: Preferências do usuário</li>
                    <li>• Configuráveis no navegador</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 backdrop-blur-lg">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Dúvidas sobre Privacidade?</h3>
              <p className="text-gray-300 mb-6">
                Nossa equipe de privacidade está sempre disponível para esclarecer qualquer questão.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  📧 privacy@autvision.com
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  💬 Chat de Suporte
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Footer da página */}
        <div className="text-center mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-400 text-sm">
            Última atualização: Janeiro de 2024 • Esta política pode ser atualizada periodicamente
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to={createPageUrl("TermsOfService")} className="text-blue-400 hover:text-blue-300 text-sm">
              Termos de Uso
            </Link>
            <Link to={createPageUrl("LandingPage")} className="text-blue-400 hover:text-blue-300 text-sm">
              Voltar ao Site
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
