import { useReadContracts } from "wagmi";
import { BranchABI } from "@/constants/abis";
import { formatUnits } from "viem";

const PLAN_IDS = [0,1,2,3,4,5];

const useBranchPlansData = (branchAddress) => {
  const contracts = PLAN_IDS.map((id) => ({
    address: branchAddress,
    abi: BranchABI,
    functionName: "plans",
    args: [id],
  }));

  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts,
    query: { enabled: !!branchAddress },
  });
  
  const plans = data
    ? data
        .map((r, i) => {
          if (r.status !== "success" || !r.result) return null;
          const [
            name,
            modelType,
            core,
            expiry,
            hashTreasury,
            feeTreasury,
            leadershipPool,
            active,
            price,
            duration,
            hashRate,
          ] = r.result;

          const durationDays = Number(duration) / (24 * 60 * 60);

          return {
            id: PLAN_IDS[i],
            name,
            modelType: Number(modelType),
            active,
            price: formatUnits(price, 18),
            priceRaw: price,
            duration: Number(duration),
            durationDays: Math.round(durationDays),
            hashRate: hashRate?.toString() ?? "0",
            core,
            expiry,
            hashTreasury,
            feeTreasury,
            leadershipPool,
          };
        })
        .filter(Boolean)
    : [];

  return { plans, isLoading, isError, refetch };
};

export default useBranchPlansData;
