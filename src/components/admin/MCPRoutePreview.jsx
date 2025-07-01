import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bot, Zap } from "lucide-react";

export default function MCPRoutePreview() {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <ArrowRight className="w-5 h-5" />
          Rota MCP Ativa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-400 mt-1">Vision</span>
              </div>
              
              <ArrowRight className="w-4 h-4 text-gray-500" />
              
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-400 mt-1">Agente</span>
              </div>
              
              <ArrowRight className="w-4 h-4 text-gray-500" />
              
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-400 mt-1">Execução</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-sm text-gray-300">
              <strong>Última rota:</strong> Vision → Weather Agent → OpenWeather API
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Executado há 5 minutos • Tempo: 1.2s • Status: Sucesso
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}