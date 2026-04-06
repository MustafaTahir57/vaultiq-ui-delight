import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";

const useSetMaintenanceSplitPercent = () => {
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const setMaintenanceSplitPercent = (branchAddress, closePct, deepPct) => {
    writeContract({
      address: branchAddress,
      abi: BranchExtensionABI,
      functionName: "setMaintenanceSplitPercent",
      args: [closePct, deepPct],
    });
  };

  return { setMaintenanceSplitPercent, isPending, isConfirming, isConfirmed, isError, error };
};

export default useSetMaintenanceSplitPercent;
