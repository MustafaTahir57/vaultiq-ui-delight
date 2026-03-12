import { motion } from "framer-motion";
import { Wallet, BarChart3, Settings2, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import StatCard from "@/components/dashboard/StatCard";
import { wallets, configFields } from "./constants";

const BranchDashboardTab = () => (
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
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {configFields.map((f) => (
          <div key={f.key} className="bg-secondary/50 border border-border rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">{f.label}</p>
            <p className="text-sm font-mono text-foreground">—</p>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

export default BranchDashboardTab;
