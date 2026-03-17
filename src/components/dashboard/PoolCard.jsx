import { motion } from "framer-motion";
import { Lock, Unlock, Users, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import usePoolCard from "@/hooks/dataFetcher/usePoolCard";
import useClaimPool from "@/hooks/dataSender/useClaimPool";
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
  const { pendingBalance, isQualified, qualifiedCount, threshold, isLoading } = usePoolCard(poolId, userAddress, branchAddress);
  const { claim, isPending, isConfirming } = useClaimPool(branchAddress);

  const claiming = isPending || isConfirming;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card-hover p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isQualified ? "bg-primary/10" : "bg-secondary"}`}>
            {isQualified ? <Unlock className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
          </div>
          <div>
            <p className="text-xs font-bold text-primary">{POOL_NAMES[poolId]}</p>
            <h3 className="font-display font-semibold text-foreground">Pool {poolId}</h3>
            <span className={`text-xs font-medium ${isQualified ? "text-success" : "text-destructive"}`}>
              {isLoading ? "..." : isQualified ? "Unlocked" : "Locked"}
            </span>
          </div>
        </div>
        <span className="text-lg font-display font-bold text-foreground">
          {isLoading ? "..." : formatUSDT(pendingBalance)}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {isLoading ? "..." : qualifiedCount} members
          </span>
          <span className="text-muted-foreground">
            Threshold: {isLoading ? "..." : formatUSDT(threshold)}
          </span>
        </div>

        <Button
          className="w-full"
          size="sm"
          disabled={!isQualified || pendingBalance === 0n || claiming || isLoading}
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
