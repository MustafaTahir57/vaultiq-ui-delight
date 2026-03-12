import { useReadContract } from "wagmi";
import { VaultIQMainABI } from "@/constants/abis";
import { VaultIQMain_Address } from "@/constants/contracts";

const useBranchInfo = (branchAddress) => {
  const { data, isLoading, isError } = useReadContract({
    address: VaultIQMain_Address,
    abi: VaultIQMainABI,
    functionName: "branches",
    args: [branchAddress],
    enabled: !!branchAddress,
  });

  // data = [registered, approved, name, owner]
  return {
    registered: data?.[0] ?? false,
    approved: data?.[1] ?? false,
    branchName: data?.[2] ?? "",
    owner: data?.[3] ?? null,
    isLoading,
    isError,
  };
};

export default useBranchInfo;
