import { motion } from "framer-motion";
import { GitBranch, Wallet, Settings2, BarChart3, Send } from "lucide-react";
import StatCard from "./StatCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const wallets = [
  { label: "Trading Wallet", value: "$18,400", pct: 72 },
  { label: "Branch Wallet", value: "$6,200", pct: 45 },
  { label: "Passive Income Pool", value: "$3,800", pct: 28 },
];

const BranchSection = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Branch Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your branch configuration & performance</p>
      </div>
      <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
        <Settings2 className="h-4 w-4 mr-2" /> Configure
      </Button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard title="Total Members" value="148" icon={GitBranch} trend={{ value: "+12 this week", positive: true }} />
      <StatCard title="Weekly Performance" value="4.2%" icon={BarChart3} trend={{ value: "+0.3%", positive: true }} />
      <StatCard title="Total Distributed" value="$42,800" icon={Wallet} />
    </div>

    {/* Wallets */}
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-6">
      <h3 className="font-display font-semibold text-foreground mb-4">Wallet Balances</h3>
      <div className="space-y-5">
        {wallets.map((w) => (
          <div key={w.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{w.label}</span>
              <span className="text-sm font-medium text-foreground">{w.value}</span>
            </div>
            <Progress value={w.pct} className="h-2 bg-secondary [&>div]:bg-primary" />
          </div>
        ))}
      </div>
    </motion.div>

    {/* Weekly Submission */}
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6">
      <h3 className="font-display font-semibold text-foreground mb-4">Submit Weekly Performance</h3>
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground block mb-2">Reward Percentage (%)</label>
          <input
            type="number"
            placeholder="e.g. 4.5"
            className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6">
          <Send className="h-4 w-4 mr-2" /> Submit
        </Button>
      </div>
    </motion.div>
  </div>
);

export default BranchSection;
