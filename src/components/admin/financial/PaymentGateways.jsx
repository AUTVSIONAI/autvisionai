import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  CreditCard,
  Settings,
  Key
} from "lucide-react";

const mockGateways = [
  {
    id: 1,
    name: 'Stripe',
    type: 'stripe',
    is_active: true,
    is_sandbox: false,
    fees: { percentage: 2.9, fixed: 0.30 },
    supported_methods: ['credit_card', 'debit_card'],
    last_sync: '2023-10-28T10:00:00Z'
  },
  {
    id: 2,
    name: 'Mercado Pago',
    type: 'mercado_pago',
    is_active: true,
    is_sandbox: true,
    fees: { percentage: 3.99, fixed: 0 },
    supported_methods: ['credit_card', 'debit_card', 'pix'],
    last_sync: '2023-10-28T09:30:00Z'
  },
  {
    id: 3,
    name: 'PIX Brasileiro',
    type: 'pix',
    is_active: false,
    is_sandbox: false,
    fees: { percentage: 0, fixed: 0 },
    supported_methods: ['pix'],
    last_sync: null
  }
];

export default function PaymentGateways() {
  const [gateways] = useState(mockGateways);
  const [showForm, setShowForm] = useState(false);

  const getStatusBadge = (gateway) => {
    if (gateway.is_active) {
      return gateway.is_sandbox ? 
        <Badge className="bg-yellow-500 text-white">Teste</Badge> :
        <Badge className="bg-green-500 text-white">Produção</Badge>;
    }
    return <Badge variant="secondary" className="bg-gray-500 text-white">Inativo</Badge>;
  };

  const getGatewayIcon = (type) => {
    const icons = {
      stripe: '💳',
      mercado_pago: '💰',
      pix: '🏦',
      asaas: '💼',
      pagarme: '🔷'
    };
    return icons[type] || '💳';
  };

  return (
    <div className="admin-full-width w-full max-w-none">
      <Card className="bg-gray-800/50 border-gray-700 w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Gateways de Pagamento
        </CardTitle>
        <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
          <PlusCircle className="w-4 h-4 mr-2" />
          Novo Gateway
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="p-6 mb-6 bg-gray-700/50 rounded-lg space-y-4 border border-gray-600">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configurar Gateway
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Nome do Gateway" className="bg-gray-800 border-gray-600 text-white" />
              <select className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white">
                <option value="">Selecione o tipo</option>
                <option value="stripe">Stripe</option>
                <option value="mercado_pago">Mercado Pago</option>
                <option value="pix">PIX</option>
                <option value="asaas">Asaas</option>
                <option value="pagarme">PagarMe</option>
              </select>
              
              <Input placeholder="API Key" type="password" className="bg-gray-800 border-gray-600 text-white" />
              <Input placeholder="Secret Key" type="password" className="bg-gray-800 border-gray-600 text-white" />
              
              <Input placeholder="Webhook URL" className="bg-gray-800 border-gray-600 text-white" />
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 text-white">
                  <Switch />
                  <span>Modo Sandbox</span>
                </label>
                <label className="flex items-center space-x-2 text-white">
                  <Switch />
                  <span>Ativo</span>
                </label>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Salvar Gateway
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="border-gray-600 text-white hover:bg-gray-600">
                Cancelar
              </Button>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-800/50">
                <TableHead className="text-white">Gateway</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Taxas</TableHead>
                <TableHead className="text-white">Métodos</TableHead>
                <TableHead className="text-white">Última Sinc.</TableHead>
                <TableHead className="text-white">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gateways.map((gateway) => (
                <TableRow key={gateway.id} className="border-gray-700 hover:bg-gray-800/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getGatewayIcon(gateway.type)}</span>
                      <div>
                        <p className="font-medium text-gray-100">{gateway.name}</p>
                        <p className="text-sm text-gray-400 capitalize">{gateway.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(gateway)}</TableCell>
                  <TableCell className="text-gray-300">
                    {gateway.fees.percentage}% + R$ {gateway.fees.fixed.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {gateway.supported_methods.slice(0, 2).map(method => (
                        <Badge key={method} variant="outline" className="text-xs border-gray-500 text-gray-300">
                          {method.replace('_', ' ')}
                        </Badge>
                      ))}
                      {gateway.supported_methods.length > 2 && (
                        <Badge variant="outline" className="text-xs border-gray-500 text-gray-400">
                          +{gateway.supported_methods.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {gateway.last_sync ? 
                      new Date(gateway.last_sync).toLocaleString('pt-BR') : 
                      'Nunca'
                    }
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Key className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
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