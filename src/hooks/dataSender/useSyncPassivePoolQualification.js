import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";

const useSyncPassivePoolQualification = (branchAddress) => {
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const sync = (userAddress) => {
    writeContract({
      address: branchAddress,
      abi: BranchExtensionABI,
      functionName: "syncPassivePoolQualification",
      args: [userAddress],
    });
  };

  return { sync, isPending, isConfirming, isConfirmed, isError, error };
};

export default useSyncPassivePoolQualification;
