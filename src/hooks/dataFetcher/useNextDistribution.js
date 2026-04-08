import { useMemo } from "react";
import { useReadContracts } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";
import useUserBranch from "./useUserBranch";

/**
 * @param {string} userAddress
 * @param {"week"|"month"} mode - "week" uses weekSeconds/getCurrentWeek, "month" uses monthSeconds/getCurrentMonth
 */
const useNextDistribution = (userAddress, mode = "month") => {
  const { branchAddress, isLoading: branchLoading } = useUserBranch(userAddress);

  const periodFn = mode === "week" ? "weekSeconds" : "monthSeconds";
  const currentFn = mode === "week" ? "getCurrentWeek" : "getCurrentMonth";

  const { data, isLoading, isError } = useReadContracts({
    contracts: [
      { address: branchAddress, abi: BranchExtensionABI, functionName: "epochStart" },
      { address: branchAddress, abi: BranchExtensionABI, functionName: periodFn },
      { address: branchAddress, abi: BranchExtensionABI, functionName: currentFn },
    ],
    query: { enabled: !!branchAddress },
  });

  const countdown = useMemo(() => {
    if (!data) return { display: "—", secondsLeft: 0 };

    const epochStart = data[0]?.status === "success" ? Number(data[0].result) : 0;
    const periodSecs = data[1]?.status === "success" ? Number(data[1].result) : 0;
    const currentPeriod = data[2]?.status === "success" ? Number(data[2].result) : 0;

    if (!epochStart || !periodSecs) return { display: "—", secondsLeft: 0 };

    const nextPeriodStart = epochStart + currentPeriod * periodSecs;
    const now = Math.floor(Date.now() / 1000);
    const secondsLeft = nextPeriodStart - now;

    if (secondsLeft <= 0) return { display: "Now", secondsLeft: 0 };

    const days = Math.floor(secondsLeft / 86400);
    const hours = Math.floor((secondsLeft % 86400) / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const secs = secondsLeft % 60;

    return {
      days,
      hours,
      minutes,
      seconds: secs,
      display: `${days}d ${hours}h ${minutes}m ${secs}s`,
      secondsLeft,
    };
  }, [data]);

  return {
    ...countdown,
    isLoading: branchLoading || isLoading,
    isError,
  };
};

export default useNextDistribution;
