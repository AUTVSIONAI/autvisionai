/**
 * 🔥 LOGIN PAGE - MARCHA EVOLUÇÃO 10.0
 * Página de login integrada com Supabase Auth
 * Design alinhado com a identidade visual do AutVision
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowLeft, Github } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  
  const { 
    signIn, 
    signInWithGoogle, 
    signInWithGitHub, 
    resetPassword, 
    loading, 
    initializing,
    error, 
    clearError
  } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showResetForm, setShowResetForm] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const result = await signIn(formData.email, formData.password)
      
      // Aguardar um pouco para o perfil ser carregado
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Verificar se é admin pelo email ou perfil
      const isAdmin = formData.email === 'digitalinfluenceradm@gmail.com' || 
                     result?.user?.email === 'digitalinfluenceradm@gmail.com'
      
      console.log('🔀 Redirecionando usuário:', { 
        email: formData.email, 
        isAdmin,
        destination: isAdmin ? '/admin' : '/client'
      })
      
      // Redirecionar baseado no tipo de usuário
      navigate(isAdmin ? '/admin' : '/client')
    } catch (err) {
      console.error('Erro de login:', err)
    }
  }

  const handleSocialLogin = async (provider) => {
    try {
      let result
      if (provider === 'google') {
        result = await signInWithGoogle()
      } else if (provider === 'github') {
        result = await signInWithGitHub()
      }
      
      // Aguardar um pouco para o perfil ser carregado
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Verificar se é admin pelo email
      const userEmail = result?.user?.email || ''
      const isAdmin = userEmail === 'digitalinfluenceradm@gmail.com'
      
      console.log('🔀 Redirecionando usuário social:', { 
        email: userEmail, 
        isAdmin,
        destination: isAdmin ? '/admin' : '/client'
      })
      
      // Redirecionar baseado no tipo de usuário
      navigate(isAdmin ? '/admin' : '/client')
    } catch (err) {
      console.error('Erro no login social:', err)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    try {
      await resetPassword(resetEmail)
      setResetSent(true)
    } catch (err) {
      console.error('Erro ao enviar reset:', err)
    }
  }

  // Se ainda está inicializando, mostrar tela de loading
  if (initializing) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-gray-400">Inicializando aplicação...</p>
        </div>
      </div>
    )
  }

  if (showResetForm) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center p-6">
        {/* Background Pattern */}
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
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="bg-gray-900/10 backdrop-blur-xl border border-white/10 shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <img
                  src="/assets/images/autvision-logo.jpeg"
                  alt="AutVision"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Recuperar Senha
              </CardTitle>
              <p className="text-gray-400">
                Digite seu email para receber o link de recuperação
              </p>
            </CardHeader>
            <CardContent>
              {resetSent ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email enviado!</h3>
                    <p className="text-gray-400 text-sm">
                      Verifique sua caixa de entrada e siga as instruções.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowResetForm(false)}
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Voltar ao Login
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div>
                    <Label htmlFor="reset-email" className="text-gray-300">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white mt-1"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  {error && (
                    <Alert className="bg-red-500/10 border-red-500/50">
                      <AlertDescription className="text-red-400">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Mail className="w-4 h-4 mr-2" />
                      )}
                      Enviar Link de Recuperação
                    </Button>

                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setShowResetForm(false)}
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center p-6">
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
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-gray-900/10 backdrop-blur-xl border border-white/10 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img
                src="/assets/images/autvision-logo.jpeg"
                alt="AutVision"
                className="w-16 h-16 object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Entrar no AutVision
            </CardTitle>
            <p className="text-gray-400">
              Acesse sua conta e continue automatizando sua vida
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Voltar para Landing */}
            <div className="mb-4">
              <Link 
                to="/LandingPage"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao início
              </Link>
            </div>

            {error && (
              <Alert className="bg-red-500/10 border-red-500/50">
                <AlertDescription className="text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Formulário de Login */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white mt-1"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-300">Senha</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 text-white font-semibold transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Entrar
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="link"
                onClick={() => setShowResetForm(true)}
                className="w-full text-blue-400 hover:text-blue-300"
              >
                Esqueceu sua senha?
              </Button>
            </form>

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-400">Ou continue com</span>
              </div>
            </div>

            {/* Login Social */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin('github')}
                disabled={loading}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>

            {/* Link para Cadastro */}
            <div className="text-center">
              <p className="text-gray-400">
                Ainda não tem uma conta?{' '}
                <Link 
                  to="/SignUp"
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Criar conta grátis
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
