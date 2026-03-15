import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";

const useSetMiningRevenueDistributor = () => {
  const { data: hash, writeContract, isPending, isError, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const setMiningRevenueDistributor = (branchAddress, distributorAddress) => {
    writeContract({
      address: branchAddress,
      abi: BranchExtensionABI,
      functionName: "setMiningRevenueDistributor",
      args: [distributorAddress],
    });
  };

  return { setMiningRevenueDistributor, hash, isPending, isConfirming, isConfirmed, isError, error, reset };
};

export default useSetMiningRevenueDistributor;
