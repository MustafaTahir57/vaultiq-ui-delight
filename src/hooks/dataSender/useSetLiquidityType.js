import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";

const useSetLiquidityType = () => {
  const { data: hash, writeContract, isPending, isError, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const setLiquidityType = (branchAddress, type) => {
    writeContract({
      address: branchAddress,
      abi: BranchExtensionABI,
      functionName: "setLiquidityType",
      args: [type],
    });
  };

  return { setLiquidityType, hash, isPending, isConfirming, isConfirmed, isError, error, reset };
};

export default useSetLiquidityType;
