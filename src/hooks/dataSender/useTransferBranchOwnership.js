import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { VaultIQMainABI } from "@/constants/abis";
import { VaultIQMain_Address } from "@/constants/contracts";

const useTransferBranchOwnership = () => {
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const transferBranchOwnership = (branchAddress, newOwner) => {
    writeContract({
      address: VaultIQMain_Address,
      abi: VaultIQMainABI,
      functionName: "transferBranchOwnership",
      args: [branchAddress, newOwner],
    });
  };

  return { transferBranchOwnership, isPending, isConfirming, isConfirmed, isError, error };
};

export default useTransferBranchOwnership;
