import { useMemo } from "react";
import { useReadContracts } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";
import { BranchExtension_Address } from "@/constants/contracts";
import useRegisteredBranches from "./useRegisteredBranches";

const MAX_SUBS_PER_BRANCH = 20;

const useUserSubscriptions = (userAddress) => {
  const { branches, isLoading: branchesLoading } = useRegisteredBranches();

  const contracts = useMemo(() => {
    if (!userAddress || !branches?.length) return [];

    return branches.flatMap((branchAddress) =>
      Array.from({ length: MAX_SUBS_PER_BRANCH }, (_, i) => ({
        address: BranchExtension_Address,
        abi: BranchExtensionABI,
        functionName: "userSubscriptions",
        args: [userAddress, BigInt(i)],
      }))
    );
  }, [userAddress, branches]);

  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts,
    query: { enabled: contracts.length > 0 },
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

        if (principal === BigInt(0)) continue;

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
