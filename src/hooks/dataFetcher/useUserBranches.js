import { useReadContract } from "wagmi";
import { VaultIQMainABI } from "@/constants/abis";
import { VaultIQMain_Address } from "@/constants/contracts";

const useUserBranches = (userAddress) => {
  const { data: branches, isLoading, isError } = useReadContract({
    address: VaultIQMain_Address,
    abi: VaultIQMainABI,
    functionName: "getAllBranchesOf",
    args: [userAddress],
    query: {
      enabled: !!userAddress,
    },
  });

  const userBranches = branches || [];
  const isBranchManager = userBranches.length > 0;

  return { userBranches, isBranchManager, isLoading, isError };
};

export default useUserBranches;
