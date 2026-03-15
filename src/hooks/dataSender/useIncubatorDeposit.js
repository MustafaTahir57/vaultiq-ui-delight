import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { IncubatorPool_Address } from "@/constants/contracts";
import { IncubatorPoolABI } from "@/constants/abis";

const useIncubatorDeposit = () => {
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const deposit = (roundId, amount) => {
    writeContract({
      address: IncubatorPool_Address,
      abi: IncubatorPoolABI,
      functionName: "deposit",
      args: [BigInt(roundId), amount],
    });
  };

  return { deposit, isPending, isConfirming, isSuccess, isError, error, hash };
};

export default useIncubatorDeposit;
