import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ERC20ABI } from "@/constants/erc20Abi";

const useUSDTApproval = () => {
  const { data: hash, writeContract, isPending, isError, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = (tokenAddress, spender, amount) => {
    writeContract({
      address: tokenAddress,
      abi: ERC20ABI,
      functionName: "approve",
      args: [spender, amount],
    });
  };

  return {
    approve,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    isError,
    error,
    reset,
  };
};

export default useUSDTApproval;
