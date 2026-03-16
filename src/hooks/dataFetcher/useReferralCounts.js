import { useReadContract } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";

const useReferralCounts = (branchAddress, userAddress) => {
  const { data, isLoading, isError } = useReadContract({
    address: branchAddress,
    abi: BranchExtensionABI,
    functionName: "getReferralTreeCounts",
    args: [userAddress],
    query: {
      enabled: !!branchAddress && !!userAddress,
    },
  });

  const directReferrals = data ? Number(data[0] || 0) : 0;

  return { directReferrals, isLoading, isError };
};

export default useReferralCounts;
