import { motion } from "framer-motion";
import { Wallet, BarChart3, Settings2, Users, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import StatCard from "@/components/dashboard/StatCard";
import { wallets } from "./constants";
import useBranchConfig from "@/hooks/dataFetcher/useBranchConfig";
import { Branch_Address } from "@/constants/contracts";

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
  // TODO: Replace with user's actual branch address once the lookup function is available
  const branchAddress = Branch_Address;
  const config = useBranchConfig(branchAddress);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Members" value="—" icon={Users} />
        <StatCard title="Weekly Performance" value="—" icon={BarChart3} />
        <StatCard title="Total Distributed" value="—" icon={Wallet} />
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Wallet Balances
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
    </div>
  );
};

export default BranchDashboardTab;
