import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressCardProps {
  label: string;
  value: string;
  unit: string;
  change?: number;
  icon?: React.ReactNode;
}

export function ProgressCard({ label, value, unit, change, icon }: ProgressCardProps) {
  const getTrendIcon = () => {
    if (!change || change === 0) return <Minus className="w-4 h-4" />;
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (!change || change === 0) return "text-muted-foreground";
    if (change > 0) return "text-success";
    return "text-destructive";
  };

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        {icon && (
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-3xl font-bold">{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>

      {change !== undefined && (
        <div className={cn("flex items-center gap-1 text-sm", getTrendColor())}>
          {getTrendIcon()}
          <span>{Math.abs(change)} {unit} desde o último registro</span>
        </div>
      )}
    </div>
  );
}
