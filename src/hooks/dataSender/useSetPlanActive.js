import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";

const useSetPlanActive = () => {
  const { data: hash, writeContract, isPending, isError, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const setPlanActive = (branchAddress, planId, active) => {
    writeContract({
      address: branchAddress,
      abi: BranchExtensionABI,
      functionName: "setPlanActive",
      args: [BigInt(planId), active],
    });
  };

  return { setPlanActive, hash, isPending, isConfirming, isConfirmed, isError, error, reset };
};

export default useSetPlanActive;
