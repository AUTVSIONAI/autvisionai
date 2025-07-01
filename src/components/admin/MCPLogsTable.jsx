import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";

export default function MCPLogsTable({ commands, getStatusBadge }) {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <FileText className="w-5 h-5" />
          Logs de Execução MCP
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-white">Comando</TableHead>
                <TableHead className="text-white">Agente</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Tempo</TableHead>
                <TableHead className="text-white">Timestamp</TableHead>
                <TableHead className="text-white">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commands.map((command) => (
                <TableRow key={command.id} className="border-gray-700 hover:bg-gray-700/50">
                  <TableCell className="font-medium text-gray-300">
                    {command.command}
                  </TableCell>
                  <TableCell className="text-gray-400 capitalize">
                    {command.agent_type.replace('_', ' ')}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(command.status)}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {command.execution_time ? `${command.execution_time}s` : '-'}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(command.timestamp).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}