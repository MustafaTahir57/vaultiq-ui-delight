import { motion } from "framer-motion";
import { GitBranch, Wallet, Settings2, BarChart3, Users, Calendar, Loader2, Building2, Landmark } from "lucide-react";
import StatCard from "./StatCard";
import useBranchStats from "@/hooks/dataFetcher/useBranchStats";
import useTotalDistributed from "@/hooks/dataFetcher/useTotalDistributed";
import { useWallet } from "@/contexts/WalletContext";

const BranchSection = () => {
  const { userBranchAddress } = useWallet();
  const stats = useBranchStats(userBranchAddress || undefined);
  const { totalDistributed } = useTotalDistributed(userBranchAddress || undefined);

  const isBranchMode = stats.liquidityType === 0;
  const modeLabel = isBranchMode ? "Branch Mode" : stats.liquidityType === 1 ? "Treasury Mode" : "—";
  const ModeIcon = isBranchMode ? Building2 : Landmark;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Branch Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your branch configuration & performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Members" value={stats.totalMembers} icon={Users} />
        <StatCard title="Weekly Performance" value={stats.weeklyPerformance} icon={BarChart3} />
        <StatCard title="Total Distributed" value={totalDistributed} icon={Wallet} />
        <StatCard title="Current Week" value={stats.currentWeek} icon={Calendar} />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Total Liquidity
            {stats.isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </h3>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-border bg-secondary/50 text-foreground">
            <ModeIcon className="h-3.5 w-3.5 text-primary" />
            {modeLabel}
          </span>
        </div>
        <p className="text-3xl font-bold font-mono text-foreground">{stats.totalLiquidity}</p>
        <p className="text-xs text-muted-foreground mt-1">USDT held by branch contract</p>
      </motion.div>
    </div>
  );
};

export default BranchSection;
