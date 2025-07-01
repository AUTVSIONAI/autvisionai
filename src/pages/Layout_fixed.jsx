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

export default function Layout({ children, currentPageName }) {
  const { signOut, profile, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('🔥 Layout renderizado com currentPageName:', currentPageName);
  }, [currentPageName]);

  // NAVEGAÇÃO PRINCIPAL
  const navigation = [
    {
      name: "Dashboard",
      href: "/client",
      icon: Home,
      path: "client"
    },
    {
      name: "Configurações", 
      href: "/Settings",
      icon: Settings,
      path: "Settings"
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
      name: "Admin",
      href: "/Admin",
      icon: Crown,
      path: "Admin",
      adminOnly: true
    }
  ];

  // FILTRAR ITENS VISÍVEIS
  const visibleItems = navigation.filter(item => {
    if (item.adminOnly && !profile?.isAdmin) {
      return false;
    }
    return true;
  });

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
        <div className="flex h-screen w-full bg-gray-950">
          <Sidebar className="border-r border-gray-800">
            <SidebarHeader className="p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">AutVision</h2>
                  <p className="text-xs text-gray-400">AI Assistant Platform</p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs uppercase tracking-wider text-gray-400">
                  Navegação
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {visibleItems.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                          <Link 
                            to={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                              currentPageName === item.path
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                          >
                            <item.icon className="w-4 h-4" />
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            {isAuthenticated && (
              <SidebarFooter className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full text-white text-sm font-bold">
                    {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-white">
                      {profile?.name || 'Usuário'}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {profile?.tokens || 0} tokens disponíveis
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <Button 
                    onClick={handleSignOut}
                    variant="ghost" 
                    size="sm"
                    className="w-full justify-start gap-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </Button>
                </div>
              </SidebarFooter>
            )}
          </Sidebar>

          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="flex items-center gap-4 p-4 border-b border-gray-800 bg-gray-900/50">
              <SidebarTrigger className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white" />
              <h1 className="text-lg font-semibold text-white">
                {visibleItems.find(item => currentPageName === item.path)?.name || 'AutVision'}
              </h1>
              
              {isAuthenticated && (
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {profile?.tokens || 0} tokens disponíveis
                  </span>
                </div>
              )}
            </header>

            <main className="flex-1 overflow-hidden bg-gray-950">
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
