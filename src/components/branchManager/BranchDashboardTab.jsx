import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, BarChart3, Settings2, Users, Loader2, Plus, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatCard from "@/components/dashboard/StatCard";
import AddPlanModal from "@/components/dashboard/AddPlanModal";
import useBranchConfig from "@/hooks/dataFetcher/useBranchConfig";
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

const BranchDashboardTab = ({ selectedBranch, setSelectedBranch, userBranchAddresses }) => {
  const [addPlanOpen, setAddPlanOpen] = useState(false);

  const config = useBranchConfig(selectedBranch || undefined);
  const stats = useBranchStats(selectedBranch || undefined);
  const { totalDistributed } = useTotalDistributed(selectedBranch || undefined);

  const isBranchMode = stats.liquidityType === 0;
  const modeLabel = isBranchMode ? "Branch Mode" : stats.liquidityType === 1 ? "Treasury Mode" : "—";

  const wallets = [
    { label: "Total Liquidity", desc: "USDT held by branch contract", value: stats.totalLiquidity },
    { label: "Passive Income Pool", desc: "Passive income allocation", value: stats.passivePoolBalance },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Members" value={stats.totalMembers} icon={Users} />
        <StatCard title="Weekly Performance" value={stats.weeklyPerformance} icon={BarChart3} />
        <StatCard title="Total Distributed" value={totalDistributed} icon={Wallet} />
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
          <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-border bg-secondary/50 text-foreground">
            {modeLabel}
          </span>
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
