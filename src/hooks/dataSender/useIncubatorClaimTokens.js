import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { IncubatorPool_Address } from "@/constants/contracts";
import { IncubatorPoolABI } from "@/constants/abis";

const useIncubatorClaimTokens = () => {
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claimTokens = (roundId) => {
    writeContract({
      address: IncubatorPool_Address,
      abi: IncubatorPoolABI,
      functionName: "claimTokens",
      args: [BigInt(roundId)],
    });
  };

  return { claimTokens, isPending, isConfirming, isSuccess, isError, error, hash };
};

export default useIncubatorClaimTokens;
