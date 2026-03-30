import { useReadContract } from "wagmi";
import { BranchABI } from "@/constants/abis";

const useBranchManagerRole = (branchAddress) => {
  const { data, isLoading } = useReadContract({
    address: branchAddress,
    abi: BranchABI,
    functionName: "BRANCH_MANAGER_ROLE",
    query: { enabled: !!branchAddress },
  });

  return { branchManagerRole: data, isLoading };
};

export default useBranchManagerRole;
