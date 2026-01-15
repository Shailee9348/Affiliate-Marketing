"use client";

import Card from "@/components/ui/Card";
import Icon from "@/components/Icon";

const KPICard = ({ 
  title, 
  value, 
  trend, 
  trendLabel = "vs last month", 
  icon, 
  color = "primary",
  loading = false 
}) => {
  // Determine trend color
  const isPositive = trend >= 0;
  const trendColor = isPositive ? "text-success" : "text-error";
  const TrendIcon = isPositive ? "TrendingUp" : "TrendingDown";

  // Map color prop to Tailwind classes
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
    info: "bg-info/10 text-info",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
  };

  const iconClass = colorMap[color] || colorMap.primary;

  if (loading) {
    return (
      <Card className="h-full">
        <div className="flex items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-base-300"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-base-300 rounded w-1/2"></div>
            <div className="h-6 bg-base-300 rounded w-3/4"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 border border-base-200/50">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium text-base-content/60">{title}</h3>
          <div className="text-2xl font-bold text-base-content tracking-tight">{value}</div>
        </div>
        <div className={`p-3 rounded-xl ${iconClass} shadow-sm`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
      
      {trend !== undefined && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          <span className={`flex items-center gap-1 font-semibold ${trendColor} bg-base-100 px-1.5 py-0.5 rounded-md border border-base-200`}>
            <Icon name={TrendIcon} size={12} />
            {Math.abs(trend)}%
          </span>
          <span className="text-base-content/50">{trendLabel}</span>
        </div>
      )}
    </Card>
  );
};

export default KPICard;