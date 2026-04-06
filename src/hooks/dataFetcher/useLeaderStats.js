import { useReadContracts } from "wagmi";
import { LeadershipPoolABI } from "@/constants/abis";
import { LeadershipPool_Address } from "@/constants/contracts";

/**
 * Fetches sales + claimable for a single leader address.
 */
const useLeaderStats = (leaderAddress) => {
  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        address: LeadershipPool_Address,
        abi: LeadershipPoolABI,
        functionName: "leaderSales",
        args: [leaderAddress],
      },
      {
        address: LeadershipPool_Address,
        abi: LeadershipPoolABI,
        functionName: "previewClaim",
        args: [leaderAddress],
      },
    ],
    query: { enabled: !!leaderAddress },
  });

  const sales = data?.[0]?.status === "success" ? data[0].result : BigInt(0);
  const claimable = data?.[1]?.status === "success" ? data[1].result : BigInt(0);

  return { sales, claimable, isLoading };
};

export default useLeaderStats;
