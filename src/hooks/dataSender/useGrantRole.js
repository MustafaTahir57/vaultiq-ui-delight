import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchABI } from "@/constants/abis";

const useGrantRole = () => {
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const grantRole = (branchAddress, role, account) => {
    writeContract({
      address: branchAddress,
      abi: BranchABI,
      functionName: "grantRole",
      args: [role, account],
    });
  };

  return { grantRole, isPending, isConfirming, isConfirmed, isError, error };
};

export default useGrantRole;
