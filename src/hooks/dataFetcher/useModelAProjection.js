import { useMemo } from "react";
import { useReadContracts } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";
import useUserBranch from "./useUserBranch";

const useModelAProjection = (userAddress, subIndex) => {
  const { branchAddress, isLoading: branchLoading } =
    useUserBranch(userAddress);

  // Batch read: previewSubscription, getCurrentWeek, weekSeconds
  const { data, isLoading, isError } = useReadContracts({
    contracts: [
      {
        address: branchAddress,
        abi: BranchExtensionABI,
        functionName: "previewSubscription",
        args: [userAddress, BigInt(subIndex)],
      },
      {
        address: branchAddress,
        abi: BranchExtensionABI,
        functionName: "getCurrentWeek",
      },
      {
        address: branchAddress,
        abi: BranchExtensionABI,
        functionName: "weekSeconds",
      },
    ],
    query: {
      enabled: !!branchAddress && !!userAddress && subIndex >= 0,
    },
  });

  const currentWeek =
    data?.[1]?.status === "success" ? Number(data[1].result) : 0;

  // Read last 4 weekly percentages
  const weekContracts = useMemo(() => {
    if (!branchAddress || !currentWeek) return [];
    return [0, 1, 2, 3]
      .map((i) => currentWeek - i)
      .filter((w) => w > 0)
      .map((w) => ({
        address: branchAddress,
        abi: BranchExtensionABI,
        functionName: "weeklyLiquidityPercent",
        args: [BigInt(w)],
      }));
  }, [branchAddress, currentWeek]);

  const { data: weekData, isLoading: weekLoading } = useReadContracts({
    contracts: weekContracts,
    query: { enabled: weekContracts.length > 0 },
  });

  const projection = useMemo(() => {
    if (!data || !data[0] || data[0].status !== "success") return null;

    const subData = data[0].result;
    const weekSec =
      data[2]?.status === "success" ? Number(data[2].result) : 604800;

    // subData is a tuple: [snapshot, pendingReward]
    const snapshot = subData[0];
    const pendingReward = Number(snapshot ? subData[1] : 0) / 1e18;

    if (!snapshot) return null;

    const principal = Number(snapshot["principal"]) / 1e18;
    const activationTime = Number(snapshot["activationTime"]);
    const duration = Number(snapshot["duration"]);
    const accRewards = Number(snapshot["accumulatedRewards"]) / 1e18;
    const planId = Number(snapshot["planId"]);
    
    // Only Model A (planId === 0)
    if (planId !== 0) return null;

    const totalEarned = accRewards + pendingReward;

    // Find latest non-zero weekly percent
    let latestPercent = 0;
    if (weekData) {
      for (const wd of weekData) {
        if (wd?.status === "success" && Number(wd.result) > 0) {
          latestPercent = Number(wd.result);
          break;
        }
      }
    }

    const now = Math.floor(Date.now() / 1000);
    const totalWeeks = Math.ceil(duration / weekSec);
    const elapsedWeeks = Math.max(
      0,
      Math.floor((now - activationTime) / weekSec),
    );
    const remainingWeeks = Math.max(0, totalWeeks - elapsedWeeks);

    const weeklyRate = latestPercent / 10000;

    let projected = principal + totalEarned;
    for (let i = 0; i < remainingWeeks; i++) {
      projected += projected * weeklyRate;
    }

    const PTR = projected - principal;
    const PTG = principal > 0 ? ((projected - principal) / principal) * 100 : 0;


    return {
      principal,
      totalEarned,
      remainingWeeks,
      totalWeeks,
      elapsedWeeks,
      weeklyRatePercent: weeklyRate * 100,
      PTR,
      PTG,
      projectedTotal: projected,
      pendingReward,
    };
  }, [data, weekData]);

  return {
    projection,
    isLoading: branchLoading || isLoading || weekLoading,
    isError,
  };
};

export default useModelAProjection;
