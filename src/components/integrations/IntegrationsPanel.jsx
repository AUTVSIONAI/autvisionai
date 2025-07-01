import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Mail, 
  Calendar, 
  MessageCircle, 
  Instagram, 
  Music, 
  Home as HomeIcon,
  Link,
  CheckCircle,
  AlertCircle,
  Clock,
  X
} from "lucide-react";

const integrationIcons = {
  google: Mail,
  microsoft: Calendar,
  whatsapp: MessageCircle,
  instagram: Instagram,
  spotify: Music,
  home_assistant: HomeIcon,
  custom: Link
};

const statusConfig = {
  connected: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-500'
  },
  disconnected: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: X,
    iconColor: 'text-gray-500'
  },
  pending: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    iconColor: 'text-yellow-500'
  },
  error: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: AlertCircle,
    iconColor: 'text-red-500'
  }
};

export default function IntegrationsPanel({ integrations, onConnectIntegration }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Integrações</h3>
        <p className="text-gray-600">Conecte seus serviços favoritos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations?.map((integration, index) => {
          const IconComponent = integrationIcons[integration.type] || Link;
          const statusInfo = statusConfig[integration.status];
          const StatusIcon = statusInfo.icon;
          
          return (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                integration.status === 'connected' 
                  ? 'bg-white border-green-200 shadow-md' 
                  : 'bg-gray-50 border-gray-200 hover:bg-white'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      integration.status === 'connected' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1">
                      <StatusIcon className={`w-4 h-4 ${statusInfo.iconColor}`} />
                    </div>
                  </div>
                  <CardTitle className="text-base font-semibold text-gray-900 mt-2">
                    {integration.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0 space-y-3">
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {integration.description}
                  </p>

                  <Badge className={`${statusInfo.color} border text-xs`}>
                    {integration.status}
                  </Badge>

                  {integration.status === 'connected' && integration.last_sync && (
                    <p className="text-xs text-gray-500">
                      Última sync: {new Date(integration.last_sync).toLocaleDateString()}
                    </p>
                  )}

                  {integration.status !== 'connected' && (
                    <Button
                      onClick={() => onConnectIntegration?.(integration.id)}
                      variant="outline"
                      size="sm"
                      className="w-full hover:bg-blue-50 hover:border-blue-300"
                    >
                      Conectar
                    </Button>
                  )}
                </CardContent>

                {/* Connected indicator */}
                {integration.status === 'connected' && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/5 to-emerald-500/5 pointer-events-none"></div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}