import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchViewsABI } from "@/constants/abis";

const useSetTestingTimeConfig = () => {
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const setTestingTimeConfig = (branchAddress, newWeekSeconds, newMonthSeconds, newActivationDelay) => {
    writeContract({
      address: branchAddress,
      abi: BranchViewsABI,
      functionName: "setTestingTimeConfig",
      args: [newWeekSeconds, newMonthSeconds, newActivationDelay],
    });
  };

  return { setTestingTimeConfig, isPending, isConfirming, isConfirmed, isError, error };
};

export default useSetTestingTimeConfig;
