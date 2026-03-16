import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Zap, BarChart3, Loader2 } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import useModelAProjection from "@/hooks/dataFetcher/useModelAProjection";
import AnimNum from "./AnimNum";

const ModelACard = ({ sub, index }) => {
  const { address } = useWallet();
  const { projection, isLoading } = useModelAProjection(address, sub.index);

  if (isLoading) {
    return (
      <div className="glass-card p-5 flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading subscription #{index + 1}...</span>
      </div>
    );
  }

  if (!projection) return null;

  const progressPct = Math.min(
    100,
    (projection.elapsedWeeks / projection.totalWeeks) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card-hover p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
            <span className="font-display text-sm font-bold text-primary">
              #{index + 1}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Model A — Subscription #{index + 1}
            </p>
            <p className="text-xs text-muted-foreground">
              Weekly rate: {projection.weeklyRatePercent.toFixed(2)}%
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-[hsl(var(--success))] border border-[hsl(var(--success)/0.2)]">
          Active
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>
            Week {projection.elapsedWeeks} / {projection.totalWeeks}
          </span>
          <span>{projection.remainingWeeks} weeks remaining</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(35,100%,60%)]"
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/50 rounded-xl p-4 space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <DollarSign className="h-3 w-3" /> Principal
          </p>
          <p className="text-lg font-display font-bold text-foreground">
            <AnimNum value={projection.principal} prefix="$" />
          </p>
        </div>
        <div className="bg-muted/50 rounded-xl p-4 space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Earned So Far
          </p>
          <p className="text-lg font-display font-bold text-[hsl(var(--success))]">
            <AnimNum value={projection.totalEarned} prefix="$" />
          </p>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/15 rounded-xl p-4 space-y-1">
          <p className="text-xs text-primary/80 flex items-center gap-1">
            <Zap className="h-3 w-3" /> PTR (Projected Rewards)
          </p>
          <p className="text-lg font-display font-bold gradient-text">
            <AnimNum value={projection.PTR} prefix="$" />
          </p>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/15 rounded-xl p-4 space-y-1">
          <p className="text-xs text-primary/80 flex items-center gap-1">
            <BarChart3 className="h-3 w-3" /> PTG (Total Growth)
          </p>
          <p className="text-lg font-display font-bold gradient-text">
            <AnimNum value={projection.PTG} prefix="+" suffix="%" />
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ModelACard;
