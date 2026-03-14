import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";
import { BranchExtension_Address } from "@/constants/contracts";

/**
 * Calls BranchExtension.addSubscriptionPlan(SubscriptionPlan plan)
 *
 * plan = {
 *   name: string,
 *   modelType: uint8 (0 = ModelA, 1 = ModelB),
 *   core: {
 *     liquidityAllocation, directBonusPercent, branchCommissionPercent,
 *     feePercent, foundersPercent, pool1Percent, pool2Percent,
 *     pool3Percent, pool4Percent, passiveIncomePercent, cancellationPercent
 *   },
 *   expiry: { feePercent, branchPercent, passiveIncomePercent },
 *   hashTreasury: address,
 *   feeTreasury: address,
 *   leadershipPool: address,
 *   active: bool
 * }
 */
const useAddSubscriptionPlan = () => {
  const { data: hash, writeContract, isPending, isError, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const addPlan = (plan, branchAddress) => {
    writeContract({
      address: branchAddress || BranchExtension_Address,
      abi: BranchExtensionABI,
      functionName: "addSubscriptionPlan",
      args: [plan],
    });
  };

  return { addPlan, hash, isPending, isConfirming, isConfirmed, isError, error, reset };
};

export default useAddSubscriptionPlan;
