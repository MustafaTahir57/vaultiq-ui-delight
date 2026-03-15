import { useMemo } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";
import useUserBranch from "./useUserBranch";
import { formatUnits } from "viem";

const useProjectedIncome = (userAddress) => {
  const { branchAddress, isLoading: branchLoading } = useUserBranch(userAddress);

  // 1) Get all subscriptions
  const { data: allSubs, isLoading: subsLoading } = useReadContract({
    address: branchAddress,
    abi: BranchExtensionABI,
    functionName: "getAllSubscriptions",
    args: [userAddress],
    query: { enabled: !!userAddress && !!branchAddress },
  });

  // 2) Get current week
  const { data: currentWeek, isLoading: weekLoading } = useReadContract({
    address: branchAddress,
    abi: BranchExtensionABI,
    functionName: "getCurrentWeek",
    query: { enabled: !!branchAddress },
  });

  // 3) Get weeklyLiquidityPercent for current week
  const { data: liquidityPercent, isLoading: liqLoading } = useReadContract({
    address: branchAddress,
    abi: BranchExtensionABI,
    functionName: "weeklyLiquidityPercent",
    args: [currentWeek],
    query: { enabled: !!branchAddress && currentWeek !== undefined },
  });

  // Filter active subs and calculate projected weekly income
  const { projectedWeekly, activeSubs } = useMemo(() => {
    if (!allSubs || !Array.isArray(allSubs) || liquidityPercent === undefined) {
      return { projectedWeekly: BigInt(0), activeSubs: [] };
    }

    let total = BigInt(0);
    const active = [];

    for (const sub of allSubs) {
      const principal = sub.principal ?? sub[0];
      const cancelled = sub.cancelled ?? sub[6];
      const expired = sub.expired ?? sub[7];
      const matured = sub.matured ?? sub[14];
      const accumulated = sub.accumulatedRewards ?? sub[4];

      if (cancelled || expired || matured) continue;
      if (principal === BigInt(0)) continue;

      const projected = ((principal + accumulated) * BigInt(liquidityPercent)) / BigInt(10000);
      total += projected;
      active.push({ principal, accumulated, projected });
    }

    return { projectedWeekly: total, activeSubs: active };
  }, [allSubs, liquidityPercent]);

  const formatted = `$${parseFloat(formatUnits(projectedWeekly, 18)).toLocaleString()}`;

  return {
    projectedIncome: formatted,
    projectedIncomeRaw: projectedWeekly,
    activeSubs,
    liquidityPercent: liquidityPercent !== undefined ? Number(liquidityPercent) : 0,
    isLoading: branchLoading || subsLoading || weekLoading || liqLoading,
  };
};

export default useProjectedIncome;
