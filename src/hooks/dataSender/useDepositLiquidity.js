import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";

const useDepositLiquidity = () => {
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const depositLiquidity = (branchAddress, amount) => {
    writeContract({
      address: branchAddress,
      abi: BranchExtensionABI,
      functionName: "depositLiquidity",
      args: [amount],
    });
  };

  return { depositLiquidity, isPending, isConfirming, isConfirmed, isError, error };
};

export default useDepositLiquidity;
