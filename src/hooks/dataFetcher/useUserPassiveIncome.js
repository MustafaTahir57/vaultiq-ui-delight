import { useMemo } from "react";
import { useReadContracts } from "wagmi";
import { BranchABI } from "@/constants/abis";
import useRegisteredBranches from "./useRegisteredBranches";

/**
 * Reads passive income data for a user across all branches.
 * - level1Sales: direct sales volume (used for passive qualification)
 * - passiveSalesThreshold: threshold needed to qualify
 */
const useUserPassiveIncome = (userAddress) => {
  const { branches, isLoading: branchesLoading } = useRegisteredBranches();

  const contracts = useMemo(() => {
    if (!userAddress || !branches?.length) return [];

    return branches.flatMap((branchAddress) => [
      {
        address: branchAddress,
        abi: BranchABI,
        functionName: "level1Sales",
        args: [userAddress],
      },
      {
        address: branchAddress,
        abi: BranchABI,
        functionName: "passiveSalesThreshold",
      },
    ]);
  }, [userAddress, branches]);

  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts,
    query: {
      enabled: contracts.length > 0,
    },
  });

  const passiveData = useMemo(() => {
    if (!data || !branches?.length) {
      return { totalPassiveQualifiedSales: BigInt(0), branches: [], isQualifiedAny: false };
    }

    let totalPassiveQualifiedSales = BigInt(0);
    let isQualifiedAny = false;
    const branchData = [];

    branches.forEach((branchAddress, i) => {
      const level1Sales = data[i * 2]?.status === "success" ? data[i * 2].result : BigInt(0);
      const threshold = data[i * 2 + 1]?.status === "success" ? data[i * 2 + 1].result : BigInt(0);
      const qualified = threshold > BigInt(0) && level1Sales >= threshold;

      if (qualified) {
        isQualifiedAny = true;
        totalPassiveQualifiedSales += level1Sales;
      }

      branchData.push({ branch: branchAddress, level1Sales, threshold, qualified });
    });

    return { totalPassiveQualifiedSales, branches: branchData, isQualifiedAny };
  }, [data, branches]);

  return {
    ...passiveData,
    isLoading: branchesLoading || isLoading,
    isError,
    refetch,
  };
};

export default useUserPassiveIncome;
