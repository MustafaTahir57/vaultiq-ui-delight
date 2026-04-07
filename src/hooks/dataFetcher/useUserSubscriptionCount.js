import { useReadContract } from "wagmi";
import { BranchViewsABI } from "@/constants/abis";
import useUserBranch from "./useUserBranch";

const useUserSubscriptionCount = (userAddress) => {
  const { branchAddress, isLoading: branchLoading } = useUserBranch(userAddress);

  const { data: count, isLoading, isError, refetch } = useReadContract({
    address: branchAddress,
    abi: BranchViewsABI,
    functionName: "getSubscriptionCount",
    args: [userAddress],
    query: {
      enabled: !!userAddress && !!branchAddress,
    },
  });

  return {
    count: count !== undefined ? Number(count) : 0,
    branchAddress,
    isLoading: branchLoading || isLoading,
    isError,
    refetch
  };
};

export default useUserSubscriptionCount;
