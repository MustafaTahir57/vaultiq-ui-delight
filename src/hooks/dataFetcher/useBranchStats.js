import { useMemo } from "react";
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
      { address: branchAddress, abi: BranchExtensionABI, functionName: "liquidityType" },
    ],
    query: { enabled: !!branchAddress },
  });

  const totalMembers = batchData?.[0]?.result;
  const currentWeek = batchData?.[1]?.result;
  const currentMonth = batchData?.[2]?.result;
  const branchWallet = batchData?.[3]?.result;  
  const liquidityType = batchData?.[4]?.result

  console.log("liquidityType", liquidityType)

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

  // Passive pool: sum passiveQueuedByMonth(1..currentMonth)
  const monthCount = currentMonth !== undefined ? Number(currentMonth) : 0;
  const passiveContracts = useMemo(() => {
    if (!branchAddress || monthCount <= 0) return [];
    return Array.from({ length: monthCount }, (_, i) => ({
      address: branchAddress,
      abi: BranchExtensionABI,
      functionName: "passiveQueuedByMonth",
      args: [i + 1],
    }));
  }, [branchAddress, monthCount]);

  const { data: passiveData, isLoading: passiveLoading } = useReadContracts({
    contracts: passiveContracts,
    query: { enabled: passiveContracts.length > 0 },
  });

  const passivePoolTotal = useMemo(() => {
    if (!passiveData) return 0n;
    return passiveData.reduce((sum, item) => {
      if (item?.status === "success" && item.result) return sum + BigInt(item.result);
      return sum;
    }, 0n);
  }, [passiveData]);

  const formatUSDT = (val) => {
    if (val === undefined || val === null) return "—";
    return `$${parseFloat(formatUnits(val, 18)).toLocaleString()}`;
  };


  return {
    totalMembers: totalMembers?.toString() ?? "—",
    currentWeek: currentWeek?.toString() ?? "—",
    currentMonth: currentMonth?.toString() ?? "—",
    weeklyPerformance: weeklyPerfData !== undefined ? `${weeklyPerfData.toString()/100}%` : "—",
    tradingWalletBalance: formatUSDT(tradingBalance),
    branchWalletBalance: formatUSDT(branchWalletBalance),
    passivePoolBalance: formatUSDT(passivePoolTotal),
    tradingWalletRaw: tradingBalance,
    branchWalletRaw: branchWalletBalance,
    passivePoolRaw: passivePoolTotal,
    isLoading: batchLoading || perfLoading || tradingLoading || walletLoading || passiveLoading,
  };
};

export default useBranchStats;
