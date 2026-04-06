import { useReadContracts } from "wagmi";
import { BranchViewsABI } from "@/constants/abis";

const usePoolCard = (poolId, userAddress, branchAddress) => {
  const viewsAddress = branchAddress;

  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        address: viewsAddress,
        abi: BranchViewsABI,
        functionName: "getPoolFullData",
        args: [poolId],
      },
      {
        address: viewsAddress,
        abi: BranchViewsABI,
        functionName: "getPoolProgress",
        args: [poolId, userAddress],
      },
    ],
    query: { enabled: !!userAddress && !!poolId },
  });

  const fullData = data?.[0]?.result;
  const progress = data?.[1]?.result;

  return {
    // Pool full data
    totalQueued: fullData?.totalQueued ?? 0n,
    totalDistributed: fullData?.totalDistributed ?? 0n,
    undistributed: fullData?.undistributed ?? 0n,
    currentWeekQueued: fullData?.currentWeekQueued ?? 0n,
    qualifiedCount: fullData?.qualifiedCount ? Number(fullData.qualifiedCount) : 0,
    isLocked: fullData?.isLocked ?? true,

    // Pool progress
    currentSales: progress?.currentSales ?? 0n,
    requiredSales: progress?.requiredSales ?? 0n,
    currentWeeklySales: progress?.currentWeeklySales ?? 0n,
    weeklyThreshold: progress?.weeklyThreshold ?? 0n,
    isQualified: progress?.isQualified ?? false,
    wouldQualifyNow: progress?.wouldQualifyNow ?? false,
    salesProgressBps: progress?.salesProgressBps ? Number(progress.salesProgressBps) : 0,
    weeklyProgressBps: progress?.weeklyProgressBps ? Number(progress.weeklyProgressBps) : 0,

    // Close/Deep team breakdown
    closeTeamSales: progress?.closeTeamSales ?? 0n,
    deepTeamSales: progress?.deepTeamSales ?? 0n,
    closeRequired: progress?.closeRequired ?? 0n,
    deepRequired: progress?.deepRequired ?? 0n,
    closeProgressBps: progress?.closeProgressBps ? Number(progress.closeProgressBps) : 0,
    deepProgressBps: progress?.deepProgressBps ? Number(progress.deepProgressBps) : 0,

    isLoading,
  };
};

export default usePoolCard;
