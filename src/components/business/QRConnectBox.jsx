
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  QrCode, 
  Smartphone, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Loader2,
  Wifi
} from "lucide-react";

export default function QRConnectBox({ 
  status = "disconnected", 
  onConnect, 
  onDisconnect, 
  onRefresh,
  whatsappConfig = {} // Nova prop para dados reais
}) {
  const [qrCode, setQrCode] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Usar status real se disponível
  const realStatus = whatsappConfig?.status || status;

  // Mock QR code generation com dados mais realistas
  const generateQRCode = async () => {
    setIsGenerating(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock QR code data - in real implementation, this would come from WhatsApp Web API
    const mockQRData = `whatsapp://connect?token=${Date.now()}&business_id=autvision_${Math.random().toString(36).substr(2, 9)}`;
    setQrCode(mockQRData);
    setIsGenerating(false);
  };

  useEffect(() => {
    if (realStatus === "connecting" && !qrCode) {
      generateQRCode();
    }
  }, [realStatus, qrCode]); // Add qrCode to dependencies to avoid unnecessary re-runs

  const getStatusConfig = () => {
    switch (realStatus) {
      case "connected":
        return {
          color: "text-green-600",
          bgColor: "bg-green-50 border-green-200",
          icon: CheckCircle,
          title: "WhatsApp Conectado",
          subtitle: whatsappConfig.phone_number ? 
            `Conectado em ${whatsappConfig.phone_number}` : 
            "Seu agente está ativo e pronto para atender!"
        };
      case "connecting":
        return {
          color: "text-blue-600",
          bgColor: "bg-blue-50 border-blue-200", 
          icon: Loader2,
          title: "Conectando WhatsApp",
          subtitle: "Escaneie o QR Code com seu celular"
        };
      case "error":
        return {
          color: "text-red-600",
          bgColor: "bg-red-50 border-red-200",
          icon: AlertCircle,
          title: "Erro na Conexão",
          subtitle: "Não foi possível conectar. Tente novamente."
        };
      default: // disconnected
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-50 border-gray-200",
          icon: Smartphone,
          title: "WhatsApp Desconectado", 
          subtitle: "Conecte seu número do WhatsApp para começar"
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <Card className={`${statusConfig.bgColor} border-2 transition-all duration-300`}>
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center ${statusConfig.color}`}>
            <StatusIcon className={`w-8 h-8 ${realStatus === "connecting" ? "animate-spin" : ""}`} />
          </div>
        </div>
        <CardTitle className={`text-xl ${statusConfig.color}`}>
          {statusConfig.title}
        </CardTitle>
        <p className="text-gray-600 text-sm">
          {statusConfig.subtitle}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        
        {/* QR Code Display */}
        <AnimatePresence>
          {(realStatus === "connecting" || realStatus === "disconnected") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex justify-center"
            >
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100">
                {isGenerating ? (
                  <div className="w-48 h-48 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-sm text-gray-600">Gerando QR Code...</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Mock QR Code Visual */}
                    {/* In a real scenario, this would be an actual QR code image generated from `qrCode` data */}
                    <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <QrCode className="w-32 h-32 text-gray-800 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">QR Code do WhatsApp</p>
                      </div>
                    </div>
                    
                    {/* Scanning Animation Overlay */}
                    {realStatus === "connecting" && (
                      <div className="absolute inset-0 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Wifi className="w-8 h-8 text-blue-600 animate-pulse mx-auto mb-2" />
                          <p className="text-xs text-blue-600 font-medium">Aguardando escaneamento...</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        {realStatus === "connecting" && (
          <div className="bg-white/50 p-4 rounded-xl">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">Como conectar:</h4>
            <ol className="text-xs text-gray-600 space-y-1">
              <li>1. Abra o WhatsApp no seu celular</li>
              <li>2. Toque em "Mais opções" (⋮) no Android ou "Configurações" no iPhone</li>
              <li>3. Toque em "Aparelhos conectados"</li>
              <li>4. Toque em "Conectar um aparelho"</li>
              <li>5. Aponte a câmera para este QR code</li>
            </ol>
          </div>
        )}

        {/* Connection Status */}
        {realStatus === "connected" && (
          <div className="bg-white/50 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-green-800 text-sm">Status da Conexão</p>
                <p className="text-xs text-green-600">✓ Ativo desde {whatsappConfig.last_connected_at || 'hoje às 14:30'}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {realStatus === "disconnected" && (
            <Button
              onClick={onConnect}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Conectar WhatsApp
            </Button>
          )}
          
          {realStatus === "connecting" && (
            <Button
              onClick={onRefresh}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Novo QR Code
            </Button>
          )}
          
          {realStatus === "connected" && (
            <Button
              onClick={onDisconnect}
              variant="destructive"
              className="flex-1"
            >
              Desconectar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
