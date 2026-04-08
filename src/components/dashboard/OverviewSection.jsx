import { Users, TrendingUp, DollarSign, Layers, Clock } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "./StatCard";
import PoolCard from "./PoolCard";
import { useWallet } from "@/contexts/WalletContext";
import useUserSubscriptions from "@/hooks/dataFetcher/useUserSubscriptions";
import useNextDistribution from "@/hooks/dataFetcher/useNextDistribution";
import { formatUnits } from "viem";

const formatUSD = (bigintValue, decimals = 18) => {
  const num = Number(formatUnits(bigintValue, decimals));
  return `$${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

const POOL_IDS = [1, 2, 3, 4];

const OverviewSection = () => {
  const { address, userBranchAddress } = useWallet();
  const { activeCount, totalRewards, isLoading: subsLoading } = useUserSubscriptions(address);
  const { days, hours, minutes, seconds, isLoading: distLoading } = useNextDistribution(address, "week");
  const branchAddress = userBranchAddress;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Your VaultIQ ecosystem at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-sm text-muted-foreground">Next Week In</span>
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-primary" />
            </div>
          </div>
          {distLoading ? (
            <p className="text-2xl font-display font-bold text-foreground">...</p>
          ) : (
            <div className="flex items-center gap-2">
              {[
                { val: days ?? 0, label: "d" },
                { val: hours ?? 0, label: "h" },
                { val: minutes ?? 0, label: "m" },
                { val: seconds ?? 0, label: "s" },
              ].map((unit) => (
                <div key={unit.label} className="flex items-baseline gap-0.5">
                  <span className="text-2xl font-display font-bold text-foreground tabular-nums">
                    {String(unit.val).padStart(2, "0")}
                  </span>
                  <span className="text-xs text-primary font-semibold">{unit.label}</span>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">Weekly countdown</p>
        </motion.div>
      </div>

      {/* Pools */}
      <div className="space-y-4">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          Pools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
    </div>
  );
};

export default OverviewSection;
