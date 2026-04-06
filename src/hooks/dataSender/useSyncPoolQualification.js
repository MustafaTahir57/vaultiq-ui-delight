import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchABI } from "@/constants/abis";

const useSyncPoolQualification = (branchAddress) => {
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const sync = (poolId, userAddress) => {
    writeContract({
      address: branchAddress,
      abi: BranchABI,
      functionName: "syncPoolQualification",
      args: [poolId, userAddress],
    });
  };

  return { sync, isPending, isConfirming, isConfirmed, isError, error };
};

export default useSyncPoolQualification;
