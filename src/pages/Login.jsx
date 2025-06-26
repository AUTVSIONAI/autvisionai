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
import { createPageUrl } from '@/utils'

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
      await signIn(formData.email, formData.password)
      navigate('/ClientDashboard')
    } catch (err) {
      console.error('Erro de login:', err)
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-gray-400">Inicializando aplicação...</p>
        </div>
      </div>
    )
  }

  if (showResetForm) {
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
              <div className="flex justify-center mb-4">
                <img
                  src="/assets/images/autvision-logo.png"
                  alt="AutVision"
                  className="w-16 h-16"
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
              Entrar no AutVision
            </CardTitle>
            <p className="text-gray-400">
              Acesse sua conta e continue automatizando sua vida
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
                  to={createPageUrl("SignUp")}
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
