import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchABI } from "@/constants/abis";

const useSubmitWeeklyPerformance = () => {
  const { data: hash, writeContract, isPending, isError, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const submitWeeklyPerformance = (branchAddress, liquidityPercent) => {
    writeContract({
      address: branchAddress,
      abi: BranchABI,
      functionName: "submitWeeklyPerformance",
      args: [BigInt(liquidityPercent)],
    });
  };

  return { submitWeeklyPerformance, hash, isPending, isConfirming, isConfirmed, isError, error, reset };
};

export default useSubmitWeeklyPerformance;
