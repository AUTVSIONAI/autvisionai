/**
 * 🔥 SIGNUP PAGE - MARCHA EVOLUÇÃO 10.0
 * Página de cadastro integrada com Supabase Auth
 * Design alinhado com a identidade visual do AutVision
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff, User, Mail, ArrowLeft, Github, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { createPageUrl } from '@/utils'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { 
    signUp, 
    signInWithGoogle, 
    signInWithGitHub, 
    loading, 
    error, 
    clearError 
  } = useAuth()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [signUpSuccess, setSignUpSuccess] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validações básicas
    if (!formData.fullName.trim()) {
      alert('Por favor, insira seu nome completo')
      return
    }
    
    if (!formData.email.trim()) {
      alert('Por favor, insira seu email')
      return
    }
    
    if (formData.password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem')
      return
    }

    try {
      console.log('🔥 SignUp: Iniciando cadastro...')
      console.log('   - Nome:', formData.fullName)
      console.log('   - Email:', formData.email)
      
      const result = await signUp(formData.email, formData.password, {
        full_name: formData.fullName
      })
      
      console.log('✅ SignUp: Cadastro realizado!', result)
      
      if (result.needsConfirmation) {
        // Mostrar mensagem de confirmação de email
        alert('Cadastro realizado! Verifique seu email para confirmar a conta.')
      }
      
      setSignUpSuccess(true)
      
    } catch (err) {
      console.error('❌ SignUp: Erro de cadastro:', err)
      
      // Tratar erros específicos com mensagens amigáveis
      let errorMessage = 'Erro desconhecido no cadastro'
      
      if (err.code === 'EMAIL_ALREADY_EXISTS') {
        errorMessage = 'Este email já está cadastrado. Tente fazer login.'
      } else if (err.code === 'INVALID_EMAIL') {
        errorMessage = 'Email inválido. Verifique o formato.'
      } else if (err.code === 'INVALID_PASSWORD') {
        errorMessage = 'Senha deve ter pelo menos 6 caracteres.'
      } else if (err.code === 'RATE_LIMIT') {
        errorMessage = 'Muitas tentativas. Aguarde alguns minutos.'
      } else if (err.code === 'DATABASE_ERROR') {
        errorMessage = 'Erro interno do servidor. Tente novamente em alguns minutos.'
      } else if (err.code === 'CONNECTION_ERROR') {
        errorMessage = 'Erro de conexão. Verifique sua internet.'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      alert(errorMessage)
    }
  }

  const handleSocialLogin = async (provider) => {
    try {
      if (provider === 'google') {
        await signInWithGoogle()
      } else if (provider === 'github') {
        await signInWithGitHub()
      }
      navigate('/ClientDashboard')
    } catch (err) {
      console.error('Erro no login social:', err)
    }
  }

  if (signUpSuccess) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]">
            <div 
              className="absolute inset-[-100%] animate-[spin_40s_linear_infinite]" 
              style={{ 
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(14 20 54 / 0.5)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")` 
              }}
            ></div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="bg-gray-900/80 backdrop-blur-lg border border-gray-700/50">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Bem-vindo ao AutVision!
              </CardTitle>
              <p className="text-gray-400">
                Sua conta foi criada com sucesso. Verifique seu email para ativar sua conta.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Mail className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-300 font-medium">Email de confirmação enviado!</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Clique no link do email para ativar sua conta
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => navigate('/Login')}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 text-white font-semibold transition-all duration-300"
                  >
                    Ir para Login
                  </Button>
                  
                  <Link 
                    to={createPageUrl("LandingPage")}
                    className="block text-center text-gray-400 hover:text-white transition-colors"
                  >
                    Voltar ao início
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]">
          <div 
            className="absolute inset-[-100%] animate-[spin_40s_linear_infinite]" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(14 20 54 / 0.5)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")` 
            }}
          ></div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-gray-900/80 backdrop-blur-lg border border-gray-700/50">
          <CardHeader className="text-center space-y-2">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img
                src="/assets/images/autvision-logo.png"
                alt="AutVision"
                className="w-16 h-16"
              />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Criar sua conta
            </CardTitle>
            <p className="text-gray-400">
              Junte-se à revolução da automação inteligente
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Voltar para Landing */}
            <Link 
              to={createPageUrl("LandingPage")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao início
            </Link>

            {error && (
              <Alert className="bg-red-500/10 border-red-500/50">
                <AlertDescription className="text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Formulário de Cadastro */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-gray-300">Nome Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white mt-1"
                  placeholder="Seu nome completo"
                  required
                />
              </div>

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

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirmar Senha</Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 text-white font-semibold transition-all duration-300"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <User className="w-4 h-4 mr-2" />
                )}
                Criar minha conta
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

            {/* Link para Login */}
            <div className="text-center">
              <p className="text-gray-400">
                Já tem uma conta?{' '}
                <Link 
                  to={createPageUrl("Login")}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Fazer login
                </Link>
              </p>
            </div>

            {/* Termos */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Ao criar uma conta, você concorda com nossos{' '}
                <Link to={createPageUrl("TermsOfService")} className="text-blue-400 hover:text-blue-300">
                  Termos de Serviço
                </Link>{' '}
                e{' '}
                <Link to={createPageUrl("PrivacyPolicy")} className="text-blue-400 hover:text-blue-300">
                  Política de Privacidade
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
