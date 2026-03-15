import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";

const useProcessPassiveMonth = () => {
  const { data: hash, writeContract, isPending, isError, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const processPassiveMonth = (branchAddress, monthIndex) => {
    writeContract({
      address: branchAddress,
      abi: BranchExtensionABI,
      functionName: "processPassiveMonth",
      args: [BigInt(monthIndex)],
    });
  };

  return { processPassiveMonth, hash, isPending, isConfirming, isConfirmed, isError, error, reset };
};

export default useProcessPassiveMonth;
