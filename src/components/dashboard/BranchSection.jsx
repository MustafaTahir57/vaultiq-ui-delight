import { motion } from "framer-motion";
import { GitBranch, Wallet, Settings2, BarChart3, Users, Calendar, Loader2 } from "lucide-react";
import StatCard from "./StatCard";
import { Progress } from "@/components/ui/progress";
import useBranchStats from "@/hooks/dataFetcher/useBranchStats";
import { useWallet } from "@/contexts/WalletContext";

const BranchSection = () => {
  const { userBranchAddress } = useWallet();
  const stats = useBranchStats(userBranchAddress || undefined);

  const wallets = [
    { label: "Trading Wallet", desc: "USDT held by branch contract", value: stats.tradingWalletBalance, pct: 0 },
    { label: "Branch Wallet", desc: "USDT held by branch wallet", value: stats.branchWalletBalance, pct: 0 },
    { label: "Passive Income Pool", desc: "Passive income allocation", value: "$0", pct: 0 },
  ];

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
        <StatCard title="Total Distributed" value="$0" icon={Wallet} />
        <StatCard title="Current Week" value={stats.currentWeek} icon={Calendar} />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Wallet Balances
          {stats.isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </h3>
        <div className="space-y-5">
          {wallets.map((w) => (
            <div key={w.label}>
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="text-sm text-foreground">{w.label}</span>
                  <p className="text-xs text-muted-foreground">{w.desc}</p>
                </div>
                <span className="text-sm font-medium text-foreground font-mono">{w.value}</span>
              </div>
              <Progress value={w.pct} className="h-2 bg-secondary [&>div]:bg-primary" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BranchSection;
