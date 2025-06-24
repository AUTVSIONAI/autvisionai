import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { Plan } from "@/api/entities"; // Import Plan entity
import { 
  Zap, 
  Brain, 
  Shield, 
  Rocket, 
  Eye, 
  MessageSquare, 
  ArrowRight,
  Play,
  Star,
  Globe,
  Lock,
  Sparkles,
  Users,
  BarChart3,
  Clock,
  Check,
  Cpu,
  Layers,
  TrendingUp,
  LifeBuoy,
  Package
} from 'lucide-react';

// Pricing Section Component
function PricingSection() {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      setIsLoading(true);
      try {
        const plansList = await Plan.filter({ is_active: true });
        const uniquePlans = plansList.reduce((acc, current) => {
          if (!acc.find(plan => plan.name === current.name)) {
            acc.push(current);
          }
          return acc;
        }, []);
        setPlans(uniquePlans.sort((a, b) => a.price - b.price));
      } catch (error) {
        console.error("Erro ao carregar planos:", error);
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
            Planos flexíveis para cada nível de ambição. Comece sua jornada hoje.
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
                      <Star className="w-4 h-4 mr-2" />
                      Mais Popular
                    </Badge>
                  )}
                  <CardHeader className="pt-10">
                    <CardTitle className="text-2xl font-bold text-white text-center">{plan.name}</CardTitle>
                    <div className="text-center my-6">
                      <span className="text-5xl font-bold text-white">R${plan.price}</span>
                      <span className="text-lg text-gray-400">/mês</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-4">
                      {plan.features?.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6 mt-auto">
                    <Button
                      size="lg"
                      className={`w-full text-lg font-semibold transition-all duration-300 ${
                        plan.is_popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/30 shadow-lg text-white' 
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                      }`}
                    >
                      Começar Agora
                    </Button>
                  </div>
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
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (e) { /* Not logged in */ }
    };
    checkAuth();
  }, []);

  const handleGetStarted = async () => {
    setIsLoading(true);
    try {
      if (currentUser) {
        window.location.href = createPageUrl("ClientDashboard");
      } else {
        await User.login();
      }
    } catch (error) {
      console.error("Erro no login:", error);
    }
    setIsLoading(false);
  };
  
  const features = [
    { icon: Brain, title: "Inteligência Preditiva", description: "O Vision antecipa suas necessidades antes mesmo de você pensar nelas." },
    { icon: Layers, title: "Ecossistema Conectado", description: "Unifique todos os seus apps e serviços em um fluxo de trabalho inteligente." },
    { icon: Zap, title: "Automação Instantânea", description: "Crie rotinas complexas com um simples comando de voz ou clique." },
    { icon: Shield, title: "Segurança de Nível Militar", description: "Seus dados protegidos pela mais avançada criptografia ponta-a-ponta." },
    { icon: Cpu, title: "Hardware Opcional", description: "Dispositivos físicos que trazem o poder do Vision para seu ambiente." },
    { icon: TrendingUp, title: "Analytics de Vida", description: "Métricas que te ajudam a otimizar seu tempo e alcançar seus objetivos." },
  ];

  const faqs = [
    { q: "O que é o Vision exatamente?", a: "O Vision é seu copiloto pessoal de IA. Ele automatiza tarefas, gerencia informações e se integra a todos os seus aplicativos para liberar seu tempo e potencializar sua produtividade." },
    { q: "Meus dados estão seguros?", a: "Absolutamente. Usamos criptografia de nível militar (AES-256) e seguimos as melhores práticas de segurança do mercado. Sua privacidade é nossa prioridade máxima." },
    { q: "Posso cancelar a qualquer momento?", a: "Sim. Nossos planos são flexíveis e você pode cancelar ou alterar seu plano a qualquer momento, sem burocracia." },
    { q: "O Vision funciona com meus aplicativos?", a: "Provavelmente sim. O Vision se integra com mais de 1000 serviços populares, incluindo Google Suite, Microsoft 365, redes sociais, apps de produtividade e muito mais." },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      
      {/* Header Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <img src="/assets/images/autvision-logo.png" alt="AutVision" className="w-10 h-10" />
            {/* Logo AutVision - Imagem local */}
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AutVision</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Recursos</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Planos</a>
            <a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
            <Button onClick={handleGetStarted} variant="outline" className="border-white/20 text-white hover:bg-white/10">
              {currentUser ? 'Acessar Painel' : 'Entrar'}
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* HERO SECTION CINEMATOGRÁFICO */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-900/30 to-slate-900"></div>
        <div className="absolute inset-0 overflow-hidden">
          {/* Grid de fundo */}
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]">
            <div 
              className="absolute inset-[-100%] animate-[spin_40s_linear_infinite]" 
              style={{ 
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(14 20 54 / 0.5)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")` 
              }}
            ></div>
          </div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Sua vida, automatizada.
              <br />
              Sua mente, livre.
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Conheça o Vision, seu copiloto pessoal de IA projetado para eliminar o trabalho repetitivo e liberar seu verdadeiro potencial.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <Button 
                onClick={handleGetStarted}
                disabled={isLoading}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Quero meu Vision
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* WHY VISION SECTION */}
      <section className="py-20 bg-slate-900/70 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              E se sua vida tivesse um copiloto?
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">
              O Vision não é apenas uma ferramenta, é uma extensão da sua mente. Ele aprende, adapta-se e age para que você possa focar no que realmente importa.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                <Zap className="w-10 h-10 text-yellow-400 mx-auto mb-4"/>
                <h3 className="text-xl font-semibold text-white mb-2">Automatize o Impossível</h3>
                <p className="text-gray-400">Conecte qualquer serviço e crie automações que você nunca imaginou serem possíveis.</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                <Clock className="w-10 h-10 text-green-400 mx-auto mb-4"/>
                <h3 className="text-xl font-semibold text-white mb-2">Recupere Seu Tempo</h3>
                <p className="text-gray-400">Deixe as tarefas repetitivas para o Vision e ganhe horas preciosas no seu dia.</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                <Brain className="w-10 h-10 text-blue-400 mx-auto mb-4"/>
                <h3 className="text-xl font-semibold text-white mb-2">Alcance Clareza Mental</h3>
                <p className="text-gray-400">Com tudo organizado e automatizado, sua mente fica livre para criar e inovar.</p>
              </div>
            </div>
        </div>
      </section>

      {/* FEATURES SHOWCASE */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Engenharia de Ponta</h2>
            <p className="text-xl text-gray-400">Construído com a tecnologia do futuro, disponível hoje.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <div className="bg-gray-800/40 p-8 rounded-2xl border border-gray-700/50 h-full hover:border-blue-500/50 transition-colors">
                  <feature.icon className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* PRICING SECTION */}
      <PricingSection />

      {/* FAQ SECTION */}
      <section id="faq" className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Perguntas Frequentes</h2>
            <p className="text-xl text-gray-400">Respostas claras para suas dúvidas mais importantes.</p>
          </motion.div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-gray-800/40 border border-gray-700/50 rounded-lg mb-4 px-6">
                <AccordionTrigger className="text-lg text-white font-medium hover:no-underline">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-gray-300 text-base pt-2">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Liberte seu Potencial.
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Pare de fazer trabalho de robô. Comece a viver no seu máximo.
            </p>
            <Button onClick={handleGetStarted} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 text-white px-10 py-5 text-xl font-bold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
              Quero meu Vision Agora
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900/80 backdrop-blur-lg border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src="/assets/images/autvision-logo.png" alt="AutVision" className="w-10 h-10" />
                {/* Logo AutVision - Imagem local */}
                <span className="text-2xl font-bold text-white">AutVision</span>
              </div>
              <p className="text-gray-400 mb-4">Sua vida, automatizada. Sua mente, livre.</p>
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
                <li><a href="#" className="text-gray-400 hover:text-white">Sobre Nós</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contato</a></li>
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