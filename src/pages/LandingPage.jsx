/**
 * 🏠 LANDING PAGE ESPETACULAR - PÁGINA INICIAL
 * Página inicial do AutVision com design futurista e animações impressionantes
 */

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Shield, Sparkles, Rocket, Star, Globe, Users, TrendingUp, CheckCircle, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  const stats = [
    { number: '10K+', label: 'Usuários Ativos' },
    { number: '1M+', label: 'Tarefas Automatizadas' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Suporte' }
  ]
  
  const features = [
    {
      icon: Sparkles,
      title: 'IA Avançada',
      description: 'Algoritmos de machine learning que aprendem com seus padrões e otimizam automaticamente seus fluxos de trabalho.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Rocket,
      title: 'Performance Extrema',
      description: 'Processamento em tempo real com latência ultra-baixa para automações que não podem esperar.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Segurança Militar',
      description: 'Criptografia de nível militar e compliance com LGPD, GDPR e SOC 2 Type II.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Globe,
      title: 'Integração Universal',
      description: 'Conecte-se com mais de 5000+ aplicações e serviços através de nossa API robusta.',
      gradient: 'from-blue-500 to-indigo-500'
    }
  ]
  
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        {/* Floating Orbs */}
        <motion.div 
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Mouse Follower */}
        <motion.div
          className="absolute w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-sm pointer-events-none"
          animate={{
            x: mousePosition.x - 12,
            y: mousePosition.y - 12
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />
      </div>
      
      {/* Header */}
      <motion.header 
        className="relative z-50 border-b border-white/10 backdrop-blur-xl bg-black/50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <img 
              src="/assets/images/autvision-logo.jpeg" 
              alt="AutVision Logo" 
              className="w-10 h-10 rounded-xl object-cover"
            />
          </motion.div>
          
          <nav className="hidden md:flex space-x-8">
            {['Recursos', 'Preços', 'Sobre', 'Contato'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-300 hover:text-white transition-colors relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
            <Link to="/dashboard">
              <motion.span
                className="text-gray-300 hover:text-white transition-colors relative group cursor-pointer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
              </motion.span>
            </Link>
          </nav>
          
          <div className="flex space-x-4">
            <Link to="/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
                  Entrar
                </Button>
              </motion.div>
            </Link>
            <Link to="/SignUp">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/25">
                  Começar Grátis
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.div 
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              <Star className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-sm text-gray-300">Líder em Automação IA • Mais de 10.000 empresas confiam</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Automatize
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                seu Futuro
              </span>
            </h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              A plataforma de automação inteligente que{' '}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold">
                revoluciona
              </span>{' '}
              a maneira como você trabalha. Conecte, automatize e otimize seus processos com o poder da IA de última geração.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Link to="/SignUp">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 shadow-2xl shadow-blue-500/25 px-8 py-4 text-lg font-semibold relative overflow-hidden">
                    <span className="relative z-10 flex items-center">
                      Começar Gratuitamente
                      <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </motion.div>
              </Link>
              
              <Link to="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group cursor-pointer"
                >
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold">
                    <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Acessar Plataforma
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center group"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-1/4 left-10 w-20 h-20 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-16 w-16 h-16 bg-gradient-to-r from-pink-500/30 to-orange-500/30 rounded-full blur-xl"
          animate={{
            y: [0, 15, 0],
            scale: [1, 0.9, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-sm text-gray-300">Recursos Revolucionários</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Poder
              </span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                {' '}Ilimitado
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Descubra como nossa plataforma de IA pode{' '}
              <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-semibold">
                transformar completamente
              </span>{' '}
              seus processos de trabalho e elevar sua produtividade a níveis extraordinários.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  className="group relative"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <div className="relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl h-full overflow-hidden group-hover:border-white/20 transition-all duration-500">
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {feature.description}
                    </p>
                    
                    {/* Hover Effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    
                    {/* Floating Particles */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" />
                    <div className="absolute bottom-6 left-6 w-1 h-1 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300 delay-100" />
                  </div>
                </motion.div>
              )
            })}
          </div>
          
          {/* Additional Features Grid */}
          <motion.div 
            className="mt-20 grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              {
                icon: Users,
                title: 'Colaboração em Tempo Real',
                description: 'Trabalhe em equipe com sincronização instantânea e controle de versão avançado.'
              },
              {
                icon: TrendingUp,
                title: 'Analytics Avançado',
                description: 'Insights profundos sobre performance e otimizações automáticas baseadas em dados.'
              },
              {
                icon: CheckCircle,
                title: 'Confiabilidade 99.9%',
                description: 'Infraestrutura robusta com redundância global e monitoramento 24/7.'
              }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  className="group text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.6, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center group-hover:border-purple-500/50 transition-all duration-300">
                    <Icon className="w-10 h-10 text-blue-400 group-hover:text-purple-400 transition-colors duration-300" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {item.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-black" />
        
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black mb-8">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Pronto para
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Revolucionar?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Junte-se a milhares de empresas que já transformaram seus processos com AutVision.
              <span className="block mt-2 text-lg text-gray-400">Comece gratuitamente hoje mesmo.</span>
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link to="/SignUp">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 shadow-2xl shadow-purple-500/25 px-12 py-6 text-xl font-bold relative overflow-hidden">
                    <span className="relative z-10 flex items-center">
                      Começar Agora - Grátis
                      <Rocket className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </motion.div>
              </Link>
              
              <motion.div className="text-center">
                <p className="text-sm text-gray-400 mb-2">✨ Sem cartão de crédito • Configuração em 2 minutos</p>
                <div className="flex items-center justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-gray-300 ml-2">4.9/5 • 2.000+ avaliações</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-2xl"
          animate={{
            y: [0, 20, 0],
            scale: [1, 0.8, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </section>
      
      {/* Footer */}
      <footer className="relative bg-black border-t border-white/10 py-8 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="md:col-span-1">
              <motion.div 
                className="flex items-center mb-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <img 
                  src="/assets/images/autvision-logo.jpeg" 
                  alt="AutVision Logo" 
                  className="w-6 h-6 rounded object-cover"
                />
              </motion.div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Automação inteligente para empresas.
              </p>
            </div>
            
            {[
              {
                title: 'Produto',
                links: ['Recursos', 'Preços']
              },
              {
                title: 'Empresa',
                links: ['Sobre', 'Contato']
              },
              {
                title: 'Suporte',
                links: ['Ajuda']
              }
            ].map((column, columnIndex) => (
              <motion.div
                key={column.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: columnIndex * 0.1 + 0.3, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h4 className="text-white font-semibold text-xs mb-2 relative">
                  {column.title}
                  <span className="absolute -bottom-1 left-0 w-4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                </h4>
                <ul className="space-y-1">
                  {column.links.map((link, linkIndex) => (
                    <motion.li
                      key={link}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: linkIndex * 0.05 + columnIndex * 0.1 + 0.5, duration: 0.4 }}
                      viewport={{ once: true }}
                    >
                      <a 
                        href="#" 
                        className="text-gray-400 hover:text-white transition-colors duration-300 text-xs relative group"
                      >
                        {link}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400 text-xs mb-2 md:mb-0">
              © 2024 AutVision. Todos os direitos reservados.
            </p>
            <div className="flex space-x-4">
              {['Privacidade', 'Termos'].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-xs relative group"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 1, duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
      </footer>
    </div>
  )
}