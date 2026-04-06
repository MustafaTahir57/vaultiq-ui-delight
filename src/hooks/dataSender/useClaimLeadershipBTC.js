import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { LeadershipPoolABI } from "@/constants/abis";
import { LeadershipPool_Address } from "@/constants/contracts";

const useClaimLeadershipBTC = () => {
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const claim = () => {
    writeContract({
      address: LeadershipPool_Address,
      abi: LeadershipPoolABI,
      functionName: "claim",
    });
  };

  return { claim, isPending, isConfirming, isConfirmed, isError, error, hash };
};

export default useClaimLeadershipBTC;
