import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchABI } from "@/constants/abis";
import { toast } from "sonner";
import { useEffect } from "react";

const useCancelSubscription = () => {
  const { writeContract, data: hash, isPending, isError, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) toast.success("Subscription cancelled successfully!");
    if (isError) toast.error(error?.shortMessage || "Cancellation failed");
  }, [isConfirmed, isError, error]);

  const cancel = (branchAddress, subscriptionIndex) => {
    writeContract({
      address: branchAddress,
      abi: BranchABI,
      functionName: "cancelSubscription",
      args: [BigInt(subscriptionIndex)],
    });
  };

  return { cancel, isPending, isConfirming, isConfirmed, isError, error, reset };
};

export default useCancelSubscription;
