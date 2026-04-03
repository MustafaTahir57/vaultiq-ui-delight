import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchABI } from "@/constants/abis";

const useSetPoolLocked = () => {
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const setPoolLocked = (branchAddress, poolId, locked) => {
    writeContract({
      address: branchAddress,
      abi: BranchABI,
      functionName: "setPoolLocked",
      args: [poolId, locked],
    });
  };

  return { setPoolLocked, isPending, isConfirming, isConfirmed, isError, error };
};

export default useSetPoolLocked;
