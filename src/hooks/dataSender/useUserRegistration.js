import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { VaultIQMainABI } from "@/constants/abis";
import { VaultIQMain_Address } from "@/constants/contracts";

const useUserRegistration = () => {
  const { data: hash, writeContract, isPending, isError, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const registerUser = (branchAddress) => {
    writeContract({
      address: VaultIQMain_Address,
      abi: VaultIQMainABI,
      functionName: "registerUser",
      args: [branchAddress],
    });
  };

  return {
    registerUser,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    isError,
    error,
    reset,
  };
};

export default useUserRegistration;
