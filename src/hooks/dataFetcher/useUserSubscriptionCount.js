import { useReadContract } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";
import useUserBranch from "./useUserBranch";

const useUserSubscriptionCount = (userAddress) => {
  const { branchAddress, isLoading: branchLoading } = useUserBranch(userAddress);

  const { data: count, isLoading, isError } = useReadContract({
    address: branchAddress,
    abi: BranchExtensionABI,
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
  };
};

export default useUserSubscriptionCount;
