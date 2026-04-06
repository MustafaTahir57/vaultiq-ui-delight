import { useReadContract } from "wagmi";
import { BranchABI } from "@/constants/abis";

const usePassiveSalesThreshold = (branchAddress) => {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: branchAddress,
    abi: BranchABI,
    functionName: "passiveSalesThreshold",
    query: { enabled: !!branchAddress },
  });

  return {
    passiveSalesThreshold: data ?? BigInt(0),
    isLoading,
    isError,
    refetch,
  };
};

export default usePassiveSalesThreshold;
