import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, Users, Loader2, TrendingUp, BarChart3, GitBranch, Network, RefreshCw, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import usePoolCard from "@/hooks/dataFetcher/usePoolCard";
import useClaimPool from "@/hooks/dataSender/useClaimPool";
import useSyncPoolQualification from "@/hooks/dataSender/useSyncPoolQualification";
import { formatUnits } from "viem";

const formatUSDT = (value, decimals = 18) => {
  const num = Number(formatUnits(value, decimals));
  return `$${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

const POOL_NAMES = {
  1: "Emerald",
  2: "Diamond",
  3: "Blue Diamond",
  4: "Black Diamond",
};

const PoolCard = ({ poolId, userAddress, branchAddress, index = 0 }) => {
  const {
    totalQueued, totalDistributed, undistributed, currentWeekQueued,
    qualifiedCount, isLocked,
    currentSales, requiredSales, currentWeeklySales, weeklyThreshold,
    isQualified, wouldQualifyNow, salesProgressBps, weeklyProgressBps,
    closeTeamSales, deepTeamSales, closeRequired, totalRequired,
    closeProgressBps, totalProgressBps, allLevelsContributed,
    isLoading, refetch,
  } = usePoolCard(poolId, userAddress, branchAddress);

  const { claim, isPending, isConfirming } = useClaimPool(branchAddress);
  const { sync, isPending: isSyncPending, isConfirming: isSyncConfirming, isConfirmed: isSyncConfirmed, isError: isSyncError, error: syncError } = useSyncPoolQualification(branchAddress);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const claiming = isPending || isConfirming;
  const syncing = isSyncPending || isSyncConfirming;

  useEffect(() => {
    if (isSyncConfirmed) {
      toast.success("Pool qualification synced successfully!");
      refetch();
    }
  }, [isSyncConfirmed, refetch]);

  useEffect(() => {
    if (isSyncError && syncError) {
      toast.error(syncError?.shortMessage || "Sync failed");
    }
  }, [isSyncError, syncError]);

  const salesProgress = Math.min(salesProgressBps / 100, 100);
  const weeklyProgress = Math.min(weeklyProgressBps / 100, 100);
  const closeProgress = Math.min(closeProgressBps / 100, 100);
  const totalProgress = Math.min(totalProgressBps / 100, 100);
  const salesRemaining = requiredSales > currentSales ? requiredSales - currentSales : 0n;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col items-center"
    >
      <h2 className="text-lg font-display font-bold text-primary mb-2">{POOL_NAMES[poolId]}</h2>
      <div className="glass-card-hover p-5 w-full space-y-4">
        {/* Header: status + undistributed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isQualified ? "bg-primary/10" : "bg-secondary"}`}>
              {isQualified ? <Unlock className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Pool {poolId}</h3>
              <span className={`text-xs font-medium ${isQualified ? "text-success" : "text-destructive"}`}>
                {isLoading ? "..." : isQualified ? "Qualified" : "Not Qualified"}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-display font-bold text-foreground">
              {isLoading ? "..." : balanceVisible ? formatUSDT(undistributed) : "••••••"}
            </span>
            <p className="text-[10px] text-muted-foreground">Undistributed</p>
          </div>
        </div>

        {/* Sync qualification button - shown when not qualified, enabled when thresholds met */}
        {!isLoading && !isQualified && (
          <Button
            variant="outline"
            size="sm"
            className={`w-full ${wouldQualifyNow ? "border-success/30 text-success hover:bg-success/10" : "border-muted text-muted-foreground"}`}
            disabled={!wouldQualifyNow || syncing}
            onClick={() => sync(poolId, userAddress)}
          >
            {syncing ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Syncing...</>
            ) : (
              <><RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Sync Qualification</>
            )}
          </Button>
        )}

        {/* Pool volume stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/50 rounded-lg p-2.5">
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-[10px] text-muted-foreground">Total Accumulated</p>
              <button onClick={() => setBalanceVisible(!balanceVisible)} className="text-muted-foreground hover:text-foreground transition-colors">
                {balanceVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </button>
            </div>
            <p className="text-sm font-semibold text-foreground">{isLoading ? "..." : balanceVisible ? formatUSDT(totalQueued) : "••••••"}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">Total Distributed</p>
            <p className="text-sm font-semibold text-foreground">{isLoading ? "..." : balanceVisible ? formatUSDT(totalDistributed) : "••••••"}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">This Week</p>
            <p className="text-sm font-semibold text-foreground">{isLoading ? "..." : balanceVisible ? formatUSDT(currentWeekQueued) : "••••••"}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">Members</p>
            <p className="text-sm font-semibold text-foreground flex items-center gap-1">
              <Users className="h-3 w-3" /> {isLoading ? "..." : qualifiedCount}
            </p>
          </div>
        </div>

        {/* Sales qualification progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Sales Progress
            </span>
            <span className="text-foreground font-medium">
              {isLoading ? "..." : `${salesProgress.toFixed(0)}%`}
            </span>
          </div>
          <Progress value={isLoading ? 0 : salesProgress} className="h-2" />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{isLoading ? "..." : formatUSDT(currentSales)} / {isLoading ? "..." : formatUSDT(requiredSales)}</span>
            {!isLoading && !isQualified && salesRemaining > 0n && (
              <span className="text-primary">{formatUSDT(salesRemaining)} more needed</span>
            )}
          </div>
        </div>

        {/* Weekly threshold progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <BarChart3 className="h-3 w-3" /> Weekly Threshold
            </span>
            <span className="text-foreground font-medium">
              {isLoading ? "..." : `${weeklyProgress.toFixed(0)}%`}
            </span>
          </div>
          <Progress value={isLoading ? 0 : weeklyProgress} className="h-2" />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{isLoading ? "..." : formatUSDT(currentWeeklySales)} / {isLoading ? "..." : formatUSDT(weeklyThreshold)}</span>
            {!isLoading && wouldQualifyNow && !isQualified && (
              <span className="text-success text-[10px]">Would qualify now!</span>
            )}
          </div>
        </div>

        {/* Close/Deep Team Breakdown */}
        <div className="space-y-3 pl-3 border-l-2 border-primary/20">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
              <GitBranch className="h-3 w-3" /> Close Team (L1–L4)
            </span>
            {!isLoading && !allLevelsContributed && (
              <span className="text-[10px] text-warning font-medium text-amber-400">L1 only</span>
            )}
              <span className="text-foreground font-medium">
                {isLoading ? "..." : `${closeProgress.toFixed(0)}%`}
              </span>
            </div>
            <Progress value={isLoading ? 0 : closeProgress} className="h-1.5" />
            <div className="text-[10px] text-muted-foreground">
              {isLoading ? "..." : formatUSDT(closeTeamSales)} / {isLoading ? "..." : formatUSDT(closeRequired)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Network className="h-3 w-3" /> Total Team
              </span>
              <span className="text-foreground font-medium">
                {isLoading ? "..." : `${totalProgress.toFixed(0)}%`}
              </span>
            </div>
            <Progress value={isLoading ? 0 : totalProgress} className="h-1.5" />
            <div className="text-[10px] text-muted-foreground">
             {isLoading ? "..." : formatUSDT(closeTeamSales + deepTeamSales)} / {isLoading ? "..." : formatUSDT(totalRequired)}
            </div>
          </div>
        </div>

        {/* Claim button */}
        <Button
          className="w-full"
          size="sm"
          disabled={!isQualified || !allLevelsContributed || claiming || isLoading || isLocked}
          onClick={() => claim(poolId)}
        >
          {claiming ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Claiming...</>
          ) : (
            "Claim Reward"
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default PoolCard;
