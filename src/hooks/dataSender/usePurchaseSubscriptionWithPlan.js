import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchABI } from "@/constants/abis";

/**
 * Model B – BTC Mining (with plan).
 * Calls branch.purchaseSubscriptionWithPlan(principal, duration, referral, planId, autoRoll)
 */
const usePurchaseSubscriptionWithPlan = () => {
  const { data: hash, writeContract, isPending, isError, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const purchase = (branchAddress, principal, duration, referral, planId, autoRoll) => {
    writeContract({
      address: branchAddress,
      abi: BranchABI,
      functionName: "purchaseSubscriptionWithPlan",
      args: [principal, duration, referral, planId, autoRoll],
    });
  };

  return { purchase, hash, isPending, isConfirming, isConfirmed, isError, error, reset };
};

export default usePurchaseSubscriptionWithPlan;
