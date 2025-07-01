/**
 * 🔥 ADMIN LAYOUT - LAYOUT ESPECÍFICO PARA ADMIN
 * Layout exclusivo para usuários administradores
 */

import PropTypes from 'prop-types'
import { Link } from "react-router-dom";
import { Settings, Users, BarChart3, Crown, LogOut, Database, Cog } from "lucide-react";
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

export default function AdminLayout({ children, currentPageName }) {
  const { signOut, profile } = useAuth();

  // NAVEGAÇÃO EXCLUSIVA PARA ADMIN
  const navigation = [
    {
      name: "Painel Admin",
      href: "/admin",
      icon: BarChart3,
      path: "Admin"
    },
    {
      name: "Gerenciar Agentes",
      href: "/admin/agents", 
      icon: Users,
      path: "AdminAgents"
    },
    {
      name: "Gerenciar Planos",
      href: "/admin/plans",
      icon: Crown,
      path: "AdminPlans"
    },
    {
      name: "Usuários",
      href: "/admin/users",
      icon: Users,
      path: "AdminUsers"
    },
    {
      name: "Banco de Dados",
      href: "/admin/database",
      icon: Database,
      path: "AdminDatabase"
    },
    {
      name: "Configurações Sistema", 
      href: "/admin/settings",
      icon: Cog,
      path: "AdminSettings"
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
          {/* SIDEBAR ADMIN */}
          <Sidebar className="border-r border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <SidebarHeader className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Vision AI</h2>
                  <p className="text-xs text-orange-400">Painel Admin</p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="p-4">
              <SidebarGroup>
                <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider mb-4">
                  Administração
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigation.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton 
                          asChild
                          className={`w-full justify-start gap-3 p-3 rounded-lg transition-all duration-200 ${
                            currentPageName === item.path 
                              ? 'bg-gradient-to-r from-red-600/30 to-orange-600/30 text-white border border-red-500/30' 
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
              {/* Perfil do admin */}
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {profile?.full_name || 'Administrador'}
                    </p>
                    <p className="text-xs text-orange-400 truncate">
                      Admin System
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
                Sair do Admin
              </Button>
            </SidebarFooter>
          </Sidebar>

          {/* CONTEÚDO PRINCIPAL */}
          <div className="flex-1 flex flex-col">
            {/* Header Admin */}
            <header className="h-16 border-b border-gray-800 bg-gradient-to-r from-red-900/20 to-orange-900/20 backdrop-blur-sm flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-gray-400 hover:text-white" />
                <div>
                  <h1 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Crown className="w-5 h-5 text-orange-400" />
                    {navigation.find(nav => nav.path === currentPageName)?.name || 'Painel Admin'}
                  </h1>
                  <p className="text-sm text-orange-400">Administração do Sistema</p>
                </div>
              </div>

              {/* Botão sair no header também */}
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-red-800/20 gap-2 border border-red-500/20"
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

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
  currentPageName: PropTypes.string
};
