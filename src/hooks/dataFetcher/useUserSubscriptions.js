import { useMemo } from "react";
import { useReadContracts } from "wagmi";
import { BranchABI } from "@/constants/abis";
import useRegisteredBranches from "./useRegisteredBranches";

const MAX_SUBS_PER_BRANCH = 20;

/**
 * Fetches all user subscriptions across approved branches.
 * Returns active subscription count, total accumulated rewards, and raw subscription data.
 */
const useUserSubscriptions = (userAddress) => {
  const { branches, isLoading: branchesLoading } = useRegisteredBranches();

  // Build multicall contracts: for each branch, read userSubscriptions at indices 0..MAX-1
  const contracts = useMemo(() => {
    if (!userAddress || !branches?.length) return [];

    return branches.flatMap((branchAddress) =>
      Array.from({ length: MAX_SUBS_PER_BRANCH }, (_, i) => ({
        address: branchAddress,
        abi: BranchABI,
        functionName: "userSubscriptions",
        args: [userAddress, BigInt(i)],
      }))
    );
  }, [userAddress, branches]);

  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts,
    query: {
      enabled: contracts.length > 0,
    },
  });

  const stats = useMemo(() => {
    if (!data || !branches?.length) {
      return { activeCount: 0, totalRewards: BigInt(0), subscriptions: [] };
    }

    const allSubs = [];
    let activeCount = 0;
    let totalRewards = BigInt(0);

    branches.forEach((branchAddress, branchIdx) => {
      for (let i = 0; i < MAX_SUBS_PER_BRANCH; i++) {
        const result = data[branchIdx * MAX_SUBS_PER_BRANCH + i];
        if (result?.status !== "success" || !result.result) continue;

        const sub = result.result;
        // userSubscriptions returns: [principal, startTime, activationTime, duration, accumulatedRewards, lastProcessedWeek, cancelled, expired, planId, miningCapital, rewardDebt, withdrawableBTC, reinvestReserveBTC, autoRoll, matured, miningActive]
        const principal = sub[0];
        const accumulatedRewards = sub[4];
        const cancelled = sub[6];
        const expired = sub[7];
        const matured = sub[14];

        // Skip empty/zero-principal entries
        if (principal === BigInt(0)) continue;

        const isActive = !cancelled && !expired && !matured;

        allSubs.push({
          branch: branchAddress,
          index: i,
          principal,
          accumulatedRewards,
          cancelled,
          expired,
          matured,
          isActive,
          withdrawableBTC: sub[11],
          reinvestReserveBTC: sub[12],
        });

        if (isActive) activeCount++;
        totalRewards += accumulatedRewards;
      }
    });

    return { activeCount, totalRewards, subscriptions: allSubs };
  }, [data, branches]);

  return {
    ...stats,
    isLoading: branchesLoading || isLoading,
    isError,
    refetch,
  };
};

export default useUserSubscriptions;
