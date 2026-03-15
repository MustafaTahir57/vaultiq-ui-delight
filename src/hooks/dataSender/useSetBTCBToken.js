import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";

const useSetBTCBToken = () => {
  const { data: hash, writeContract, isPending, isError, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const setBTCBToken = (branchAddress, tokenAddress) => {
    writeContract({
      address: branchAddress,
      abi: BranchExtensionABI,
      functionName: "setBTCBToken",
      args: [tokenAddress],
    });
  };

  return { setBTCBToken, hash, isPending, isConfirming, isConfirmed, isError, error, reset };
};

export default useSetBTCBToken;
