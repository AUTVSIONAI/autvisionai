import React, { useState } from "react";
import { Business } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Building2, 
  Clock, 
  MessageSquare, 
  Globe,
  ArrowRight,
  CheckCircle,
  Sparkles
} from "lucide-react";

const businessCategories = [
  { value: "restaurant", label: "🍕 Restaurante / Lanchonete" },
  { value: "store", label: "🛍️ Loja / Comércio" },
  { value: "clinic", label: "🏥 Clínica / Consultório" },
  { value: "salon", label: "💄 Salão de Beleza" },
  { value: "gym", label: "🏋️ Academia / Fitness" },
  { value: "hotel", label: "🏨 Hotel / Pousada" },
  { value: "pharmacy", label: "💊 Farmácia" },
  { value: "automotive", label: "🚗 Oficina / Automotive" },
  { value: "education", label: "📚 Educação / Curso" },
  { value: "other", label: "🏢 Outros" }
];

const languages = [
  { value: "pt-BR", label: "🇧🇷 Português (Brasil)" },
  { value: "en-US", label: "🇺🇸 English (US)" },
  { value: "es-ES", label: "🇪🇸 Español" },
  { value: "fr-FR", label: "🇫🇷 Français" }
];

const timeSlots = [
  "Fechado",
  "08:00 - 18:00",
  "09:00 - 17:00",
  "10:00 - 22:00",
  "24 horas"
];

export default function BusinessOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    business_name: "",
    category: "",
    description: "",
    business_hours: {
      monday: "08:00 - 18:00",
      tuesday: "08:00 - 18:00",
      wednesday: "08:00 - 18:00",
      thursday: "08:00 - 18:00",
      friday: "08:00 - 18:00",
      saturday: "08:00 - 18:00",
      sunday: "Fechado"
    },
    agent_config: {
      keyword_trigger: "oi",
      language: "pt-BR"
    }
  });

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await Business.create({
        ...formData,
        stats: {
          total_customers: 0,
          messages_sent: 0,
          positive_feedback: 0,
          peak_hours: []
        },
        whatsapp_config: {
          status: "disconnected"
        }
      });
      
      // Redirect to agent config
      navigate(createPageUrl("BusinessAgentConfig"));
    } catch (error) {
      console.error("Erro ao criar negócio:", error);
    }
    setIsSubmitting(false);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 p-4 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Configure seu Negócio
          </h1>
          <p className="text-gray-600 text-lg">
            Vamos criar seu assistente inteligente para WhatsApp em poucos passos
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-400 border-gray-300'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 rounded-full ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Informações Básicas */}
          {currentStep === 1 && (
            <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  Informações do Negócio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="business_name">Nome do Negócio *</Label>
                    <Input
                      id="business_name"
                      value={formData.business_name}
                      onChange={(e) => handleInputChange('business_name', e.target.value)}
                      placeholder="Ex: Pizzaria do João"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoria *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Descrição do Negócio</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Descreva seu negócio, produtos/serviços principais..."
                    className="mt-2 h-24"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Horários de Funcionamento */}
          {currentStep === 2 && (
            <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Clock className="w-6 h-6 text-blue-600" />
                  Horários de Atendimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(formData.business_hours).map(([day, time]) => (
                  <div key={day} className="grid grid-cols-2 gap-4 items-center">
                    <Label className="capitalize font-medium">
                      {day === 'monday' ? 'Segunda' :
                       day === 'tuesday' ? 'Terça' :
                       day === 'wednesday' ? 'Quarta' :
                       day === 'thursday' ? 'Quinta' :
                       day === 'friday' ? 'Sexta' :
                       day === 'saturday' ? 'Sábado' : 'Domingo'}
                    </Label>
                    <Select
                      value={time}
                      onValueChange={(value) => handleInputChange(`business_hours.${day}`, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Configurações do Agente */}
          {currentStep === 3 && (
            <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                  Configurações Iniciais do Agente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="keyword_trigger">Palavra-chave de Ativação</Label>
                    <Input
                      id="keyword_trigger"
                      value={formData.agent_config.keyword_trigger}
                      onChange={(e) => handleInputChange('agent_config.keyword_trigger', e.target.value)}
                      placeholder="oi, olá, menu..."
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Palavra que ativa o atendimento automático
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="language">Idioma do Agente</Label>
                    <Select
                      value={formData.agent_config.language}
                      onValueChange={(value) => handleInputChange('agent_config.language', value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Próximos Passos</h3>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Após criar seu negócio, você poderá personalizar completamente seu agente, 
                    conectar o WhatsApp e começar a atender clientes automaticamente!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={prevStep}
            variant="outline"
            disabled={currentStep === 1}
            className="px-6"
          >
            Voltar
          </Button>
          
          {currentStep < 3 ? (
            <Button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && (!formData.business_name || !formData.category))
              }
              className="px-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
            >
              Próximo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Criando...
                </>
              ) : (
                <>
                  Criar Negócio
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}