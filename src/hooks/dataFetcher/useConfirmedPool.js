import { useReadContract } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";
import useUserBranch from "./useUserBranch";
import { formatUnits } from "viem";

const useConfirmedPool = (userAddress) => {
  const { branchAddress, isLoading: branchLoading } = useUserBranch(userAddress);

  const { data, isLoading, isError, refetch } = useReadContract({
    address: branchAddress,
    abi: BranchExtensionABI,
    functionName: "previewPassivePending",
    args: [userAddress],
    query: {
      enabled: !!userAddress && !!branchAddress,
    },
  });

  const raw = data ?? BigInt(0);
  const formatted = `$${parseFloat(formatUnits(raw, 18)).toLocaleString()}`;

  return {
    confirmedPool: formatted,
    confirmedPoolRaw: raw,
    isLoading: branchLoading || isLoading,
    isError,
    refetch,
  };
};

export default useConfirmedPool;
