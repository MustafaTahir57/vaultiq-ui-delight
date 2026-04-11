import {
  Send, DollarSign, Pickaxe, RefreshCw,
  ToggleLeft, ShieldPlus, ArrowRightLeft, LockKeyhole,
  Settings2, SplitSquareVertical, ArrowDownToLine, ArrowUpFromLine, Clock
} from "lucide-react";

export const protocolFunctions = [
  {
    icon: Send,
    name: "submitWeeklyPerformance",
    selector: "-",
    desc: "Submit weekly compounding rate. Distributes previous week's pool queues. Once per week.",
    params: "liquidityPercent (BPS, e.g. 420 = 4.2%)",
  },
  {
    icon: ToggleLeft,
    name: "setPlanActive",
    selector: "—",
    desc: "Enable or disable a subscription plan by its planId.",
    params: "planId (1+), active (bool)",
  },
  {
    icon: Pickaxe,
    name: "setMiningRevenueDistributor",
    selector: "—",
    desc: "Set MiningRevenueDistributor contract for Model B BTC mining.",
    params: "distributor address",
  },
  {
    icon: DollarSign,
    name: "setBTCBToken",
    selector: "—",
    desc: "Set BTCB token address for Model B claims.",
    params: "BTCB token address",
  },
  {
    icon: RefreshCw,
    name: "processPassiveMonth",
    selector: "—",
    desc: "Process passive pool deposit for a completed month. Required before users can claim.",
    params: "monthIndex",
  },
  {
    icon: ShieldPlus,
    name: "grantRole",
    selector: "—",
    desc: "Grant BRANCH_MANAGER_ROLE to an address, authorizing them to manage this branch.",
    params: "account address",
  },
  {
    icon: ArrowRightLeft,
    name: "transferBranchOwnership",
    selector: "—",
    desc: "Transfer ownership of this branch to a new address via VaultIQMain.",
    params: "newOwner address",
  },
  {
    icon: LockKeyhole,
    name: "setPoolLocked",
    selector: "—",
    desc: "Lock or unlock a specific pool. Locked pools prevent users from claiming rewards.",
    params: "poolId (1-4), locked (bool)",
  },
  {
    icon: Settings2,
    name: "setPoolRule",
    selector: "—",
    desc: "Set qualification & maintenance thresholds for a pool. Sales values use 18 decimals (USDC).",
    params: "poolId (1-4), salesRequirement, maintenanceThreshold",
  },
  {
    icon: SplitSquareVertical,
    name: "setMaintenanceSplitPercent",
    selector: "—",
    desc: "Set close-team (L1-L3) vs deep-team (L4+) split for maintenance sales. Must total 10000 BPS.",
    params: "closePct (BPS), deepPct (BPS)",
  },
  {
    icon: ArrowDownToLine,
    name: "depositLiquidity",
    selector: "—",
    desc: "Deposit USDC liquidity into the branch trading pool. Requires prior token approval.",
    params: "amount (USDC)",
  },
  {
    icon: ArrowUpFromLine,
    name: "withdrawLiquidity",
    selector: "—",
    desc: "Withdraw USDC liquidity from the branch trading pool.",
    params: "amount (USDC)",
  },
  {
    icon: Clock,
    name: "setTestingTimeConfig",
    selector: "—",
    desc: "Override week/month/activation durations for testing. Use with caution on mainnet.",
    params: "weekSeconds, monthSeconds, activationDelay",
  },
];

export const wallets = [
  { label: "Trading Wallet (Branch USDC)", desc: "USDT held in branch for compounding", value: "—", pct: 0 },
  { label: "Branch Wallet", desc: "Branch commission wallet balance", value: "—", pct: 0 },
  { label: "Passive Income Pool", desc: "Undistributed passive pool", value: "—", pct: 0 },
];

export const configFields = [
  { label: "Branch Name", key: "branchName" },
  { label: "USDC Token", key: "usdc" },
  { label: "Branch Wallet", key: "branchWallet" },
  { label: "Founders Wallet", key: "foundersWallet" },
  { label: "Liquidity Type", key: "liquidityType" },
  { label: "Epoch Start", key: "epochStart" },
  { label: "Current Week", key: "currentWeek" },
  { label: "Current Month", key: "currentMonth" },
  { label: "Total Mining Capital", key: "totalMiningCapital" },
];

export const coreConfigFields = [
  { label: "Liquidity Allocation", field: "liquidityAllocation", default: "7600 (76%)" },
  { label: "Direct Bonus", field: "directBonusPercent", default: "500 (5%)" },
  { label: "Branch Commission", field: "branchCommissionPercent", default: "300 (3%)" },
  { label: "Protocol Fee", field: "feePercent", default: "800 (8%)" },
  { label: "Founders", field: "foundersPercent", default: "200 (2%)" },
  { label: "Pool 1", field: "pool1Percent", default: "150 (1.5%)" },
  { label: "Pool 2", field: "pool2Percent", default: "150 (1.5%)" },
  { label: "Pool 3", field: "pool3Percent", default: "150 (1.5%)" },
  { label: "Pool 4", field: "pool4Percent", default: "150 (1.5%)" },
];

export const expiryConfigFields = [
  { label: "Protocol Fee at Expiry", field: "feePercent", default: "4000 (40%)" },
  { label: "Branch at Expiry", field: "branchPercent", default: "4000 (40%)" },
  { label: "Passive Income at Expiry", field: "passiveIncomePercent", default: "2000 (20%)" },
];
