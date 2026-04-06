import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";

const useSetPoolRule = () => {
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const setPoolRule = (branchAddress, poolId, salesRequirement, maintenanceThreshold) => {
    writeContract({
      address: branchAddress,
      abi: BranchExtensionABI,
      functionName: "setPoolRule",
      args: [poolId, salesRequirement, maintenanceThreshold],
    });
  };

  return { setPoolRule, isPending, isConfirming, isConfirmed, isError, error };
};

export default useSetPoolRule;
