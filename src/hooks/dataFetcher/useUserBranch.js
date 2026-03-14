import { useReadContract } from "wagmi";
import { VaultIQMainABI } from "@/constants/abis";
import { VaultIQMain_Address } from "@/constants/contracts";

const useUserBranch = (userAddress) => {
  const { data: branchAddress, isLoading, isError } = useReadContract({
    address: VaultIQMain_Address,
    abi: VaultIQMainABI,
    functionName: "getUserBranch",
    args: [userAddress],
    query: {
      enabled: !!userAddress,
    },
  });

  console.log("useUserBranch", branchAddress)

  return { branchAddress: branchAddress || null, isLoading, isError };
};

export default useUserBranch;
