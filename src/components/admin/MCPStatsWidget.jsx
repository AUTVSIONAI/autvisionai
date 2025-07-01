import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function MCPStatsWidget({ title, value, icon: Icon, color }) {
  const colors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    emerald: 'text-emerald-400',
    cyan: 'text-cyan-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">{title}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
            <Icon className={`w-8 h-8 ${colors[color]}`} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}