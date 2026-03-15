import useTokenAllowance from "@/hooks/dataFetcher/useTokenAllowance";
import useUSDTApproval from "@/hooks/dataSender/useUSDTApproval";
import { IncubatorPool_Address } from "@/constants/contracts";
import { parseUnits } from "viem";
import { useWallet } from "@/contexts/WalletContext";
import useIncubatorDeposit from "@/hooks/dataSender/useIncubatorDeposit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowUpFromLine,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useMemo, useEffect } from "react";
import { toast } from "sonner";

export const DepositButton = ({
  round,
  depositAmounts,
  setDepositAmounts,
  refetchAllRounds,
}) => {
  const { address } = useWallet();
  const {
    allowance,
    isLoading: allowanceLoading,
    refetch: refetchAllowance,
  } = useTokenAllowance(round.usdcToken, address, IncubatorPool_Address);
  const {
    approve,
    isPending: approvePending,
    isConfirming: approveConfirming,
    isConfirmed: approveConfirmed,
    reset: resetApproval,
  } = useUSDTApproval();
  const {
    deposit,
    isPending: depositPending,
    isConfirming: depositConfirming,
    isSuccess: depositSuccess,
  } = useIncubatorDeposit();

  const amt = depositAmounts[round.roundId] || "";
  const parsedAmount = useMemo(() => {
    if (!amt || isNaN(Number(amt)) || Number(amt) <= 0) return 0n;
    try {
      return parseUnits(amt, 18);
    } catch {
      return 0n;
    }
  }, [amt]);

  const needsApproval =
    parsedAmount > 0n && (allowance === undefined || allowance < parsedAmount);

  // After approval confirmed, refetch allowance
  useEffect(() => {
    if (approveConfirmed) {
      toast.success("Approval confirmed!");
      refetchAllowance();
      resetApproval();
      deposit(round.roundId, parsedAmount);
    }
  }, [approveConfirmed, refetchAllowance, resetApproval]);

  useEffect(() => {
    if (depositSuccess) {
      toast.success("Amount Deposited!");
      refetchAllRounds();
    }
  }, [depositSuccess]);

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

  const isLoading =
    approvePending ||
    approveConfirming ||
    depositPending ||
    depositConfirming ||
    allowanceLoading;

  let buttonText = "Deposit";
  let ButtonIcon = ArrowUpFromLine;
  if (approvePending) {
    buttonText = "Approving...";
  } else if (approveConfirming) {
    buttonText = "Confirming Approval...";
  } else if (depositPending) {
    buttonText = "Depositing...";
  } else if (depositConfirming) {
    buttonText = "Confirming Deposit...";
  } else if (needsApproval) {
    buttonText = "Approve & Deposit";
    ButtonIcon = CheckCircle2;
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        placeholder="Amount"
        className="w-32 h-9 text-xs"
        value={amt}
        onChange={(e) =>
          setDepositAmounts((prev) => ({
            ...prev,
            [round.roundId]: e.target.value,
          }))
        }
      />
      <Button
        size="sm"
        className="text-xs"
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
        ) : (
          <ButtonIcon className="h-3.5 w-3.5 mr-1" />
        )}
        {buttonText}
      </Button>
    </div>
  );
};
