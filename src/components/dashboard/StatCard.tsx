import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
}

const StatCard = ({ title, value, subtitle, icon: Icon, trend }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-5"
  >
    <div className="flex items-start justify-between mb-3">
      <span className="text-sm text-muted-foreground">{title}</span>
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
    </div>
    <p className="text-2xl font-display font-bold text-foreground">{value}</p>
    {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    {trend && (
      <p className={`text-xs mt-2 ${trend.positive ? "text-success" : "text-destructive"}`}>
        {trend.positive ? "↑" : "↓"} {trend.value}
      </p>
    )}
  </motion.div>
);

export default StatCard;
