import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";

const useWithdrawLiquidity = () => {
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const withdrawLiquidity = (branchAddress, amount) => {
    writeContract({
      address: branchAddress,
      abi: BranchExtensionABI,
      functionName: "withdrawLiquidity",
      args: [amount],
    });
  };

  return { withdrawLiquidity, isPending, isConfirming, isConfirmed, isError, error };
};

export default useWithdrawLiquidity;
