import { Wallet, Users, TrendingUp, DollarSign, PieChart, Layers } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";
import { Progress } from "@/components/ui/progress";
import PoolCard from "./PoolCard";
import { Branch_Address } from "@/constants/contracts";
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

const pools = [
  { name: "Pool 1", distribution: "$2,400", members: 45, threshold: "$500", unlocked: true, fill: 82 },
  { name: "Pool 2", distribution: "$4,800", members: 32, threshold: "$1,000", unlocked: true, fill: 64 },
  { name: "Pool 3", distribution: "$8,200", members: 18, threshold: "$2,500", unlocked: false, fill: 38 },
  { name: "Pool 4", distribution: "$15,000", members: 8, threshold: "$5,000", unlocked: false, fill: 15 },
];

const OverviewSection = () => {
  const { address } = useWallet();
  const { activeCount, totalRewards, isLoading: subsLoading } = useUserSubscriptions(address);
  const { usdcBalance, isLoading: treasuryLoading } = useFeeTreasuryBalances();
  const { totalPassiveQualifiedSales, isQualifiedAny, isLoading: passiveLoading } = useUserPassiveIncome(address);

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
            {pools.map((pool, i) => (
              <motion.div
                key={pool.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-hover p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${pool.unlocked ? "bg-primary/10" : "bg-secondary"}`}>
                      {pool.unlocked ? <Unlock className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-foreground text-sm">{pool.name}</h4>
                      <span className={`text-xs ${pool.unlocked ? "text-success" : "text-muted-foreground"}`}>
                        {pool.unlocked ? "Unlocked" : "Locked"}
                      </span>
                    </div>
                  </div>
                  <span className="text-base font-display font-bold text-foreground">{pool.distribution}</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Qualification</span>
                      <span>{pool.fill}%</span>
                    </div>
                    <Progress value={pool.fill} className="h-2 bg-secondary [&>div]:bg-primary" />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> {pool.members}</span>
                    <span className="text-muted-foreground">Threshold: {pool.threshold}</span>
                  </div>
                </div>
              </motion.div>
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
