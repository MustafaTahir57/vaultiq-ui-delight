import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchABI } from "@/constants/abis";

/**
 * Model A – USDC Compounding (no plan).
 * Calls branch.purchaseSubscription(principal, duration, referral)
 */
const usePurchaseSubscription = () => {
  const { data: hash, writeContract, isPending, isError, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const purchase = (branchAddress, principal, duration, referral) => {
    writeContract({
      address: branchAddress,
      abi: BranchABI,
      functionName: "purchaseSubscription",
      args: [principal, duration, referral],
    });
  };

  return { purchase, hash, isPending, isConfirming, isConfirmed, isError, error, reset };
};

export default usePurchaseSubscription;
