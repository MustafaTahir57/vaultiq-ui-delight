import { motion } from "framer-motion";
import {
  TrendingUp,
  Clock,
  Users,
  ArrowDownToLine,
  Loader2,
} from "lucide-react";
import StatCard from "./StatCard";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import useConfirmedPool from "@/hooks/dataFetcher/useConfirmedPool";
import useProjectedIncome from "@/hooks/dataFetcher/useProjectedIncome";
import useNextDistribution from "@/hooks/dataFetcher/useNextDistribution";
import usePassiveData from "@/hooks/dataFetcher/usePassiveData";
import useSyncPassivePoolQualification from "@/hooks/dataSender/useSyncPassivePoolQualification";
import { toast } from "sonner";
import { formatUnits } from "viem";
import { useEffect } from "react";

const PassiveIncomeSection = () => {
  const { address, userBranchAddress } = useWallet();
  const {
    confirmedPool,
    confirmedPoolRaw,
    isLoading: confirmedLoading,
  } = useConfirmedPool(address);
  const {
    projectedIncome,
    activeSubs,
    liquidityPercent,
    isLoading: projectedLoading,
  } = useProjectedIncome(address);
  const { days, hours, minutes, seconds, display: nextDist, isLoading: distLoading } =
    useNextDistribution(address);
  const {
    lastWithdrawal,
    totalWithdrawn,
    isQualified,
    isLoading: passiveDataLoading,
  } = usePassiveData(userBranchAddress, address);

  const { sync, isPending: syncing, isConfirming, isConfirmed, isError: syncError, error: syncErrorMsg } =
    useSyncPassivePoolQualification(userBranchAddress);

  useEffect(() => {
    if (isConfirmed) toast.success("Passive pool qualification synced!");
    if (syncError) toast.error(syncErrorMsg?.shortMessage || "Sync failed");
  }, [isConfirmed, syncError, syncErrorMsg]);

  const isLoading =
    confirmedLoading || projectedLoading || distLoading || passiveDataLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Passive Income
        </h1>
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
      <p className="text-muted-foreground text-sm -mt-4">
        Your confirmed and projected passive earnings
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Confirmed Pool"
          value={confirmedPool}
          subtitle="Withdrawable now"
          icon={TrendingUp}
        />
        <StatCard
          title="Projected Income"
          value={projectedIncome}
          subtitle="From active subs"
          icon={TrendingUp}
        />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-sm text-muted-foreground">Next Distribution</span>
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-primary" />
            </div>
          </div>
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
          <p className="text-xs text-muted-foreground mt-1">Countdown</p>
        </motion.div>
        <StatCard
          title="Qualification Status"
          value={isQualified ? "Qualified" : "Not Qualified"}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-foreground">
              Confirmed Passive Pool
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-border/30">
              <span className="text-sm text-muted-foreground">
                Available balance
              </span>
              <span className="text-sm font-medium text-foreground">
                {confirmedPool}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-border/30">
              <span className="text-sm text-muted-foreground">
                Last withdrawal
              </span>
              <span className="text-sm text-muted-foreground">
                {lastWithdrawal}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-sm text-muted-foreground">
                Total withdrawn
              </span>
              <span className="text-sm font-medium text-foreground">
                {totalWithdrawn}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="font-display font-semibold text-foreground mb-6">
            Projected Income Breakdown
          </h3>
          <div className="space-y-4">
            {activeSubs?.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No active subscriptions found
              </p>
            )}
            {activeSubs?.map((sub, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border/30 last:border-0"
              >
                <div>
                  <p className="text-sm text-foreground">
                    Subscription #{i + 1}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Principal: $
                    {parseFloat(
                      formatUnits(sub.principal, 18),
                    ).toLocaleString()}
                  </p>
                </div>
                <span className="text-sm font-medium text-warning">
                  ${parseFloat(formatUnits(sub.projected, 18)).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 italic">
            ⚠ Projected values are estimates based on current weekly rate (
            {liquidityPercent ? `${(liquidityPercent / 100).toFixed(1)}%` : "—"}
            )
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PassiveIncomeSection;
