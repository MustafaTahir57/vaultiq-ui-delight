import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchABI } from "@/constants/abis";

const useClaimPassivePool = (branchAddress) => {
  const { data: hash, writeContract, isPending, isError, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const claim = () => {
    if (!branchAddress) return;
    writeContract({
      address: branchAddress,
      abi: BranchABI,
      functionName: "claimPassivePool",
    });
  };

  return { claim, hash, isPending, isConfirming, isConfirmed, isError, error };
};

export default useClaimPassivePool;
