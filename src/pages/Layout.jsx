import {useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Settings, Sparkles, Home, Zap, Clock, Link as LinkIcon, Award, MessageCircle, Crown, Undo2 } from "lucide-react";
import { User } from "@/api/entities";
import { Tutorial } from "@/api/entities";
import TutorialOverlay from "@/components/tutorial/TutorialOverlay";
import { ToastProvider } from "@/components/ui/toast";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout({ children, currentPageName }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  useEffect(() => {
    // APLICA TEMA NA CARGA INICIAL
    const theme = localStorage.getItem('theme') || 'system';
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    const fetchUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        checkTutorialStatus(user.email);
      } catch {
        // Not logged in, or demo user
        setCurrentUser({ full_name: 'Demo User', role: 'user', tokens: 0 });
      }
    };
    fetchUser();
  }, [currentPageName]);
  
  const checkTutorialStatus = async (userEmail) => {
    try {
      const tutorialState = await Tutorial.filter({ created_by: userEmail });
      if (!Array.isArray(tutorialState) || tutorialState.length === 0) {
        // First time user or error, create and start tutorial (mock)
        const mockTutorial = await Tutorial.create({ step: 0, created_by: userEmail });
        if (mockTutorial) {
          setShowTutorial(true);
        }
      } else if (!tutorialState[0].completed && !tutorialState[0].skipped) {
        setTutorialStep(tutorialState[0].step);
        setShowTutorial(true);
      }
    } catch(e) {
      console.error("Error checking tutorial status", e);
      // Continue without tutorial system if it fails
    }
  }
  
  const handleTutorialNext = async () => {
    // Ensure currentUser is available before proceeding
    if (!currentUser || !currentUser.email) {
      console.error("Current user not available for tutorial update.");
      return;
    }
    
    try {
      const nextStep = tutorialStep + 1;
      const tutorialState = await Tutorial.filter({ created_by: currentUser.email });
      
      if (!Array.isArray(tutorialState) || tutorialState.length === 0) {
        console.warn("No tutorial state found for current user to update.");
        setShowTutorial(false); // Hide tutorial if state is missing
        return;
      }

      if (nextStep >= 5) { // 5 is the number of steps for this tutorial
        await Tutorial.update(tutorialState[0].id, { completed: true, step: nextStep });
        setShowTutorial(false);
      } else {
        await Tutorial.update(tutorialState[0].id, { step: nextStep });
        setTutorialStep(nextStep);
      }
    } catch (error) {
      console.error("Error updating tutorial:", error);
      setShowTutorial(false); // Hide tutorial on error
    }
  };

  const handleTutorialSkip = async () => {
    // Ensure currentUser is available before proceeding
    if (!currentUser || !currentUser.email) {
      console.error("Current user not available for tutorial update.");
      setShowTutorial(false); // Hide tutorial if state is missing
      return;
    }

    const tutorialState = await Tutorial.filter({ created_by: currentUser.email });
    if(tutorialState.length > 0) {
      await Tutorial.update(tutorialState[0].id, { skipped: true });
    }
    setShowTutorial(false);
  };

  // << FUNÇÃO SECRETA PARA O LOGO - CORRIGIDA >>
  const handleLogoClick = () => {
    // Leva para a Landing Page interna do app
    navigate(createPageUrl('LandingPage'));
  };

  // Landing page - sem sidebar
  if (['LandingPage', 'PrivacyPolicy', 'TermsOfService'].includes(currentPageName)) {
    return (
      <ToastProvider>
        <div className="min-h-screen" style={{ backgroundColor: '#FEFEFE' }}> {/* BRANCO NEVE */}
          <style>{`
            :root {
              --theme-primary: 0 122 255;
              --theme-secondary: 13 202 240;
              --theme-background: 254 254 254; /* BRANCO NEVE */
              --theme-text-primary: 17 24 39;
              --theme-text-secondary: 75 85 99;
              --theme-surface: 255 255 255;
              --theme-border: 229 231 235;
            }
            body {
              background-color: #FEFEFE !important; /* FORÇA BRANCO NEVE */
            }
            .dark {
              --theme-primary: 59 130 246;
              --theme-secondary: 34 211 238;
              --theme-background: 17 24 39;
              --theme-text-primary: 243 244 246;
              --theme-text-secondary: 156 163 175;
              --theme-surface: 31 41 55;
              --theme-border: 55 65 81;
            }
          `}</style>
          {children}
        </div>
      </ToastProvider>
    );
  }

  // A PÁGINA ADMIN AGORA CONTROLA O PRÓPRIO LAYOUT, ENTÃO O LAYOUT GLOBAL NÃO SE APLICA
  if (currentPageName === 'Admin') {
    return (
      <ToastProvider>
        {children}
      </ToastProvider>
    );
  }

  // Para o painel do cliente - interface direta, mas com sidebar
  const isBusinessPage = ['BusinessOnboarding', 'BusinessAgentConfig', 'WhatsAppIntegration', 'BusinessDashboard'].includes(currentPageName);
  
  const clientNavigation = [
    {
      title: "Vision Central",
      url: createPageUrl("ClientDashboard"),
      icon: Home,
    },
    {
      title: "Agentes",
      url: createPageUrl("Agents"),
      icon: Zap,
    },
    {
      title: "Rotinas",
      url: createPageUrl("Routines"),
      icon: Clock,
    },
    {
      title: "Integrações",
      url: createPageUrl("Integrations"),
      icon: LinkIcon,
    },
    {
      title: "Perfil",
      url: createPageUrl("Profile"),
      icon: Award,
    },
    {
      title: "Modo Empresarial",
      url: createPageUrl("BusinessDashboard"),
      icon: MessageCircle,
    },
    {
      title: "Configurações",
      url: createPageUrl("Settings"),
      icon: Settings,
    },
  ];

  // << ADICIONANDO ITEM CENTRAL DE COMANDO PARA USUÁRIOS ADMIN >>
  if (currentUser?.role === 'admin') {
    // Inserir antes do último item (Configurações)
    clientNavigation.splice(-1, 0, {
      title: "🎖️ Central de Comando",
      url: createPageUrl("Admin"),
      icon: Crown,
    });
  }

  const businessNavigation = [
    {
      title: "Dashboard Empresarial",
      url: createPageUrl("BusinessDashboard"),
      icon: Home,
    },
    {
      title: "Configurar Agente",
      url: createPageUrl("BusinessAgentConfig"),
      icon: Zap,
    },
    {
      title: "WhatsApp",
      url: createPageUrl("WhatsAppIntegration"),
      icon: MessageCircle,
    },
    // << BOTÃO PARA SAIR DO MODO EMPRESARIAL >>
    {
      title: "Painel Principal",
      url: createPageUrl("ClientDashboard"),
      icon: Undo2,
    },
    {
      title: "Onboarding",
      url: createPageUrl("BusinessOnboarding"),
      icon: Settings,
    },
  ];

  const navigationItems = isBusinessPage ? businessNavigation : clientNavigation;

  return (
    <ToastProvider>
      {showTutorial && currentUser && <TutorialOverlay step={tutorialStep} onNext={handleTutorialNext} onSkip={handleTutorialSkip} />}
      <SidebarProvider key={currentPageName} defaultOpen={true}>
        <style>{`
          :root {
              --autvision-primary: #1e3a8a;
              --autvision-primary-dark: #1e40af;
              --autvision-secondary: #FEFEFE; /* BRANCO NEVE */
              --autvision-accent: #e2e8f0;
              --autvision-text: #1e293b;
              --autvision-text-light: #64748b;
          }

          body {
            background-color: #FEFEFE !important; /* FORÇA BRANCO NEVE GLOBAL */
          }

          .dark {
               --autvision-primary: #3b82f6;
              --autvision-primary-dark: #2563eb;
              --autvision-secondary: #0f172a;
              --autvision-accent: #1e293b;
              --autvision-text: #f1f5f9;
              --autvision-text-light: #94a3b8;
          }

          .autvision-glass {
              background: rgba(254, 254, 254, 0.8); /* BRANCO NEVE COM TRANSPARÊNCIA */
              backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .dark .autvision-glass {
              background: rgba(31, 41, 55, 0.8);
              border: 1px solid rgba(75, 85, 99, 0.3);
          }

          .autvision-gradient {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .autvision-shadow {
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }

          .dark .autvision-shadow {
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
          }
          
          /* EFEITO HOVER NO LOGO */
          .logo-secret:hover {
            transform: scale(1.05);
            filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
            cursor: pointer;
          }
        `}</style>
        
        <div className="min-h-screen flex w-full" style={{ backgroundColor: '#FEFEFE' }}> {/* BRANCO NEVE */}
          {/* Sidebar Global */}
          <Sidebar className="autvision-glass border-r-0">
            <SidebarHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div 
                  className="relative w-10 h-10 logo-secret transition-all duration-200"
                  onClick={handleLogoClick}
                  title="🎯 Clique para acessar o site"
                >
                  <img 
                    src="/assets/images/autvision-logo.png" 
                    alt="AutVision"
                    className="w-full h-full object-contain"
                  />
                  {/* Logo AutVision - Imagem local */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-sm"></div>
                </div>
                <div>
                  <h1 className="font-bold text-lg">AutVision</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Visão Inteligente</p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="px-3 py-6">
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-4">
                  {isBusinessPage ? 'Empresarial' : 'Principal'}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-2">
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link to={item.url} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 ${
                            item.title.includes('🎖️') ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 shadow-sm' : ''
                          }`}>
                            <item.icon className={`w-5 h-5 ${
                              item.title.includes('🎖️') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                            }`} />
                            <span className={`font-medium ${
                              item.title.includes('🎖️') ? 'text-blue-700 dark:text-blue-300' : ''
                            }`}>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-6 border-t border-gray-200 dark:border-gray-700">
              {currentUser && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {currentUser.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{currentUser.full_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Sparkles className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs text-gray-500">{currentUser.tokens || 0} tokens</span>
                      {currentUser.role === 'admin' && (
                        <Crown className="w-3 h-3 text-yellow-600 animate-pulse" title="Administrador" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </SidebarFooter>
          </Sidebar>

          {/* Conteúdo Principal */}
          <div className="flex-1 flex flex-col min-h-screen">
            <header className="autvision-glass border-b border-gray-200 dark:border-gray-700 px-6 py-4" style={{ backgroundColor: 'rgba(254, 254, 254, 0.9)' }}> {/* BRANCO NEVE */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" />
                  <div>
                    <h1 className="text-xl font-bold">{navigationItems.find(item => item.url === createPageUrl(currentPageName))?.title || currentPageName}</h1>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {currentUser && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                      <Sparkles className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                        {currentUser.tokens || 0} tokens
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </header>
            
            <main className="flex-1 p-6" style={{ backgroundColor: '#FEFEFE' }}> {/* BRANCO NEVE */}
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ToastProvider>
  );
}

