import { useReadContracts } from "wagmi";
import { BranchViewsABI } from "@/constants/abis";
import { formatUnits } from "viem";

const useReferralData = (branchAddress, userAddress) => {
  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts: [
      {
        address: branchAddress,
        abi: BranchViewsABI,
        functionName: "getReferralData",
        args: [userAddress],
      },
      {
        address: branchAddress,
        abi: BranchViewsABI,
        functionName: "getReferralTreeCounts",
        args: [userAddress],
      },
    ],
    query: {
      enabled: !!branchAddress && !!userAddress,
    },
  });

  const referralData = data?.[0]?.result;
  const treeCounts = data?.[1]?.result;

  const fmt = (val) => (val ? formatUnits(val, 18) : "0");

  const parsed = referralData
    ? {
        totalTeamSales: fmt(referralData.totalTeamSales),
        level1Sales: fmt(referralData.level1Sales),
        level2Sales: fmt(referralData.level2Sales),
        level3Sales: fmt(referralData.level3Sales),
        level4PlusSales: fmt(referralData.level4PlusSales),
        weeklyTeamSalesThisWeek: fmt(referralData.weeklyTeamSalesThisWeek),
        pool3Depth3PlusCount: Number(referralData.pool3Depth3PlusCount || 0),
        isPool1Qualified: referralData.isPool1Qualified,
        isPool2Qualified: referralData.isPool2Qualified,
        isPool3Qualified: referralData.isPool3Qualified,
        isPool4Qualified: referralData.isPool4Qualified,
        isPassiveQualified: referralData.isPassiveQualified,
        myReferrer: referralData.myReferrer,
        isMemberOfBranch: referralData.isMemberOfBranch,
        branchTotalMembers: Number(referralData.branchTotalMembers || 0),
        currentWeek: Number(referralData.currentWeek || 0),
      }
    : null;

  const tree = treeCounts
    ? {
        l1Members: Number(treeCounts[0] || 0),
        l2Members: Number(treeCounts[1] || 0),
        l3Members: Number(treeCounts[2] || 0),
        l4Members: Number(treeCounts[3] || 0),
        l1Active: Number(treeCounts[4] || 0),
        l2Active: Number(treeCounts[5] || 0),
        l3Active: Number(treeCounts[6] || 0),
        l4Active: Number(treeCounts[7] || 0),
      }
    : null;

  return { referralData: parsed, treeCounts: tree, isLoading, isError, refetch };
};

export default useReferralData;
