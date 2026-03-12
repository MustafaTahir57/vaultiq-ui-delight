import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Shield, Layers, Settings, Send, ArrowRight, Terminal, Lock, AlertTriangle,
  LayoutDashboard, Rocket, GitBranch, Wallet, BarChart3, Settings2,
  Plus, Eye, EyeOff, Zap, Clock, DollarSign, Users, Pickaxe, RefreshCw,
  FileText, ToggleLeft, Database, Percent, Timer, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import StatCard from "@/components/dashboard/StatCard";

/* ─── Page 11: All Protocol Operations ─── */
const protocolFunctions = [
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

/* ─── Page 5: Mock wallet data ─── */
const wallets = [
  { label: "Trading Wallet (Branch USDC)", desc: "USDT held in branch for compounding", value: "—", pct: 0 },
  { label: "Branch Wallet", desc: "Branch commission wallet balance", value: "—", pct: 0 },
  { label: "Passive Income Pool", desc: "Undistributed passive pool", value: "—", pct: 0 },
];

/* ─── Page 5: Branch config fields ─── */
const configFields = [
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

/* ─── Page 6: CoreConfig defaults ─── */
const coreConfigFields = [
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
  { label: "Cancellation", field: "cancellationPercent", default: "200 (2%)" },
];

const expiryConfigFields = [
  { label: "Protocol Fee at Expiry", field: "feePercent", default: "4000 (40%)" },
  { label: "Branch at Expiry", field: "branchPercent", default: "4000 (40%)" },
  { label: "Passive Income at Expiry", field: "passiveIncomePercent", default: "2000 (20%)" },
];

/* ─── Components ─── */

const BranchDashboardTab = () => (
  <div className="space-y-6">
    {/* Stats Row */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard title="Total Members" value="—" icon={Users} />
      <StatCard title="Weekly Performance" value="—" icon={BarChart3} />
      <StatCard title="Total Distributed" value="—" icon={Wallet} />
    </div>

    {/* Wallet Balances */}
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

    {/* Branch Config */}
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

const DeployBranchTab = () => (
  <div className="space-y-6">
    {/* Info Banner */}
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 border-primary/20">
      <div className="flex items-start gap-3">
        <Rocket className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div>
          <h3 className="font-display font-semibold text-foreground mb-1">Deploy a New Branch</h3>
          <p className="text-sm text-muted-foreground">
            Any user can deploy a new branch if <code className="text-primary text-xs">openDeployment = true</code>, otherwise only DEPLOYER_ROLE holders.
            After deployment, you'll receive your branch proxy address.
          </p>
        </div>
      </div>
    </motion.div>

    {/* Deploy Form */}
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
      <h3 className="font-display font-semibold text-foreground mb-5">Branch Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Branch Name", placeholder: "e.g. Alpha Branch", type: "text" },
          { label: "Branch Owner", placeholder: "Connected wallet (auto-filled)", type: "address" },
          { label: "USDC Token Address", placeholder: "Protocol USDT address", type: "address" },
          { label: "Branch Wallet", placeholder: "Commission wallet (3%)", type: "address" },
          { label: "Founders Wallet", placeholder: "Founders share (2%)", type: "address" },
        ].map((field) => (
          <div key={field.label} className={field.label === "Branch Name" ? "sm:col-span-2" : ""}>
            <label className="text-xs text-muted-foreground mb-1.5 block">{field.label}</label>
            <input
              disabled
              type="text"
              placeholder={field.placeholder}
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 font-mono disabled:opacity-60"
            />
          </div>
        ))}
      </div>
    </motion.div>

    {/* CoreConfig */}
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
      <h3 className="font-display font-semibold text-foreground mb-1">CoreConfig</h3>
      <p className="text-xs text-muted-foreground mb-5">All values in BPS (basis points). Must sum to 10,000.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {coreConfigFields.map((f) => (
          <div key={f.field} className="bg-secondary/50 border border-border rounded-lg p-3">
            <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
            <input
              disabled
              type="text"
              placeholder={f.default}
              className="w-full bg-transparent text-sm text-foreground font-mono placeholder:text-muted-foreground/60 disabled:opacity-60 outline-none"
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Percent className="h-3.5 w-3.5" />
        Total must equal 10,000 BPS (100%)
      </div>
    </motion.div>

    {/* ExpiryConfig */}
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
      <h3 className="font-display font-semibold text-foreground mb-1">ExpiryConfig</h3>
      <p className="text-xs text-muted-foreground mb-5">Expiry principal split. Must sum to 10,000 BPS.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {expiryConfigFields.map((f) => (
          <div key={f.field} className="bg-secondary/50 border border-border rounded-lg p-3">
            <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
            <input
              disabled
              type="text"
              placeholder={f.default}
              className="w-full bg-transparent text-sm text-foreground font-mono placeholder:text-muted-foreground/60 disabled:opacity-60 outline-none"
            />
          </div>
        ))}
      </div>
    </motion.div>

    {/* Deploy Button */}
    <Button disabled className="w-full py-6 text-base opacity-60 cursor-not-allowed">
      <Rocket className="h-5 w-5 mr-2" />
      Deploy Branch — Coming Soon
    </Button>
  </div>
);

const ProtocolOpsTab = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="text-center mb-2"
      >
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Core on-chain operations available to authorized branch managers. All transactions require wallet signature on BNB Smart Chain.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {protocolFunctions.map((fn, i) => (
          <motion.div
            key={fn.name}
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.05 + i * 0.04, duration: 0.4 }}
            className="glass-card-hover p-6 flex flex-col group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <fn.icon className="h-6 w-6 text-primary" />
              </div>
              {fn.selector !== "—" && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary border border-border">
                  <Terminal className="h-3 w-3 text-muted-foreground" />
                  <code className="text-xs font-mono text-primary">{fn.selector}</code>
                </div>
              )}
            </div>

            <h3 className="font-display font-semibold text-lg text-foreground mb-1">
              {fn.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2 flex-1">
              {fn.desc}
            </p>
            <p className="text-xs text-muted-foreground/70 font-mono mb-5">
              Params: {fn.params}
            </p>

            <Button
              disabled
              className="w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 cursor-not-allowed opacity-60"
            >
              <Lock className="h-4 w-4 mr-2" />
              Execute Function
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ─── Main Page ─── */
const BranchManager = () => {
  const { isConnected, isBranchManager } = useWallet();

  // Access Denied
  if (!isConnected || !isBranchManager) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center justify-center mb-6">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold font-display mb-3">Access Denied</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          This portal is restricted to authorized Branch Managers. Please connect a qualifying wallet to proceed.
        </p>
        <Link to="/">
          <Button variant="outline" size="lg">
            <ArrowRight className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-16 md:py-24 flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-destructive/40 bg-destructive/10 text-sm text-destructive"
          >
            <Lock className="h-3.5 w-3.5" />
            Restricted Access
          </motion.div>

          <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight mb-4">
            <span className="gradient-text">Branch Manager</span>
            <br />
            <span className="text-foreground/90">Control Center</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Dashboard, deployment, and protocol operations for authorized branch operators.
          </p>

          <Link to="/">
            <Button variant="outline" size="lg" className="text-base px-8 py-5 border-border/60 text-foreground hover:bg-secondary">
              <ArrowRight className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Tabbed Content */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="w-full sm:w-auto bg-secondary/50 border border-border mb-8">
              <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
                <LayoutDashboard className="h-4 w-4" />
                Branch Dashboard
              </TabsTrigger>
              <TabsTrigger value="deploy" className="gap-2 data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
                <Rocket className="h-4 w-4" />
                Deploy Branch
              </TabsTrigger>
              <TabsTrigger value="operations" className="gap-2 data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
                <Terminal className="h-4 w-4" />
                Protocol Ops
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <BranchDashboardTab />
            </TabsContent>
            <TabsContent value="deploy">
              <DeployBranchTab />
            </TabsContent>
            <TabsContent value="operations">
              <ProtocolOpsTab />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-10 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="glass-card p-5 flex items-center justify-center gap-3">
            <Shield className="h-5 w-5 text-primary shrink-0" />
            <p className="text-sm text-muted-foreground">
              All operations require authorized wallet signature and are executed on <span className="text-foreground font-medium">BNB Smart Chain</span>.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default BranchManager;
