import { Wallet, Users, TrendingUp, DollarSign, Layers } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";

import PoolCard from "./PoolCard";
import { useWallet } from "@/contexts/WalletContext";
import useUserSubscriptions from "@/hooks/dataFetcher/useUserSubscriptions";

import useUserPassiveIncome from "@/hooks/dataFetcher/useUserPassiveIncome";
import { formatUnits } from "viem";

const formatUSD = (bigintValue, decimals = 18) => {
  const num = Number(formatUnits(bigintValue, decimals));
  return `$${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};


const POOL_IDS = [1, 2, 3, 4];

const OverviewSection = () => {
  const { address, userBranchAddress } = useWallet();
  const { activeCount, totalRewards, isLoading: subsLoading } = useUserSubscriptions(address);
  const { usdcBalance, isLoading: treasuryLoading } = useFeeTreasuryBalances();
  const { totalPassiveQualifiedSales, isQualifiedAny, isLoading: passiveLoading } = useUserPassiveIncome(address);
  const branchAddress = userBranchAddress;

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
