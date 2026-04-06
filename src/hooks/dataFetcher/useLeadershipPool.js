import { useReadContracts } from "wagmi";
import { LeadershipPoolABI } from "@/constants/abis";
import { LeadershipPool_Address } from "@/constants/contracts";

const useLeadershipPool = (userAddress) => {
  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      {
        address: LeadershipPool_Address,
        abi: LeadershipPoolABI,
        functionName: "qualified",
        args: [userAddress],
      },
      {
        address: LeadershipPool_Address,
        abi: LeadershipPoolABI,
        functionName: "leaderSales",
        args: [userAddress],
      },
      {
        address: LeadershipPool_Address,
        abi: LeadershipPoolABI,
        functionName: "previewClaim",
        args: [userAddress],
      },
      {
        address: LeadershipPool_Address,
        abi: LeadershipPoolABI,
        functionName: "qualifiedCount",
      },
      {
        address: LeadershipPool_Address,
        abi: LeadershipPoolABI,
        functionName: "totalQualifiedSales",
      },
      {
        address: LeadershipPool_Address,
        abi: LeadershipPoolABI,
        functionName: "minLeaderSales",
      },
      {
        address: LeadershipPool_Address,
        abi: LeadershipPoolABI,
        functionName: "minQualifiedLeaders",
      },
      {
        address: LeadershipPool_Address,
        abi: LeadershipPoolABI,
        functionName: "getLeaders",
      },
    ],
    query: { enabled: !!userAddress },
  });

  const isQualified = data?.[0]?.status === "success" ? data[0].result : false;
  const leaderSales = data?.[1]?.status === "success" ? data[1].result : BigInt(0);
  const claimableBTC = data?.[2]?.status === "success" ? data[2].result : BigInt(0);
  const qualifiedCount = data?.[3]?.status === "success" ? data[3].result : BigInt(0);
  const totalQualifiedSales = data?.[4]?.status === "success" ? data[4].result : BigInt(0);
  const minLeaderSales = data?.[5]?.status === "success" ? data[5].result : BigInt(0);
  const minQualifiedLeaders = data?.[6]?.status === "success" ? data[6].result : BigInt(0);
  const leaders = data?.[7]?.status === "success" ? data[7].result : [];

  return {
    isQualified,
    leaderSales,
    claimableBTC,
    qualifiedCount,
    totalQualifiedSales,
    minLeaderSales,
    minQualifiedLeaders,
    leaders,
    isLoading,
    refetch,
  };
};

export default useLeadershipPool;
