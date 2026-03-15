import { useReadContract } from "wagmi";
import { VaultIQMainABI } from "@/constants/abis";
import { VaultIQMain_Address } from "@/constants/contracts";
import { formatUnits } from "viem";

const useProtocolStats = () => {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: VaultIQMain_Address,
    abi: VaultIQMainABI,
    functionName: "getProtocolStats",
  });

  const stats = data
    ? {
        tvl: Number(formatUnits(data.tvl, 18)),
        activeBranches: Number(data.activeBranches),
        totalActiveMembers: Number(data.totalActiveMembers),
        avgPerformanceBps: Number(data.avgPerformanceBps) / 100, // bps to %
      }
    : null;

  return { stats, isLoading, isError, refetch };
};

export default useProtocolStats;
