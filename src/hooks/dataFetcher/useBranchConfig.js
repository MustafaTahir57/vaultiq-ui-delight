import { useReadContracts } from "wagmi";
import { BranchABI } from "@/constants/abis";
import { formatUnits } from "viem";

const branchFunctions = [
  "branchName",
  "usdc",
  "branchWallet",
  "foundersWallet",
  "liquidityType",
  "epochStart",
  "getCurrentWeek",
  "getCurrentMonth",
  "totalMiningCapitalDeployed",
];

const useBranchConfig = (branchAddress) => {
  console.log("branchAddress", branchAddress)
  const contracts = branchFunctions.map((functionName) => ({
    address: branchAddress,
    abi: BranchABI,
    functionName,
  }));

  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts,
    query: { enabled: !!branchAddress },
  });

  console.log("branch Data", data)

  const get = (index) => data?.[index]?.result;

  const liquidityTypeRaw = get(4);
  const epochStartRaw = get(5);
  const totalMiningRaw = get(8);

  return {
    branchName: get(0) ?? "—",
    usdc: get(1) ?? "—",
    branchWallet: get(2) ?? "—",
    foundersWallet: get(3) ?? "—",
    liquidityType:
      liquidityTypeRaw !== undefined
        ? liquidityTypeRaw === 0
          ? "BRANCH"
          : "TREASURY"
        : "—",
    epochStart:
      epochStartRaw
        ? new Date(Number(epochStartRaw) * 1000).toLocaleDateString()
        : "—",
    currentWeek: get(6)?.toString() ?? "—",
    currentMonth: get(7)?.toString() ?? "—",
    totalMiningCapital:
      totalMiningRaw
        ? `${parseFloat(formatUnits(totalMiningRaw, 18)).toLocaleString()} USDC`
        : "—",
    isLoading,
    isError,
    refetch,
  };
};

export default useBranchConfig;
