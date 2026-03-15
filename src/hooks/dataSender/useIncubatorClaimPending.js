import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { IncubatorPool_Address } from "@/constants/contracts";
import { IncubatorPoolABI } from "@/constants/abis";

const useIncubatorClaimPending = () => {
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claimPending = (roundId) => {
    writeContract({
      address: IncubatorPool_Address,
      abi: IncubatorPoolABI,
      functionName: "claimPending",
      args: [BigInt(roundId)],
    });
  };

  return { claimPending, isPending, isConfirming, isSuccess, isError, error, hash };
};

export default useIncubatorClaimPending;
