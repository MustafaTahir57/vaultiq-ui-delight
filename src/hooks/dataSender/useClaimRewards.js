import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchABI , BranchExtensionABI } from "@/constants/abis";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAccount } from "wagmi";

const useClaimRewards = () => {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const {address : userAddress} = useAccount();

  useEffect(() => {
    if (isConfirmed) toast.success("USDC rewards claimed successfully!");
    if (isError) toast.error(error?.shortMessage || "Claim failed");
  }, [isConfirmed, isError, error]);

  const claim = (branchAddress, subscriptionIndex) => {
    writeContract({
      address: branchAddress,
      abi: BranchExtensionABI,
      functionName: "expireSubscription",
      args: [userAddress , BigInt(subscriptionIndex)],
    });
  };

  return { claim, isPending, isConfirming, isConfirmed, isError, error, reset };
};

export default useClaimRewards;
