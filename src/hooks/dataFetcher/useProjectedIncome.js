import { useMemo } from "react";
import { useReadContract } from "wagmi";
import { BranchViewsABI } from "@/constants/abis";
import useUserBranch from "./useUserBranch";
import { formatUnits } from "viem";

const useProjectedIncome = (userAddress) => {
  const { branchAddress, isLoading: branchLoading } = useUserBranch(userAddress);

  const { data, isLoading: queryLoading } = useReadContract({
    address: branchAddress,
    abi: BranchViewsABI,
    functionName: "getProjectedPassiveIncome",
    args: [userAddress],
    query: { enabled: !!userAddress },
  });

  const { projectedRaw, activeSubs } = useMemo(() => {
    if (!data) return { projectedRaw: BigInt(0), activeSubs: [] };
    const [projected, subs] = data;
    return {
      projectedRaw: projected ?? BigInt(0),
      activeSubs: Array.isArray(subs) ? subs : [],
    };
  }, [data]);

  const formatted = `$${parseFloat(formatUnits(projectedRaw, 18)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return {
    projectedIncome: formatted,
    projectedIncomeRaw: projectedRaw,
    activeSubs,
    isLoading: branchLoading || queryLoading,
  };
};

export default useProjectedIncome;
