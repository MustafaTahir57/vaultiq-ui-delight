import {
  Layers, Settings, Send, Plus, Clock, DollarSign, Pickaxe, RefreshCw,
  FileText, ToggleLeft, Database, Percent, TrendingUp, Zap
} from "lucide-react";

export const protocolFunctions = [
  {
    icon: Layers,
    name: "setPoolRule",
    selector: "0x31609f0f",
    desc: "Configure distribution rules and allocation parameters for branch reward pools.",
    params: "poolId (1-4), salesRequirement (USDT), maintenanceThreshold",
  },
  {
    icon: Settings,
    name: "setPrincipalTier",
    selector: "0x9a919f94",
    desc: "Allow or disallow specific principal amounts when tier validation is enabled.",
    params: "principal (e.g. 500 USDT), allowed (true/false)",
  },
  {
    icon: Clock,
    name: "setTestingTimeConfig",
    selector: "0xed5712cf",
    desc: "Override time constants for testing environments (week, month, delay).",
    params: "weekSec, monthSec, activationDelay",
  },
  {
    icon: Send,
    name: "submitWeeklyPerformance",
    selector: "0x2ceb41f9",
    desc: "Submit weekly compounding rate. Distributes previous week's pool queues. Once per week.",
    params: "liquidityPercent (BPS, e.g. 420 = 4.2%)",
  },
  {
    icon: Plus,
    name: "addSubscriptionPlan",
    selector: "—",
    desc: "Add a new Model A or Model B subscription plan. Returns new planId.",
    params: "SubscriptionPlan struct",
  },
  {
    icon: ToggleLeft,
    name: "setPlanActive",
    selector: "—",
    desc: "Enable or disable a subscription plan by its planId.",
    params: "planId (1+), active (bool)",
  },
  {
    icon: Database,
    name: "setLiquidityType",
    selector: "—",
    desc: "Switch between branch-managed (0) and treasury-managed (1) liquidity modes.",
    params: "type: 0 = BRANCH, 1 = TREASURY",
  },
  {
    icon: Percent,
    name: "updateCoreConfig",
    selector: "—",
    desc: "Update all distribution percentages at once. All values must sum to 10,000 BPS.",
    params: "CoreConfig struct (11 fields)",
  },
  {
    icon: FileText,
    name: "updateExpiryConfig",
    selector: "—",
    desc: "Update expiry principal split percentages. Must sum to 10,000 BPS.",
    params: "ExpiryConfig struct (3 fields)",
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
    icon: TrendingUp,
    name: "setPassiveSalesThreshold",
    selector: "—",
    desc: "Minimum team sales needed for passive pool qualification.",
    params: "amount (USDT)",
  },
  {
    icon: RefreshCw,
    name: "processPassiveMonth",
    selector: "—",
    desc: "Process passive pool deposit for a completed month. Required before users can claim.",
    params: "monthIndex",
  },
  {
    icon: Zap,
    name: "requestLiquidityAllocationChange",
    selector: "—",
    desc: "Request governance approval for liquidity BPS change via VaultIQMain.",
    params: "newBps",
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
  { label: "Liquidity Allocation", field: "liquidityAllocation", default: "7200 (72%)" },
  { label: "Direct Bonus", field: "directBonusPercent", default: "500 (5%)" },
  { label: "Branch Commission", field: "branchCommissionPercent", default: "300 (3%)" },
  { label: "Protocol Fee", field: "feePercent", default: "800 (8%)" },
  { label: "Founders", field: "foundersPercent", default: "200 (2%)" },
  { label: "Pool 1", field: "pool1Percent", default: "150 (1.5%)" },
  { label: "Pool 2", field: "pool2Percent", default: "150 (1.5%)" },
  { label: "Pool 3", field: "pool3Percent", default: "150 (1.5%)" },
  { label: "Pool 4", field: "pool4Percent", default: "150 (1.5%)" },
  { label: "Passive Income", field: "passiveIncomePercent", default: "200 (2%)" },
];

export const expiryConfigFields = [
  { label: "Protocol Fee at Expiry", field: "feePercent", default: "4000 (40%)" },
  { label: "Branch at Expiry", field: "branchPercent", default: "4000 (40%)" },
  { label: "Passive Income at Expiry", field: "passiveIncomePercent", default: "2000 (20%)" },
];
