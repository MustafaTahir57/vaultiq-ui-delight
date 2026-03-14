import { useReadContract, useReadContracts } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";
import { BranchExtension_Address } from "@/constants/contracts";

const useBranchPlans = (branchAddress) => {
  const { data: planCount, isLoading: isCountLoading } = useReadContract({
    address: branchAddress || BranchExtension_Address,
    abi: BranchExtensionABI,
    functionName: "getPlanCount",
    query: { enabled: !!branchAddress },
  });

  const count = planCount ? Number(planCount) : 0;

  // Build contract calls for planId 1..count
  const planCalls = Array.from({ length: count }, (_, i) => ({
    address: BranchExtension_Address,
    abi: BranchExtensionABI,
    functionName: "getPlan",
    args: [i + 1],
  }));

  const { data: planResults, isLoading: isPlansLoading } = useReadContracts({
    contracts: planCalls,
    query: { enabled: count > 0 },
  });

  const plans = planResults
    ? planResults
        .map((r, i) => (r.status === "success" ? { id: i + 1, ...r.result } : null))
        .filter(Boolean)
    : [];

  return {
    plans,
    planCount: count,
    isLoading: isCountLoading || isPlansLoading,
  };
};

export default useBranchPlans;
