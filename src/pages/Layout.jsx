/**
 * 🔥 LAYOUT - MARCHA EVOLUÇÃO 10.0 
 * Layout principal integrado com Supabase Auth
 */

import PropTypes from 'prop-types'
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Settings, Sparkles, Home, Clock, Link as LinkIcon, Award, MessageCircle, Crown, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ToastProvider } from "@/components/ui/toast";
import SystemStatus from "@/components/system/SystemStatus";
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
  const { user, profile, signOut, isAuthenticated, isAdmin } = useAuth();

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
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  // Menu items baseado no papel do usuário
  const menuItems = [
    { label: "Dashboard", path: "/ClientDashboard", icon: Home, requireAuth: true },
    { label: "Configurações", path: "/Settings", icon: Settings, requireAuth: true },
    { label: "Agentes", path: "/Agents", icon: Sparkles, requireAuth: true },
    { label: "Rotinas", path: "/Routines", icon: Clock, requireAuth: true },
    { label: "Integrações", path: "/Integrations", icon: LinkIcon, requireAuth: true },
    { label: "Projetos", path: "/ProjectReport", icon: Award, requireAuth: true },
    { label: "WhatsApp", path: "/WhatsAppIntegration", icon: MessageCircle, requireAuth: true },
  ];

  // Adicionar item de admin se for admin
  if (isAdmin) {
    menuItems.push({ 
      label: "Admin", 
      path: "/Admin", 
      icon: Crown, 
      requireAuth: true,
      isAdmin: true
    });
  }

  // Se não está autenticado, mostrar apenas itens públicos
  const visibleItems = isAuthenticated 
    ? menuItems.filter(item => item.requireAuth)
    : [
        { label: "Home", path: "/LandingPage", icon: Home }
      ];

  return (
    <ToastProvider>
      <SystemStatus />
      <SidebarProvider>
        <div className={`flex h-screen w-full ${currentPageName === 'ClientDashboard' ? 'bg-white' : 'bg-gray-950'}`}>
          <Sidebar className={`border-r ${currentPageName === 'ClientDashboard' ? 'border-gray-200 bg-white' : 'border-gray-800'}`}>
            <SidebarHeader className={`p-4 border-b ${currentPageName === 'ClientDashboard' ? 'border-gray-200' : 'border-gray-800'}`}>
              <Link 
                to={createPageUrl("LandingPage")} 
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <img
                  src="/assets/images/autvision-logo.png"
                  alt="AutVision"
                  className="w-10 h-10"
                />
                <div>
                  <h2 className={`text-lg font-bold ${currentPageName === 'ClientDashboard' ? 'text-gray-900' : 'text-white'}`}>AutVision</h2>
                  <p className={`text-xs ${currentPageName === 'ClientDashboard' ? 'text-gray-600' : 'text-gray-400'}`}>AI Assistant Platform</p>
                </div>
              </Link>
            </SidebarHeader>

            <SidebarContent className="p-4">
              <SidebarGroup>
                <SidebarGroupLabel className={`text-xs uppercase tracking-wider ${currentPageName === 'ClientDashboard' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Navegação
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {visibleItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPageName === item.path.split('/').pop();
                      
                      return (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton 
                            asChild 
                            className={`w-full ${
                              isActive 
                                ? 'bg-blue-600 text-white' 
                                : currentPageName === 'ClientDashboard'
                                  ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                          >
                            <Link 
                              to={createPageUrl(item.path.split('/').pop())}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all"
                            >
                              <Icon className="w-5 h-5" />
                              <span>{item.label}</span>
                              {item.isAdmin && (
                                <Crown className="w-4 h-4 text-yellow-400 ml-auto" />
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            {isAuthenticated && (
              <SidebarFooter className={`p-4 border-t ${currentPageName === 'ClientDashboard' ? 'border-gray-200' : 'border-gray-800'}`}>
                <div className="space-y-3">
                  {/* Informações do usuário */}
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${currentPageName === 'ClientDashboard' ? 'bg-gray-100' : 'bg-gray-800/50'}`}>
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${currentPageName === 'ClientDashboard' ? 'text-gray-900' : 'text-white'}`}>
                        {profile?.full_name || user?.email || 'Usuário'}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${currentPageName === 'ClientDashboard' ? 'text-gray-600' : 'text-gray-400'}`}>
                          {profile?.tokens || 0} tokens
                        </span>
                        {isAdmin && (
                          <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Botão de logout */}
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className={`w-full ${
                      currentPageName === 'ClientDashboard'
                        ? 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        : 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </SidebarFooter>
            )}
          </Sidebar>

          <div className="flex-1 flex flex-col overflow-hidden">
            <header className={`flex items-center gap-4 p-4 border-b ${
              currentPageName === 'ClientDashboard' 
                ? 'border-gray-200 bg-white' 
                : 'border-gray-800 bg-gray-900/50'
            }`}>
              <SidebarTrigger className={`p-2 rounded-lg ${
                currentPageName === 'ClientDashboard'
                  ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`} />
              <h1 className={`text-lg font-semibold ${
                currentPageName === 'ClientDashboard' ? 'text-gray-900' : 'text-white'
              }`}>
                {visibleItems.find(item => currentPageName === item.path.split('/').pop())?.label || 'AutVision'}
              </h1>
              
              {isAuthenticated && (
                <div className="ml-auto flex items-center gap-2">
                  <span className={`text-sm ${
                    currentPageName === 'ClientDashboard' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {profile?.tokens || 0} tokens disponíveis
                  </span>
                </div>
              )}
            </header>

            <main className={`flex-1 overflow-hidden ${
              currentPageName === 'ClientDashboard' ? 'bg-white' : 'bg-gray-950'
            }`}>
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ToastProvider>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  currentPageName: PropTypes.string
}
