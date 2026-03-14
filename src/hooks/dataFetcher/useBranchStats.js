import { useReadContracts, useReadContract } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";
import { ERC20ABI } from "@/constants/erc20Abi";
import { USDT_Address } from "@/constants/contracts";
import { formatUnits } from "viem";

const useBranchStats = (branchAddress) => {
  // First batch: totalMembers, getCurrentWeek, getCurrentMonth, branchWallet
  const { data: batchData, isLoading: batchLoading } = useReadContracts({
    contracts: [
      { address: branchAddress, abi: BranchExtensionABI, functionName: "totalMembers" },
      { address: branchAddress, abi: BranchExtensionABI, functionName: "getCurrentWeek" },
      { address: branchAddress, abi: BranchExtensionABI, functionName: "getCurrentMonth" },
      { address: branchAddress, abi: BranchExtensionABI, functionName: "branchWallet" },
    ],
    query: { enabled: !!branchAddress },
  });

  const totalMembers = batchData?.[0]?.result;
  const currentWeek = batchData?.[1]?.result;
  const currentMonth = batchData?.[2]?.result;
  const branchWallet = batchData?.[3]?.result;

  // Second: weeklyLiquidityPercent(currentWeek)
  const { data: weeklyPerfData, isLoading: perfLoading } = useReadContract({
    address: branchAddress,
    abi: BranchExtensionABI,
    functionName: "weeklyLiquidityPercent",
    args: [currentWeek],
    query: { enabled: !!branchAddress && currentWeek !== undefined },
  });

  // USDT balance of branchAddress (Trading Wallet)
  const { data: tradingBalance, isLoading: tradingLoading } = useReadContract({
    address: USDT_Address,
    abi: ERC20ABI,
    functionName: "balanceOf",
    args: [branchAddress],
    query: { enabled: !!branchAddress },
  });

  // USDT balance of branchWallet (Branch Wallet)
  const { data: branchWalletBalance, isLoading: walletLoading } = useReadContract({
    address: USDT_Address,
    abi: ERC20ABI,
    functionName: "balanceOf",
    args: [branchWallet],
    query: { enabled: !!branchWallet },
  });

  const formatUSDT = (val) => {
    if (val === undefined || val === null) return "—";
    return `$${parseFloat(formatUnits(val, 18)).toLocaleString()}`;
  };

  return {
    totalMembers: totalMembers?.toString() ?? "—",
    currentWeek: currentWeek?.toString() ?? "—",
    currentMonth: currentMonth?.toString() ?? "—",
    weeklyPerformance: weeklyPerfData !== undefined ? `${weeklyPerfData.toString()}%` : "—",
    tradingWalletBalance: formatUSDT(tradingBalance),
    branchWalletBalance: formatUSDT(branchWalletBalance),
    tradingWalletRaw: tradingBalance,
    branchWalletRaw: branchWalletBalance,
    isLoading: batchLoading || perfLoading || tradingLoading || walletLoading,
  };
};

export default useBranchStats;
