import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { IncubatorPool_Address } from "@/constants/contracts";
import { IncubatorPoolABI } from "@/constants/abis";

const useIncubatorRefund = () => {
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const refundCanceled = (roundId) => {
    writeContract({
      address: IncubatorPool_Address,
      abi: IncubatorPoolABI,
      functionName: "refundCanceled",
      args: [BigInt(roundId)],
    });
  };

  return { refundCanceled, isPending, isConfirming, isSuccess, isError, error, hash };
};

export default useIncubatorRefund;
