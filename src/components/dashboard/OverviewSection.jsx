import { Wallet, Users, TrendingUp, DollarSign, PieChart, Layers } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";
import { Progress } from "@/components/ui/progress";
import PoolCard from "./PoolCard";
import { useWallet } from "@/contexts/WalletContext";
import useUserSubscriptions from "@/hooks/dataFetcher/useUserSubscriptions";
import useFeeTreasuryBalances from "@/hooks/dataFetcher/useFeeTreasuryBalances";
import useUserPassiveIncome from "@/hooks/dataFetcher/useUserPassiveIncome";
import { formatUnits } from "viem";

const formatUSD = (bigintValue, decimals = 18) => {
  const num = Number(formatUnits(bigintValue, decimals));
  return `$${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

const recentActivity = [
  { action: "Subscription renewed", branch: "Alpha Branch", status: "active", time: "2h ago" },
  { action: "Pool 2 reward claimed", branch: "VaultIQ Main", status: "claimable", time: "5h ago" },
  { action: "Incubator deposit", branch: "Round #4", status: "pending", time: "1d ago" },
  { action: "Passive income distributed", branch: "Beta Branch", status: "active", time: "2d ago" },
];

const POOL_IDS = [1, 2, 3, 4];

const OverviewSection = () => {
  const { address } = useWallet();
  const { activeCount, totalRewards, isLoading: subsLoading } = useUserSubscriptions(address);
  const { usdcBalance, isLoading: treasuryLoading } = useFeeTreasuryBalances();
  const { totalPassiveQualifiedSales, isQualifiedAny, isLoading: passiveLoading } = useUserPassiveIncome(address);
  const branchAddress = Branch_Address; // TODO: replace with user's actual branch

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Your VaultIQ ecosystem at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Subscriptions"
          value={subsLoading ? "..." : String(activeCount)}
          icon={Users}
          trend={activeCount > 0 ? { value: `${activeCount} active`, positive: true } : undefined}
        />
        <StatCard
          title="Total Rewards"
          value={subsLoading ? "..." : formatUSD(totalRewards)}
          icon={DollarSign}
          subtitle="Accumulated across branches"
        />
        <StatCard
          title="Fee Wallet"
          value={treasuryLoading ? "..." : formatUSD(usdcBalance)}
          subtitle="Protocol treasury (USDC)"
          icon={Wallet}
        />
        <StatCard
          title="Passive Income"
          value={passiveLoading ? "..." : formatUSD(totalPassiveQualifiedSales)}
          subtitle={isQualifiedAny ? "Qualified" : "Not yet qualified"}
          icon={TrendingUp}
        />
      </div>

      {/* Pools + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pools */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Pools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {POOL_IDS.map((poolId, i) => (
              <PoolCard
                key={poolId}
                poolId={poolId}
                userAddress={address}
                branchAddress={branchAddress}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2 mb-4">
            <PieChart className="h-4 w-4 text-primary" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{item.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{item.branch}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OverviewSection;
