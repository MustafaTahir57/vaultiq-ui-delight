import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Terminal, Lock, Loader2, CheckCircle, AlertCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { protocolFunctions } from "./constants";
import { toast } from "sonner";

import useSubmitWeeklyPerformance from "@/hooks/dataSender/useSubmitWeeklyPerformance";
import useSetPlanActive from "@/hooks/dataSender/useSetPlanActive";

import useSetMiningRevenueDistributor from "@/hooks/dataSender/useSetMiningRevenueDistributor";
import useSetBTCBToken from "@/hooks/dataSender/useSetBTCBToken";
import useProcessPassiveMonth from "@/hooks/dataSender/useProcessPassiveMonth";
import useGrantRole from "@/hooks/dataSender/useGrantRole";
import useTransferBranchOwnership from "@/hooks/dataSender/useTransferBranchOwnership";
import useBranchManagerRole from "@/hooks/dataFetcher/useBranchManagerRole";
import useBranchPlans from "@/hooks/dataFetcher/useBranchPlans";

const truncateAddress = (addr) => {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

const ProtocolOpsTab = ({ selectedBranch }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Local form state
  const [weeklyPercent, setWeeklyPercent] = useState("");
  const [planId, setPlanId] = useState("");
  const [planActive, setPlanActive] = useState("true");
  
  const [distributorAddress, setDistributorAddress] = useState("");
  const [btcbAddress, setBtcbAddress] = useState("");
  const [monthIndex, setMonthIndex] = useState("");
  const [grantRoleAddress, setGrantRoleAddress] = useState("");
  const [transferOwnerAddress, setTransferOwnerAddress] = useState("");

  // Hooks
  const weeklyPerf = useSubmitWeeklyPerformance();
  const setPlanActiveHook = useSetPlanActive();
  
  const setMiningDist = useSetMiningRevenueDistributor();
  const setBtcb = useSetBTCBToken();
  const processMonth = useProcessPassiveMonth();
  const grantRoleHook = useGrantRole();
  const transferOwnerHook = useTransferBranchOwnership();

  const { branchManagerRole } = useBranchManagerRole(selectedBranch);
  const { planCount } = useBranchPlans(selectedBranch);

  const hookMap = {
    submitWeeklyPerformance: weeklyPerf,
    setPlanActive: setPlanActiveHook,
    setLiquidityType: setLiqType,
    setMiningRevenueDistributor: setMiningDist,
    setBTCBToken: setBtcb,
    processPassiveMonth: processMonth,
    grantRole: grantRoleHook,
    transferBranchOwnership: transferOwnerHook,
  };

  const handleExecute = (fnName) => {
    if (!selectedBranch) {
      toast.error("No branch selected");
      return;
    }

    switch (fnName) {
      case "submitWeeklyPerformance": {
        const pct = parseFloat(weeklyPercent);
        if (isNaN(pct) || pct <= 0) { toast.error("Enter a valid percentage (e.g. 4.2)"); return; }
        const bps = Math.round(pct * 100);
        weeklyPerf.submitWeeklyPerformance(selectedBranch, bps);
        toast.info(`Submitting ${pct}% (${bps} BPS)...`);
        break;
      }
      case "setPlanActive": {
        if (!planId) { toast.error("Select a plan"); return; }
        setPlanActiveHook.setPlanActive(selectedBranch, Number(planId), planActive === "true");
        toast.info(`Setting Plan #${planId} to ${planActive === "true" ? "Active" : "Inactive"}...`);
        break;
      }
      case "setLiquidityType": {
        setLiqType.setLiquidityType(selectedBranch, Number(liquidityType));
        toast.info(`Setting liquidity type to ${liquidityType === "0" ? "BRANCH" : "TREASURY"}...`);
        break;
      }
      case "setMiningRevenueDistributor": {
        if (!distributorAddress || !distributorAddress.startsWith("0x")) { toast.error("Enter a valid address"); return; }
        setMiningDist.setMiningRevenueDistributor(selectedBranch, distributorAddress);
        toast.info("Setting mining revenue distributor...");
        break;
      }
      case "setBTCBToken": {
        if (!btcbAddress || !btcbAddress.startsWith("0x")) { toast.error("Enter a valid address"); return; }
        setBtcb.setBTCBToken(selectedBranch, btcbAddress);
        toast.info("Setting BTCB token address...");
        break;
      }
      case "processPassiveMonth": {
        const idx = parseInt(monthIndex);
        if (isNaN(idx) || idx < 0) { toast.error("Enter a valid month index"); return; }
        processMonth.processPassiveMonth(selectedBranch, idx);
        toast.info(`Processing passive month ${idx}...`);
        break;
      }
      case "grantRole": {
        if (!grantRoleAddress || !grantRoleAddress.startsWith("0x")) { toast.error("Enter a valid address"); return; }
        if (!branchManagerRole) { toast.error("Could not fetch BRANCH_MANAGER_ROLE"); return; }
        grantRoleHook.grantRole(selectedBranch, branchManagerRole, grantRoleAddress);
        toast.info("Granting BRANCH_MANAGER_ROLE...");
        break;
      }
      case "transferBranchOwnership": {
        if (!transferOwnerAddress || !transferOwnerAddress.startsWith("0x")) { toast.error("Enter a valid address"); return; }
        transferOwnerHook.transferBranchOwnership(selectedBranch, transferOwnerAddress);
        toast.info("Transferring branch ownership...");
        break;
      }
    }
  };

  const renderInputs = (fnName) => {
    switch (fnName) {
      case "submitWeeklyPerformance":
        return (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Weekly Rate (%)</label>
            <Input
              type="number"
              step="0.1"
              placeholder="e.g. 4.2"
              value={weeklyPercent}
              onChange={(e) => setWeeklyPercent(e.target.value)}
              className="bg-secondary/50 border-border font-mono"
            />
            {weeklyPercent && !isNaN(parseFloat(weeklyPercent)) && (
              <p className="text-xs text-muted-foreground">
                = {Math.round(parseFloat(weeklyPercent) * 100)} BPS
              </p>
            )}
          </div>
        );

      case "setPlanActive":
        return (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Plan ID</label>
            <Select value={planId} onValueChange={setPlanId}>
              <SelectTrigger className="bg-secondary/50 border-border font-mono">
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: planCount }, (_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    Plan #{i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label className="text-xs text-muted-foreground">Status</label>
            <Select value={planActive} onValueChange={setPlanActive}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case "setLiquidityType":
        return (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Liquidity Type</label>
            <Select value={liquidityType} onValueChange={setLiquidityType}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">BRANCH (0)</SelectItem>
                <SelectItem value="1">TREASURY (1)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case "setMiningRevenueDistributor":
        return (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Distributor Address</label>
            <Input
              placeholder="0x..."
              value={distributorAddress}
              onChange={(e) => setDistributorAddress(e.target.value)}
              className="bg-secondary/50 border-border font-mono text-xs"
            />
          </div>
        );

      case "setBTCBToken":
        return (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">BTCB Token Address</label>
            <Input
              placeholder="0x..."
              value={btcbAddress}
              onChange={(e) => setBtcbAddress(e.target.value)}
              className="bg-secondary/50 border-border font-mono text-xs"
            />
          </div>
        );

      case "processPassiveMonth":
        return (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Month Index</label>
            <Input
              type="number"
              min="0"
              placeholder="e.g. 0"
              value={monthIndex}
              onChange={(e) => setMonthIndex(e.target.value)}
              className="bg-secondary/50 border-border font-mono"
            />
          </div>
        );

      case "grantRole":
        return (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Account Address</label>
            <Input
              placeholder="0x..."
              value={grantRoleAddress}
              onChange={(e) => setGrantRoleAddress(e.target.value)}
              className="bg-secondary/50 border-border font-mono text-xs"
            />
          </div>
        );

      case "transferBranchOwnership":
        return (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">New Owner Address</label>
            <Input
              placeholder="0x..."
              value={transferOwnerAddress}
              onChange={(e) => setTransferOwnerAddress(e.target.value)}
              className="bg-secondary/50 border-border font-mono text-xs"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const getStatus = (fnName) => {
    const hook = hookMap[fnName];
    if (!hook) return null;
    if (hook.isConfirmed) return "confirmed";
    if (hook.isConfirming) return "confirming";
    if (hook.isPending) return "pending";
    if (hook.isError) return "error";
    return null;
  };

  return (
    <div ref={ref} className="space-y-6">
      {/* Selected Branch Badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="text-center mb-2 space-y-3"
      >
        {selectedBranch && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/20 bg-primary/5">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Target:</span>
            <code
              className="text-sm font-mono text-primary cursor-pointer hover:underline"
              onClick={() => {
                navigator.clipboard.writeText(selectedBranch);
                toast.success("Address copied");
              }}
              title={selectedBranch}
            >
              {truncateAddress(selectedBranch)}
            </code>
            <Copy className="h-3 w-3 text-muted-foreground" />
          </div>
        )}
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Core on-chain operations available to authorized branch managers. All transactions require wallet signature on BNB Smart Chain.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {protocolFunctions.map((fn, i) => {
          const status = getStatus(fn.name);
          const hook = hookMap[fn.name];

          return (
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
                {/* {fn.selector !== "—" && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary border border-border">
                    <Terminal className="h-3 w-3 text-muted-foreground" />
                    <code className="text-xs font-mono text-primary">{fn.selector}</code>
                  </div>
                )} */}
              </div>

              <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                {fn.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {fn.desc}
              </p>

              {/* Input Fields */}
              <div className="mb-5 flex-1">
                {renderInputs(fn.name)}
              </div>

              {/* Status Feedback */}
              {status && (
                <div className={`flex items-center gap-2 text-xs mb-3 ${
                  status === "confirmed" ? "text-green-500" :
                  status === "error" ? "text-destructive" :
                  "text-muted-foreground"
                }`}>
                  {(status === "pending" || status === "confirming") && <Loader2 className="h-3 w-3 animate-spin" />}
                  {status === "confirmed" && <CheckCircle className="h-3 w-3" />}
                  {status === "error" && <AlertCircle className="h-3 w-3" />}
                  <span>
                    {status === "pending" && "Waiting for signature..."}
                    {status === "confirming" && "Confirming on-chain..."}
                    {status === "confirmed" && "Transaction confirmed!"}
                    {status === "error" && (hook?.error?.shortMessage || "Transaction failed")}
                  </span>
                </div>
              )}

              <Button
                onClick={() => handleExecute(fn.name)}
                disabled={!selectedBranch || hook?.isPending || hook?.isConfirming}
                className="w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 disabled:opacity-50"
              >
                {(hook?.isPending || hook?.isConfirming) ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4 mr-2" />
                )}
                Execute Function
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProtocolOpsTab;
