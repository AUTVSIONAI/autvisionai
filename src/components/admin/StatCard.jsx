import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PropTypes from 'prop-types';

export default function StatCard({ title, value, icon: Icon, color, description }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 text-blue-100 border-blue-400/30',
    green: 'from-green-500 to-green-600 text-green-100 border-green-400/30',
    teal: 'from-teal-500 to-teal-600 text-teal-100 border-teal-400/30',
    orange: 'from-orange-500 to-orange-600 text-orange-100 border-orange-400/30',
    sky: 'from-sky-500 to-sky-600 text-sky-100 border-sky-400/30',
    cyan: 'from-cyan-500 to-cyan-600 text-cyan-100 border-cyan-400/30',
    purple: 'from-purple-500 to-purple-600 text-purple-100 border-purple-400/30',
    red: 'from-red-500 to-red-600 text-red-100 border-red-400/30',
  };

  return (
    <Card className={`bg-gradient-to-br ${colorClasses[color] || colorClasses.blue} backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium opacity-90">
          <Icon className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <span className="text-2xl font-bold">{value}</span>
          {description && (
            <span className="text-xs opacity-75 mt-1">{description}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
  description: PropTypes.string,
};
