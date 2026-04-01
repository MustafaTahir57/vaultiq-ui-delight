import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Rocket, Percent, Loader2, CheckCircle2, Copy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import useDeployBranch from "@/hooks/dataSender/useDeployBranch";
import { USDT_Address } from "@/constants/contracts";
import { coreConfigFields, expiryConfigFields } from "./constants";
import { toast } from "sonner";

const defaultCore = {
  liquidityAllocation: 7600,
  directBonusPercent: 500,
  branchCommissionPercent: 300,
  feePercent: 800,
  foundersPercent: 200,
  pool1Percent: 150,
  pool2Percent: 150,
  pool3Percent: 150,
  pool4Percent: 150,
};

const defaultExpiry = {
  feePercent: 4000,
  branchPercent: 4000,
  passiveIncomePercent: 2000,
};

const DeployBranchTab = () => {
  const { address } = useWallet();
  const {
    isOpenDeployment, checkingOpen, deployBranch, isDeploying,
    deployedBranchAddress, checkBranchName, nameUsedResult, nameCheckFetching, resetDeploy,
  } = useDeployBranch(address);

  const [branchName, setBranchName] = useState("");
  const [branchWallet, setBranchWallet] = useState("");
  const [foundersWallet, setFoundersWallet] = useState("");
  const [nameError, setNameError] = useState("");
  const [liquidityType, setLiquidityType] = useState("0");
  const [coreConfig, setCoreConfig] = useState(defaultCore);
  const [cancellationPercent, setCancellationPercent] = useState(200);
  const [expiryConfig, setExpiryConfig] = useState(defaultExpiry);

  const coreTotal = useMemo(
    () => Object.values(coreConfig).reduce((sum, v) => sum + (Number(v) || 0), 0),
    [coreConfig]
  );
  const expiryTotal = useMemo(
    () => Object.values(expiryConfig).reduce((sum, v) => sum + (Number(v) || 0), 0),
    [expiryConfig]
  );

  const handleCoreChange = (field, value) => {
    setCoreConfig((prev) => ({ ...prev, [field]: value === "" ? "" : Number(value) || 0 }));
  };

  const handleExpiryChange = (field, value) => {
    setExpiryConfig((prev) => ({ ...prev, [field]: value === "" ? "" : Number(value) || 0 }));
  };

  const handleNameBlur = useCallback(async () => {
    if (!branchName.trim()) { setNameError(""); return; }
    await checkBranchName(branchName.trim());
  }, [branchName, checkBranchName]);

  // React to name check result
  useEffect(() => {
    if (nameUsedResult === true && branchName.trim()) {
      setNameError("This branch name is already taken");
    } else if (nameUsedResult === false && branchName.trim()) {
      setNameError("");
    }
  }, [nameUsedResult, branchName]);

  const isValidAddress = (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr);

  const canDeploy =
    branchName.trim() &&
    !nameError &&
    !nameCheckFetching &&
    isValidAddress(branchWallet) &&
    isValidAddress(foundersWallet) &&
    coreTotal === 10000 &&
    expiryTotal === 10000 &&
    !isDeploying;

  const handleDeploy = () => {
    deployBranch({
      branchName: branchName.trim(),
      branchWallet,
      foundersWallet,
      liquidityType: Number(liquidityType),
      coreConfig: { ...coreConfig, cancellationPercent },
      expiryConfig,
    });
  };

  const copyAddress = (addr) => {
    navigator.clipboard.writeText(addr);
    toast.success("Referral Link copied to clipboard");
  };

  // Success state
  if (deployedBranchAddress) {
    const referralLink = `https://vaultiq-ui-delight.vercel.app/app/deploy?address=${deployedBranchAddress}`;
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 border-primary/30 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-display font-bold text-xl text-foreground mb-2">Branch Deployed Successfully!</h3>
          <p className="text-sm text-muted-foreground mb-6">Your new branch proxy is live on-chain.</p>

          <div className="bg-secondary/50 border border-border rounded-lg p-4 mb-4">
            <label className="text-xs text-muted-foreground block mb-1.5">Branch Proxy Link</label>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono text-primary flex-1 break-all">{referralLink}</code>
              <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => copyAddress(referralLink)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-6">Share this as your branch referral link</p>

          <Button onClick={resetDeploy} variant="outline" className="px-8">
            Deploy Another Branch
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 border-primary/20">
        <div className="flex items-start gap-3">
          <Rocket className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <h3 className="font-display font-semibold text-foreground mb-1">Deploy a New Branch</h3>
            <p className="text-sm text-muted-foreground">
              {checkingOpen ? (
                <span className="flex items-center gap-1.5"><Loader2 className="h-3.5 w-3.5 animate-spin" />Checking deployment status...</span>
              ) : isOpenDeployment ? (
                <>Open deployment is <span className="text-primary font-medium">enabled</span>. Any wallet can deploy a new branch.</>
              ) : (
                <>Open deployment is <span className="text-destructive font-medium">disabled</span>. Only DEPLOYER_ROLE holders can deploy.</>
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Section 1: Basic Info */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <h3 className="font-display font-semibold text-foreground mb-5">Branch Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Branch Name */}
          <div className="sm:col-span-2">
            <label className="text-xs text-muted-foreground mb-1.5 block">Branch Name *</label>
            <input
              type="text"
              value={branchName}
              onChange={(e) => { setBranchName(e.target.value); setNameError(""); }}
              onBlur={handleNameBlur}
              placeholder="e.g. Alpha Branch"
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {nameCheckFetching && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" />Checking availability...</p>}
            {nameError && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{nameError}</p>}
          </div>

          {/* Branch Owner */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Branch Owner</label>
            <input
              type="text"
              value={address || ""}
              disabled
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground/60 font-mono disabled:opacity-60"
            />
          </div>

          {/* USDC Token */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">USDC Token</label>
            <input
              type="text"
              value={USDT_Address}
              disabled
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground/60 font-mono disabled:opacity-60"
            />
          </div>

          {/* Branch Wallet */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Branch Wallet * <span className="text-muted-foreground/60">(3% commission)</span></label>
            <input
              type="text"
              value={branchWallet}
              onChange={(e) => setBranchWallet(e.target.value)}
              placeholder="0x..."
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {branchWallet && !isValidAddress(branchWallet) && <p className="text-xs text-destructive mt-1">Invalid address</p>}
          </div>

          {/* Founders Wallet */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Founders Wallet * <span className="text-muted-foreground/60">(2% share)</span></label>
            <input
              type="text"
              value={foundersWallet}
              onChange={(e) => setFoundersWallet(e.target.value)}
              placeholder="0x..."
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {foundersWallet && !isValidAddress(foundersWallet) && <p className="text-xs text-destructive mt-1">Invalid address</p>}
          </div>
        </div>
      </motion.div>

      {/* Section 2: CoreConfig */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display font-semibold text-foreground">CoreConfig</h3>
          <div className={`flex items-center gap-1.5 text-sm font-mono font-semibold ${coreTotal === 10000 ? "text-primary" : "text-destructive"}`}>
            <Percent className="h-3.5 w-3.5" />
            {coreTotal} / 10,000 BPS
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-5">All values in BPS (basis points). Must sum to 10,000.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {coreConfigFields.map((f) => (
            <div key={f.field} className="bg-secondary/50 border border-border rounded-lg p-3">
              <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
              <input
                type="number"
                value={coreConfig[f.field]}
                onChange={(e) => handleCoreChange(f.field, e.target.value)}
                placeholder={f.default}
                className="w-full bg-transparent text-sm text-foreground font-mono placeholder:text-muted-foreground/60 outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Cancellation Percent (separate from CoreConfig) */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6">
        <h3 className="font-display font-semibold text-foreground mb-1">Cancellation Fee</h3>
        <p className="text-xs text-muted-foreground mb-4">Separate from CoreConfig. Deducted on early cancellation.</p>
        <div className="max-w-xs">
          <div className="bg-secondary/50 border border-border rounded-lg p-3">
            <label className="text-xs text-muted-foreground mb-1 block">Cancellation %</label>
            <input
              type="number"
              value={cancellationPercent}
              onChange={(e) => setCancellationPercent(e.target.value === "" ? "" : Number(e.target.value) || 0)}
              placeholder="200 (2%)"
              className="w-full bg-transparent text-sm text-foreground font-mono placeholder:text-muted-foreground/60 outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>
        </motion.div>

      {/* Section 3: ExpiryConfig */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display font-semibold text-foreground">ExpiryConfig</h3>
          <div className={`flex items-center gap-1.5 text-sm font-mono font-semibold ${expiryTotal === 10000 ? "text-primary" : "text-destructive"}`}>
            <Percent className="h-3.5 w-3.5" />
            {expiryTotal} / 10,000 BPS
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-5">Expiry principal split. Must sum to 10,000 BPS.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {expiryConfigFields.map((f) => (
            <div key={f.field} className="bg-secondary/50 border border-border rounded-lg p-3">
              <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
              <input
                type="number"
                value={expiryConfig[f.field]}
                onChange={(e) => handleExpiryChange(f.field, e.target.value)}
                placeholder={f.default}
                className="w-full bg-transparent text-sm text-foreground font-mono placeholder:text-muted-foreground/60 outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Deploy Button */}
      <Button
        disabled={!canDeploy}
        onClick={handleDeploy}
        className="w-full py-6 text-base"
      >
        {isDeploying ? (
          <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Deploying Branch...</>
        ) : (
          <><Rocket className="h-5 w-5 mr-2" />Deploy Branch</>
        )}
      </Button>
    </div>
  );
};

export default DeployBranchTab;
