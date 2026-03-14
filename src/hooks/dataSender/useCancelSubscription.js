import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchABI } from "@/constants/abis";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAccount } from "wagmi";

const useCancelSubscription = () => {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const {address} = useAccount()

  const cancel = (branchAddress, subscriptionIndex) => {
    writeContract({
      address: branchAddress,
      abi: BranchABI,
      functionName: "cancelSubscription",
      args: [address, BigInt(subscriptionIndex)],
    });
  };

  return { cancel, isPending, isConfirming, isConfirmed, isError, error, reset };
};

export default useCancelSubscription;
