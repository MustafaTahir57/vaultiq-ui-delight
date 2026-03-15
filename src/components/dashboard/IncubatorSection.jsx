import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Rocket, ArrowDownToLine, ArrowUpFromLine, Coins, RefreshCw, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "./StatusBadge";
import { useWallet } from "@/contexts/WalletContext";
import useIncubatorRounds from "@/hooks/dataFetcher/useIncubatorRounds";
import useIncubatorDeposit from "@/hooks/dataSender/useIncubatorDeposit";
import useIncubatorClaimTokens from "@/hooks/dataSender/useIncubatorClaimTokens";
import useIncubatorRefund from "@/hooks/dataSender/useIncubatorRefund";
import useIncubatorClaimPending from "@/hooks/dataSender/useIncubatorClaimPending";
import useTokenAllowance from "@/hooks/dataFetcher/useTokenAllowance";
import useUSDTApproval from "@/hooks/dataSender/useUSDTApproval";
import { IncubatorPool_Address } from "@/constants/contracts";
import { formatUnits, parseUnits } from "viem";
import { toast } from "sonner";

const STATE_LABELS = ["open", "closed", "claimable", "canceled"];

const DepositButton = ({ round, depositAmounts, setDepositAmounts }) => {
  const { address } = useWallet();
  const { allowance, isLoading: allowanceLoading, refetch: refetchAllowance } = useTokenAllowance(round.usdcToken, address, IncubatorPool_Address);
  const { approve, isPending: approvePending, isConfirming: approveConfirming, isConfirmed: approveConfirmed, reset: resetApproval } = useUSDTApproval();
  const { deposit, isPending: depositPending, isConfirming: depositConfirming, isSuccess: depositSuccess } = useIncubatorDeposit();

  const amt = depositAmounts[round.roundId] || "";
  const parsedAmount = useMemo(() => {
    if (!amt || isNaN(Number(amt)) || Number(amt) <= 0) return 0n;
    try { return parseUnits(amt, 18); } catch { return 0n; }
  }, [amt]);

  const needsApproval = parsedAmount > 0n && (allowance === undefined || allowance < parsedAmount);

  // After approval confirmed, refetch allowance
  useEffect(() => {
    if (approveConfirmed) {
      toast.success("Approval confirmed!");
      refetchAllowance();
      resetApproval();
    }
  }, [approveConfirmed, refetchAllowance, resetApproval]);

  const handleClick = () => {
    if (!amt || isNaN(Number(amt)) || Number(amt) <= 0) {
      toast.error("Enter a valid deposit amount");
      return;
    }
    if (needsApproval) {
      approve(round.usdcToken, IncubatorPool_Address, parsedAmount);
    } else {
      deposit(round.roundId, parsedAmount);
    }
  };

  const isLoading = approvePending || approveConfirming || depositPending || depositConfirming || allowanceLoading;

  let buttonText = "Deposit";
  let ButtonIcon = ArrowUpFromLine;
  if (approvePending) { buttonText = "Approving..."; }
  else if (approveConfirming) { buttonText = "Confirming Approval..."; }
  else if (depositPending) { buttonText = "Depositing..."; }
  else if (depositConfirming) { buttonText = "Confirming Deposit..."; }
  else if (needsApproval) { buttonText = "Approve & Deposit"; ButtonIcon = CheckCircle2; }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        placeholder="Amount"
        className="w-32 h-9 text-xs"
        value={amt}
        onChange={(e) => setDepositAmounts((prev) => ({ ...prev, [round.roundId]: e.target.value }))}
      />
      <Button size="sm" className="text-xs" onClick={handleClick} disabled={isLoading}>
        {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <ButtonIcon className="h-3.5 w-3.5 mr-1" />}
        {buttonText}
      </Button>
    </div>
  );
};

const IncubatorSection = () => {
  const { address } = useWallet();
  const { rounds, isLoading, isError, refetch } = useIncubatorRounds(address);
  const { claimTokens, isPending: claimPending, isConfirming: claimConfirming, isSuccess: claimSuccess } = useIncubatorClaimTokens();
  const { refundCanceled, isPending: refundPending, isConfirming: refundConfirming, isSuccess: refundSuccess } = useIncubatorRefund();
  const { claimPending: claimPendingFn, isPending: claimPendingPending, isConfirming: claimPendingConfirming, isSuccess: claimPendingSuccess } = useIncubatorClaimPending();

  const [depositAmounts, setDepositAmounts] = useState({});

  useEffect(() => {
    if (claimSuccess || refundSuccess || claimPendingSuccess) {
      toast.success("Transaction confirmed!");
      refetch();
    }
  }, [claimSuccess, refundSuccess, claimPendingSuccess, refetch]);

  const formatToken = (value, decimals = 18) => {
    if (!value || value === 0n) return "0";
    const formatted = formatUnits(value, decimals);
    return Number(formatted).toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const shortAddr = (addr) => addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "—";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Incubator Rounds</h1>
          <p className="text-muted-foreground text-sm mt-1">Participate in token launch rounds for ecosystem projects</p>
        </div>
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm">Loading rounds...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Incubator Rounds</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {rounds.length} round{rounds.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => refetch()} className="text-muted-foreground">
          <RefreshCw className="h-4 w-4 mr-1" /> Refresh
        </Button>
      </div>

      {isError && (
        <div className="glass-card p-4 flex items-center gap-3 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">Failed to load rounds. Please try again.</span>
        </div>
      )}

      {rounds.length === 0 && !isError && (
        <div className="glass-card p-8 text-center text-muted-foreground">
          <Rocket className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No incubator rounds available yet.</p>
        </div>
      )}

      <div className="space-y-4">
        {rounds.map((round, i) => {
          const status = STATE_LABELS[round.state] || "unknown";
          return (
            <motion.div
              key={round.roundId}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Rocket className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-semibold text-foreground">Round #{round.roundId}</span>
                        <StatusBadge status={status} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Sale Token: {shortAddr(round.saleToken)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Total Deposited</p>
                      <p className="font-medium text-foreground">${formatToken(round.totalParticipating)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Your Deposit</p>
                      <p className="font-medium text-primary">${formatToken(round.userDeposit)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Claimable</p>
                      <p className="font-medium text-foreground">
                        {round.claimableTokens > 0n ? formatToken(round.claimableTokens) : "—"}
                      </p>
                    </div>
                    {round.userPendingBalance > 0n && (
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Pending</p>
                        <p className="font-medium text-foreground">${formatToken(round.userPendingBalance)}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground border-t border-border pt-3">
                  <span>Min Deposit: ${formatToken(round.minDeposit)}</span>
                  <span>Max Deposit: ${formatToken(round.maxDeposit)}</span>
                  <span>Total Tokens Supplied: {formatToken(round.totalTokensSupplied)}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {round.canDeposit && (
                    <DepositButton round={round} depositAmounts={depositAmounts} setDepositAmounts={setDepositAmounts} />
                  )}

                  {round.canClaim && (
                    <Button size="sm" className="text-xs" onClick={() => claimTokens(round.roundId)} disabled={claimPending || claimConfirming}>
                      {claimPending || claimConfirming ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <ArrowDownToLine className="h-3.5 w-3.5 mr-1" />}
                      Claim Tokens
                    </Button>
                  )}

                  {round.canRefund && (
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => refundCanceled(round.roundId)} disabled={refundPending || refundConfirming}>
                      {refundPending || refundConfirming ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Coins className="h-3.5 w-3.5 mr-1" />}
                      Refund
                    </Button>
                  )}

                  {round.canClaimPending && (
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => claimPendingFn(round.roundId)} disabled={claimPendingPending || claimPendingConfirming}>
                      {claimPendingPending || claimPendingConfirming ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Coins className="h-3.5 w-3.5 mr-1" />}
                      Claim Pending
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default IncubatorSection;
