import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, BarChart3, Settings2, Users, Loader2, Plus, Calendar, CalendarDays } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatCard from "@/components/dashboard/StatCard";
import AddPlanModal from "@/components/dashboard/AddPlanModal";
import { useAccount } from "wagmi";
import useBranchConfig from "@/hooks/dataFetcher/useBranchConfig";
import useUserBranches from "../../hooks/dataFetcher/useUserBranches";
import useBranchStats from "@/hooks/dataFetcher/useBranchStats";
import useTotalDistributed from "@/hooks/dataFetcher/useTotalDistributed";

const configFieldMap = [
  { label: "Branch Name", key: "branchName" },
  { label: "USDC Token", key: "usdc", isAddress: true },
  { label: "Branch Wallet", key: "branchWallet", isAddress: true },
  { label: "Founders Wallet", key: "foundersWallet", isAddress: true },
  { label: "Liquidity Type", key: "liquidityType" },
  { label: "Epoch Start", key: "epochStart" },
  { label: "Current Week", key: "currentWeek" },
  { label: "Current Month", key: "currentMonth" },
  { label: "Total Mining Capital", key: "totalMiningCapital" },
];

const truncateAddress = (addr) => {
  if (!addr || addr === "—" || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

const BranchDashboardTab = () => {
  const { address } = useAccount();
  const { userBranches: userBranchAddresses } = useUserBranches(address);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [addPlanOpen, setAddPlanOpen] = useState(false);

  useEffect(() => {
    if (userBranchAddresses?.length > 0 && !selectedBranch) {
      setSelectedBranch(userBranchAddresses[0]);
    }
  }, [userBranchAddresses, selectedBranch]);

  const config = useBranchConfig(selectedBranch || undefined);
  const stats = useBranchStats(selectedBranch || undefined);

  const wallets = [
    {
      label: "Trading Wallet",
      desc: "USDT held by branch contract",
      value: stats.tradingWalletBalance,
      pct: 0,
    },
    {
      label: "Branch Wallet",
      desc: "USDT held by branch wallet",
      value: stats.branchWalletBalance,
      pct: 0,
    },
    {
      label: "Passive Income Pool",
      desc: "Passive income allocation",
      value: "$0",
      pct: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Members" value={stats.totalMembers} icon={Users} />
        <StatCard title="Weekly Performance" value={stats.weeklyPerformance} icon={BarChart3} />
        <StatCard title="Total Distributed" value="$0" icon={Wallet} />
        <StatCard title="Current Week" value={stats.currentWeek} icon={Calendar} />
      </div>

      {userBranchAddresses?.length > 1 && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Active Branch:</span>
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-full sm:w-[280px] bg-secondary/50 border-border">
              <SelectValue placeholder="Select a branch" />
            </SelectTrigger>
            <SelectContent>
              {userBranchAddresses.map((addr, i) => (
                <SelectItem key={addr} value={addr}>
                  Branch {i + 1} — {truncateAddress(addr)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={() => setAddPlanOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Add Subscription Plan
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Wallet Balances
          {stats.isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </h3>
        <div className="space-y-5">
          {wallets.map((w) => (
            <div key={w.label}>
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="text-sm text-foreground">{w.label}</span>
                  <p className="text-xs text-muted-foreground">{w.desc}</p>
                </div>
                <span className="text-sm font-medium text-foreground font-mono">{w.value}</span>
              </div>
              <Progress value={w.pct} className="h-2 bg-secondary [&>div]:bg-primary" />
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          Branch Configuration
          {config.isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {configFieldMap.map((f) => (
            <div key={f.key} className="bg-secondary/50 border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">{f.label}</p>
              <p className="text-sm font-mono text-foreground" title={f.isAddress ? config[f.key] : undefined}>
                {f.isAddress ? truncateAddress(config[f.key]) : config[f.key]}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
      <AddPlanModal open={addPlanOpen} onOpenChange={setAddPlanOpen} />
    </div>
  );
};

export default BranchDashboardTab;
