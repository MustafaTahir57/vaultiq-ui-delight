import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  ArrowDownToLine,
  Loader2,
  RefreshCw,
} from "lucide-react";
import StatCard from "./StatCard";
import CountdownTimer from "./CountdownTimer";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import useConfirmedPool from "@/hooks/dataFetcher/useConfirmedPool";
import useProjectedIncome from "@/hooks/dataFetcher/useProjectedIncome";
import usePassiveData from "@/hooks/dataFetcher/usePassiveData";
import useReferralData from "@/hooks/dataFetcher/useReferralData";
import usePassiveSalesThreshold from "@/hooks/dataFetcher/usePassiveSalesThreshold";
import useUserSubscriptions from "@/hooks/dataFetcher/useUserSubscriptions";
import useSyncPassivePoolQualification from "@/hooks/dataSender/useSyncPassivePoolQualification";
import useClaimPassivePool from "@/hooks/dataSender/useClaimPassivePool";
import { toast } from "sonner";
import { formatUnits } from "viem";

const PassiveIncomeSection = () => {
  const { address, userBranchAddress } = useWallet();
  const {
    confirmedPool,
    confirmedPoolRaw,
    isLoading: confirmedLoading,
  } = useConfirmedPool(address);
  const {
    projectedIncome,
    isLoading: projectedLoading,
  } = useProjectedIncome(address);
  const {
    subscriptions,
    activeCount: activeSubCount,
    isLoading: subsLoading,
  } = useUserSubscriptions(address);
  const activeSubscriptions = subscriptions?.filter((s) => s.isActive) ?? [];
  const { days, hours, minutes, seconds, display: nextDist, isLoading: distLoading } =
    useNextDistribution(address);
  const {
    lastWithdrawal,
    totalWithdrawn,
    isQualified,
    isLoading: passiveDataLoading,
    refetch: refetchPassiveData,
  } = usePassiveData(userBranchAddress, address);

  const { referralData, isLoading: referralLoading } = useReferralData(userBranchAddress, address);

  const { passiveSalesThreshold } = usePassiveSalesThreshold(userBranchAddress);

  const {
    sync,
    isPending: syncing,
    isConfirming,
    isConfirmed,
    isError: syncError,
    error: syncErrorMsg,
  } = useSyncPassivePoolQualification(userBranchAddress);

  const {
    claim: claimPassive,
    isPending: claimPending,
    isConfirming: claimConfirming,
    isConfirmed: claimConfirmed,
    isError: claimError,
    error: claimErrorMsg,
  } = useClaimPassivePool(userBranchAddress);

  // Determine if sync conditions are met
  const pool3Depth3PlusCount = referralData?.pool3Depth3PlusCount ?? 0;
  const totalTeamSalesRaw = referralData?.totalTeamSalesRaw ?? BigInt(0);
  const threshold = passiveSalesThreshold ?? BigInt(0);
  const meetsDepthRequirement = pool3Depth3PlusCount > 0;
  const meetsSalesRequirement = threshold > BigInt(0) && totalTeamSalesRaw >= threshold;
  const canSync = meetsDepthRequirement && meetsSalesRequirement && !isQualified;

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Passive pool qualification synced!");
      refetchPassiveData?.();
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (syncError) toast.error(syncErrorMsg?.shortMessage || "Sync failed");
  }, [syncError, syncErrorMsg]);

  useEffect(() => {
    if (claimConfirmed) {
      toast.success("Passive pool claimed successfully!");
      refetchPassiveData?.();
    }
  }, [claimConfirmed]);

  useEffect(() => {
    if (claimError) toast.error(claimErrorMsg?.shortMessage || "Claim failed");
  }, [claimError, claimErrorMsg]);

  const isLoading =
    confirmedLoading || projectedLoading || distLoading || passiveDataLoading;

  // Progress percentages for the requirements
  const salesProgress = threshold > BigInt(0)
    ? Math.min(100, Number((totalTeamSalesRaw * BigInt(100)) / threshold))
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-display font-bold text-foreground">
            Passive Income
          </h1>
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* Sync button at top-right */}
        {!isQualified && (
          <Button
            size="sm"
            className="gap-2"
            onClick={() => sync(address)}
            disabled={!canSync || syncing || isConfirming}
          >
            {(syncing || isConfirming) ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Sync Qualification
          </Button>
        )}
        {isQualified && (
          <span className="text-sm font-semibold text-green-400 flex items-center gap-1.5">
            <Users className="h-4 w-4" /> Qualified ✓
          </span>
        )}
      </div>
      <p className="text-muted-foreground text-sm -mt-4">
        Your confirmed and projected passive earnings
      </p>

      {/* Qualification requirements progress (shown when not yet qualified) */}
      {!isQualified && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold text-foreground">Qualification Requirements</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">
                  Total Team Sales ≥ Threshold ({threshold > BigInt(0) ? `$${parseFloat(formatUnits(threshold, 18)).toLocaleString()}` : "—"})
                </span>
                <span className={meetsSalesRequirement ? "text-green-400" : "text-warning"}>
                  ${parseFloat(formatUnits(totalTeamSalesRaw, 18)).toLocaleString()}
                </span>
              </div>
              <Progress value={salesProgress} className="h-2" />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Pool 3 Depth 3+ Qualified Count</span>
              <span className={meetsDepthRequirement ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>
                {pool3Depth3PlusCount} {meetsDepthRequirement ? "✓" : "(need ≥ 1)"}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <span className="text-sm text-muted-foreground">Available balance</span>
              <span className="text-sm font-medium text-foreground">{confirmedPool}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Last withdrawal</span>
              <span className="text-sm text-muted-foreground">{lastWithdrawal}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Total withdrawn</span>
              <span className="text-sm font-medium text-foreground">{totalWithdrawn}</span>
            </div>
            <Button
              className="w-full gap-2"
              onClick={claimPassive}
              disabled={!confirmedPoolRaw || confirmedPoolRaw === BigInt(0) || claimPending || claimConfirming}
            >
              {(claimPending || claimConfirming) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowDownToLine className="h-4 w-4" />
              )}
              {claimPending ? "Confirm in wallet..." : claimConfirming ? "Processing..." : "Withdraw"}
            </Button>
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
          <div className="space-y-0">
            {subsLoading ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Loading subscriptions...
              </p>
            ) : activeSubscriptions.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No active subscriptions found
              </p>
            ) : (
              activeSubscriptions.map((sub, i) => (
                <div
                  key={`${sub.branch}-${sub.index}`}
                  className="flex items-center justify-between py-3 border-b border-border/30 last:border-0"
                >
                  <div>
                    <p className="text-sm text-foreground">Subscription #{i + 1}</p>
                    <p className="text-xs text-muted-foreground">
                      Principal: ${parseFloat(formatUnits(sub.principal, 18)).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-warning">
                    ${parseFloat(formatUnits(sub.accumulatedRewards, 18)).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-4 italic">
            ⚠ Projected values are estimates based on current weekly rate
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PassiveIncomeSection;
