import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileDown } from "lucide-react";

const mockTransactions = [
  { id: 'txn_1', user_email: 'user1@example.com', type: 'subscription', amount: 99.90, status: 'completed', gateway: 'Stripe', date: '2023-10-28T10:00:00Z' },
  { id: 'txn_2', user_email: 'user2@example.com', type: 'token_purchase', amount: 50.00, status: 'completed', gateway: 'Mercado Pago', date: '2023-10-28T11:30:00Z' },
  { id: 'txn_3', user_email: 'user3@example.com', type: 'payment', amount: 25.50, status: 'pending', gateway: 'Pix', date: '2023-10-28T12:00:00Z' },
  { id: 'txn_4', user_email: 'user1@example.com', type: 'refund', amount: -99.90, status: 'refunded', gateway: 'Stripe', date: '2023-10-27T15:00:00Z' },
  { id: 'txn_5', user_email: 'user4@example.com', type: 'subscription', amount: 199.90, status: 'failed', gateway: 'Stripe', date: '2023-10-27T14:00:00Z' },
];

export default function TransactionsTable() {
  const [transactions] = useState(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (status) => {
    const configs = {
      completed: "bg-green-500",
      pending: "bg-yellow-500",
      failed: "bg-red-500",
      refunded: "bg-gray-500",
      cancelled: "bg-orange-500",
    };
    return <Badge className={`${configs[status]} text-white capitalize`}>{status}</Badge>;
  };

  const filteredTransactions = transactions.filter(t =>
    t.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-full-width w-full max-w-none">
      <Card className="bg-gray-800/50 border-gray-700 w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-white">Histórico de Transações</CardTitle>
            <p className="text-gray-400 text-sm mt-1">Visualize todos os movimentos financeiros da plataforma.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por usuário ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 w-full md:w-64"
              />
            </div>
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
              <FileDown className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-800/50">
                <TableHead className="text-white">Usuário</TableHead>
                <TableHead className="text-white">Tipo</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Valor</TableHead>
                <TableHead className="text-white">Gateway</TableHead>
                <TableHead className="text-white">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id} className="border-gray-700 hover:bg-gray-800/50">
                  <TableCell className="font-medium text-gray-300">{tx.user_email}</TableCell>
                  <TableCell className="capitalize text-gray-300">{tx.type.replace('_', ' ')}</TableCell>
                  <TableCell>{getStatusBadge(tx.status)}</TableCell>
                  <TableCell className={`font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    R$ {tx.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-gray-300">{tx.gateway}</TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {new Date(tx.date).toLocaleString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}