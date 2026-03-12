import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchABI } from "@/constants/abis";
import { Branch_Address } from "@/constants/contracts";
import { toast } from "sonner";
import { useEffect } from "react";

const useClaimPool = (branchAddress) => {
  const contractAddress = branchAddress || Branch_Address;

  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) toast.success("Pool reward claimed successfully!");
    if (isError) toast.error(error?.shortMessage || "Claim failed");
  }, [isSuccess, isError, error]);

  const claim = (poolId) => {
    writeContract({
      address: contractAddress,
      abi: BranchABI,
      functionName: "claimPool",
      args: [poolId],
    });
  };

  return { claim, isPending, isConfirming, isSuccess };
};

export default useClaimPool;
