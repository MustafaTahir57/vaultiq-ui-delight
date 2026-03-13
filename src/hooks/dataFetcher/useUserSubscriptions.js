import { useMemo } from "react";
import { useReadContracts } from "wagmi";
import { BranchABI } from "@/constants/abis";
import useUserBranch from "./useUserBranch";

const useUserSubscriptions = (userAddress, maxCount = 20) => {
  const { branchAddress, isLoading: branchLoading } = useUserBranch(userAddress);

  const contracts = useMemo(() => {
    if (!userAddress || !branchAddress) return [];

    return Array.from({ length: maxCount }, (_, i) => ({
      address: branchAddress,
      abi: BranchABI,
      functionName: "userSubscriptions",
      args: [userAddress, BigInt(i)],
    }));
  }, [userAddress, branchAddress, maxCount]);

  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts,
    query: { enabled: contracts.length > 0 },
  });

  const stats = useMemo(() => {
    if (!data) {
      return { activeCount: 0, totalRewards: BigInt(0), subscriptions: [] };
    }

    const allSubs = [];
    let activeCount = 0;
    let totalRewards = BigInt(0);

    for (let i = 0; i < maxCount; i++) {
      const result = data[i];
      if (result?.status !== "success" || !result.result) continue;

      const sub = result.result;
      const principal = sub[0];
      if (principal === BigInt(0)) continue;

      const accumulatedRewards = sub[4];
      const cancelled = sub[6];
      const expired = sub[7];
      const matured = sub[14];
      const isActive = !cancelled && !expired && !matured;

      allSubs.push({
        branch: branchAddress,
        index: i,
        principal,
        startTime: sub[1],
        activationTime: sub[2],
        duration: sub[3],
        accumulatedRewards,
        lastProcessedWeek: sub[5],
        cancelled,
        expired,
        planId: sub[8],
        miningCapital: sub[9],
        rewardDebt: sub[10],
        withdrawableBTC: sub[11],
        reinvestReserveBTC: sub[12],
        autoRoll: sub[13],
        matured,
        miningActive: sub[15],
        isActive,
      });

      if (isActive) activeCount++;
      totalRewards += accumulatedRewards;
    }

    return { activeCount, totalRewards, subscriptions: allSubs };
  }, [data, branchAddress, maxCount]);

  return {
    ...stats,
    isLoading: branchLoading || isLoading,
    isError,
    refetch,
  };
};

export default useUserSubscriptions;
