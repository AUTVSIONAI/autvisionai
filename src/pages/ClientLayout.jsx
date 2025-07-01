/**
 * 🔥 CLIENT LAYOUT - LAYOUT ESPECÍFICO PARA CLIENTE
 * Layout exclusivo para usuários clientes
 */

import PropTypes from 'prop-types'
import { Link } from "react-router-dom";
import { Settings, Sparkles, Home, Clock, Link as LinkIcon, Crown, LogOut, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ToastProvider } from "@/components/ui/toast";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function ClientLayout({ children, currentPageName }) {
  const { signOut, profile } = useAuth();

  // NAVEGAÇÃO EXCLUSIVA PARA CLIENTE
  const navigation = [
    {
      name: "Dashboard",
      href: "/client",
      icon: Home,
      path: "client"
    },
    {
      name: "Agentes",
      href: "/Agents", 
      icon: Sparkles,
      path: "Agents"
    },
    {
      name: "Rotinas",
      href: "/Routines",
      icon: Clock,
      path: "Routines"
    },
    {
      name: "Integrações",
      href: "/Integrations",
      icon: LinkIcon,
      path: "Integrations"
    },
    {
      name: "Planos",
      href: "/Plans",
      icon: Crown,
      path: "Plans"
    },
    {
      name: "Gamificação",
      href: "/Gamification",
      icon: Trophy,
      path: "Gamification"
    },
    {
      name: "Configurações", 
      href: "/Settings",
      icon: Settings,
      path: "Settings"
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <ToastProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gray-950">
          {/* SIDEBAR CLIENTE */}
          <Sidebar className="border-r border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <SidebarHeader className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Vision AI</h2>
                  <p className="text-xs text-gray-400">Painel Cliente</p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="p-4">
              <SidebarGroup>
                <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider mb-4">
                  Navegação
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigation.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton 
                          asChild
                          className={`w-full justify-start gap-3 p-3 rounded-lg transition-all duration-200 ${
                            currentPageName === item.path 
                              ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-white border border-purple-500/30' 
                              : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                          }`}
                        >
                          <Link to={item.href}>
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-gray-800">
              {/* Perfil do usuário */}
              <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {profile?.full_name || 'Usuário'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {profile?.email || 'cliente@exemplo.com'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão de sair */}
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full justify-start gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </SidebarFooter>
          </Sidebar>

          {/* CONTEÚDO PRINCIPAL */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-gray-400 hover:text-white" />
                <div>
                  <h1 className="text-lg font-semibold text-white">
                    {navigation.find(nav => nav.path === currentPageName)?.name || 'Dashboard'}
                  </h1>
                  <p className="text-sm text-gray-400">Painel do Cliente</p>
                </div>
              </div>

              {/* Botão sair no header também */}
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800/50 gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </header>

            {/* Conteúdo */}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ToastProvider>
  );
}

ClientLayout.propTypes = {
  children: PropTypes.node.isRequired,
  currentPageName: PropTypes.string
};
