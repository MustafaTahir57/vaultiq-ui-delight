import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchABI } from "@/constants/abis";
import { toast } from "sonner";
import { useEffect } from "react";

const useClaimBTC = () => {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) toast.success("BTC claimed successfully!");
    if (isError) toast.error(error?.shortMessage || "BTC claim failed");
  }, [isConfirmed, isError, error]);

  const claim = (branchAddress, subscriptionIndex) => {
    writeContract({
      address: branchAddress,
      abi: BranchABI,
      functionName: "claimBTC",
      args: [BigInt(subscriptionIndex)],
    });
  };

  return { claim, isPending, isConfirming, isConfirmed, isError, error, reset };
};

export default useClaimBTC;
