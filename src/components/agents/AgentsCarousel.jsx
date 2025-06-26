import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { 
  Heart, 
  DollarSign, 
  Home, 
  Users, 
  Briefcase, 
  Gamepad2, 
  Plane, 
  GraduationCap,
  Crown,
  Zap,
  TrendingUp
} from "lucide-react";

const agentIcons = {
  health: Heart,
  finance: DollarSign,
  home: Home,
  social: Users,
  work: Briefcase,
  entertainment: Gamepad2,
  travel: Plane,
  education: GraduationCap
};

const planColors = {
  free: "bg-green-100 text-green-800",
  premium: "bg-blue-100 text-blue-800",
  enterprise: "bg-purple-100 text-purple-800"
};

export default function AgentsCarousel({ agents, onToggleAgent }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Seus Agentes IA</h3>
        <p className="text-gray-600">Especializados para cada área da sua vida</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents?.map((agent, index) => {
          const IconComponent = agentIcons[agent.type] || Zap;
          
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                agent.is_active 
                  ? 'bg-white border-blue-200 shadow-lg' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                {/* Premium badge */}
                {agent.plan_required !== 'free' && (
                  <div className="absolute top-3 right-3">
                    <Badge className={`${planColors[agent.plan_required]} border-0`}>
                      {agent.plan_required === 'enterprise' && <Crown className="w-3 h-3 mr-1" />}
                      {agent.plan_required}
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      agent.is_active 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <Switch
                      checked={agent.is_active}
                      onCheckedChange={() => onToggleAgent?.(agent.id)}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900 mt-3">
                    {agent.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {agent.description}
                  </p>

                  {/* Capabilities */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">CAPACIDADES</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.capabilities?.slice(0, 3).map((capability, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs px-2 py-1">
                            {capability}
                          </Badge>
                        ))}
                        {agent.capabilities?.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            +{agent.capabilities.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Usage stats */}
                    {agent.usage_count > 0 && (
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Uso total</span>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span className="font-medium">{agent.usage_count}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>

                {/* Active glow effect */}
                {agent.is_active && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none"></div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

AgentsCarousel.propTypes = {
  agents: PropTypes.array.isRequired,
  onToggleAgent: PropTypes.func.isRequired
};