import { useReadContracts } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";
import { formatUnits } from "viem";

const poolStateNames = ["pool1State", "pool2State", "pool3State", "pool4State"];

const useTotalDistributed = (branchAddress) => {
  const { data, isLoading } = useReadContracts({
    contracts: poolStateNames.map((fn) => ({
      address: branchAddress,
      abi: BranchExtensionABI,
      functionName: fn,
    })),
    query: { enabled: !!branchAddress },
  });

  let total = 0n;
  if (data) {
    for (const item of data) {
      if (item?.result?.[1]) {
        total += item.result[1];
      }
    }
  }

  const formatted = total > 0n
    ? `$${parseFloat(formatUnits(total, 18)).toLocaleString()}`
    : "$0";

  return { totalDistributed: formatted, totalDistributedRaw: total, isLoading };
};

export default useTotalDistributed;
