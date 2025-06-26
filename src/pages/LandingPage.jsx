import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plan } from "@/api/entities";
import { 
  Zap, 
  Brain, 
  Shield, 
  ArrowRight,
  Sparkles,
  Clock,
  Check,
  Cpu,
  Layers,
  TrendingUp,
  Menu,
  X
} from 'lucide-react';

// Planos mock para garantir que sempre funcione
const mockPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    description: 'Ideal para começar sua jornada de automação',
    features: ['5 automações', 'Suporte por email', 'Integrações básicas', '100 execuções/mês'],
    is_popular: false
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 149,
    description: 'Para empresas que querem crescer rapidamente',
    features: ['50 automações', 'Suporte prioritário', 'Todas as integrações', '5000 execuções/mês', 'Analytics avançados'],
    is_popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    description: 'Solução completa para grandes empresas',
    features: ['Automações ilimitadas', 'Suporte 24/7', 'Integrações customizadas', 'Execuções ilimitadas', 'Consultoria dedicada'],
    is_popular: false
  }
];

// 💳 PRICING SECTION
function PricingSection() {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handlePlanSelect = () => {
    // Redireciona para página de contato ou newsletter
    window.open('mailto:contato@autvision.com', '_blank');
  };

  useEffect(() => {
    const loadPlans = async () => {
      setIsLoading(true);
      try {
        const plansList = await Plan.filter({ is_active: true });
        if (plansList && plansList.length > 0) {
          const uniquePlans = plansList.reduce((acc, current) => {
            if (!acc.find(plan => plan.name === current.name)) {
              acc.push(current);
            }
            return acc;
          }, []);
          setPlans(uniquePlans.sort((a, b) => a.price - b.price));
        } else {
          // Se não conseguir carregar da API, usa os planos mock
          setPlans(mockPlans);
        }
      } catch (error) {
        console.error("Erro ao carregar planos:", error);
        // Em caso de erro, usa os planos mock
        setPlans(mockPlans);
      }
      setIsLoading(false);
    };
    loadPlans();
  }, []);

  return (
    <section id="pricing" className="py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Escolha seu Vision
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Planos flexíveis para cada nível de ambição. Transforme sua produtividade hoje.
          </p>
        </motion.div>
        
        {isLoading ? (
          <div className="text-center text-white">Carregando planos...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="h-full"
              >
                <Card className={`flex flex-col h-full bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 ${plan.is_popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
                  {plan.is_popular && (
                    <Badge className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 py-1 px-4">
                      Mais Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-8 pt-8">
                    <CardTitle className="text-2xl text-white mb-2">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold text-white mb-2">
                      R$ {plan.price}
                      <span className="text-base font-normal text-gray-400">/mês</span>
                    </div>
                    <p className="text-gray-400">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="flex-1 pb-8">
                    <div className="space-y-4 mb-8">
                      {plan.features && typeof plan.features === 'string' && plan.features.split(',').map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{feature.trim()}</span>
                        </div>
                      ))}
                      {plan.features && Array.isArray(plan.features) && plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                      {(!plan.features || (typeof plan.features !== 'string' && !Array.isArray(plan.features))) && (
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">Recursos inclusos</span>
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={handlePlanSelect}
                      className={`w-full ${plan.is_popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                        : 'bg-gray-700 hover:bg-gray-600'
                      } text-white`}
                    >
                      Entrar em Contato
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // FAQ Section Data
  const faqs = [
    { q: "O que é o AutVision exatamente?", a: "O AutVision é sua plataforma de automação inteligente com IA. Automatiza tarefas complexas, gerencia informações e se integra a todos os seus aplicativos para maximizar sua produtividade." },
    { q: "Meus dados estão seguros?", a: "Absolutamente. Usamos criptografia de nível militar (AES-256) e seguimos as melhores práticas de segurança do mercado. Sua privacidade é nossa prioridade máxima." },
    { q: "Posso cancelar a qualquer momento?", a: "Sim. Nossos planos são flexíveis e você pode cancelar ou alterar seu plano a qualquer momento, sem burocracia." },
    { q: "O AutVision funciona com meus aplicativos?", a: "Sim. O AutVision se integra com mais de 1000 serviços populares, incluindo Google Suite, Microsoft 365, redes sociais, apps de produtividade e muito mais." },
  ];

  const handleContactUs = () => {
    window.open('mailto:contato@autvision.com?subject=Interesse%20no%20AutVision', '_blank');
  };

  const handleLogin = () => {
    window.location.href = '/Login';
  };

  const handleSignUp = () => {
    window.location.href = '/SignUp';
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      
      {/* 📱 HEADER NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <img src="/assets/images/autvision-logo.png" alt="AutVision" className="w-10 h-10" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AutVision</span>
          </motion.div>
          
          {/* Desktop Menu */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Recursos</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Planos</a>
            <a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
            
            <Button onClick={handleLogin} variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Entrar
            </Button>
            
            <Button onClick={handleSignUp} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 text-white">
              Criar Conta
            </Button>
            
            <Button onClick={handleContactUs} variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
              💬 Contato
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-black/90 backdrop-blur-lg border-t border-white/10"
          >
            <div className="px-6 py-4 space-y-4">
              <a href="#features" className="block text-gray-300 hover:text-white transition-colors py-2" onClick={handleMobileMenuClose}>Recursos</a>
              <a href="#pricing" className="block text-gray-300 hover:text-white transition-colors py-2" onClick={handleMobileMenuClose}>Planos</a>
              <a href="#faq" className="block text-gray-300 hover:text-white transition-colors py-2" onClick={handleMobileMenuClose}>FAQ</a>
              
              <div className="pt-4 space-y-3">
                <Button onClick={() => { handleLogin(); handleMobileMenuClose(); }} variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  Entrar
                </Button>
                
                <Button onClick={() => { handleSignUp(); handleMobileMenuClose(); }} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  Criar Conta
                </Button>
                
                <Button onClick={() => { handleContactUs(); handleMobileMenuClose(); }} variant="outline" className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10">
                  💬 Contato
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* 🎬 HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-900/30 to-slate-900"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-6xl mx-auto"
        >
          <Badge className="mb-6 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Tecnologia de IA Avançada
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Sua <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Visão Inteligente</span> do Futuro
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Automatize tarefas complexas, integre sistemas e multiplique sua produtividade com nossa plataforma de IA empresarial de última geração.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleContactUs}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-4 h-auto"
            >
              <Zap className="w-5 h-5 mr-2" />
              Começar Agora
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4 h-auto"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver Recursos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              Segurança Militar
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              IA Avançada
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              24/7 Disponível
            </div>
          </div>
        </motion.div>
      </section>

      {/* 🚀 FEATURES SECTION */}
      <section id="features" className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Recursos Revolucionários
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Descubra como nossa IA transforma completamente sua forma de trabalhar.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "IA Avançada",
                description: "Algoritmos de machine learning de última geração que aprendem com seus padrões e otimizam automaticamente seus processos."
              },
              {
                icon: Cpu,
                title: "Automação Inteligente",
                description: "Automatize fluxos complexos de trabalho com regras personalizáveis e integração nativa com centenas de aplicações."
              },
              {
                icon: Layers,
                title: "Integrações Infinitas",
                description: "Conecte todos os seus sistemas e dados em uma única plataforma unificada. Mais de 1000 integrações disponíveis."
              },
              {
                icon: Shield,
                title: "Segurança Absoluta",
                description: "Criptografia militar AES-256, compliance total com LGPD/GDPR e infraestrutura em nuvem de nível enterprise."
              },
              {
                icon: TrendingUp,
                title: "Analytics Preditivos",
                description: "Insights avançados com IA preditiva para antecipar tendências e otimizar decisões estratégicas em tempo real."
              },
              {
                icon: Sparkles,
                title: "Interface Intuitiva",
                description: "Design minimalista e UX intuitiva. Configure automações complexas em minutos, sem conhecimento técnico."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group">
                  <CardContent className="p-8">
                    <feature.icon className="w-12 h-12 text-blue-400 mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 💳 PRICING SECTION */}
      <PricingSection />

      {/* ❓ FAQ SECTION */}
      <section id="faq" className="py-20 bg-slate-800/50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-400">
              Tire suas dúvidas sobre nossa plataforma.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-gray-900/50 border border-gray-700/50 rounded-lg px-6">
                  <AccordionTrigger className="text-white hover:text-blue-400 transition-colors">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* 📧 CTA SECTION */}
      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Pronto para Revolucionar sua Produtividade?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de empresas que já transformaram seus resultados com AutVision.
            </p>
            <Button 
              onClick={handleContactUs}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xl px-10 py-6 h-auto"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Começar Transformação
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 🦶 FOOTER */}
      <footer className="bg-slate-900 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/assets/images/autvision-logo.png" alt="AutVision" className="w-8 h-8" />
                <span className="text-xl font-bold text-white">AutVision</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Transformando negócios através de automação inteligente e IA avançada.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Produto</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-white">Recursos</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white">Planos</a></li>
                <li><a href="#faq" className="text-gray-400 hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Empresa</h3>
              <ul className="space-y-3">
                <li><a href="mailto:contato@autvision.com" className="text-gray-400 hover:text-white">Contato</a></li>
                <li><a href="mailto:suporte@autvision.com" className="text-gray-400 hover:text-white">Suporte</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link to={createPageUrl("PrivacyPolicy")} className="text-gray-400 hover:text-white">Política de Privacidade</Link></li>
                <li><Link to={createPageUrl("TermsOfService")} className="text-gray-400 hover:text-white">Termos de Uso</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-500">
            <p>© 2024 AutVision. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}