import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import useAddSubscriptionPlan from "@/hooks/dataSender/useAddSubscriptionPlan";
import useUserBranches from "@/hooks/dataFetcher/useUserBranches";
import { HashTreasury_Address, FeeTreasury_Address, LeadershipPool_Address } from "@/constants/contracts";
import { useAccount } from "wagmi";
import { toast } from "sonner";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const defaultCore = {
  liquidityAllocation: "7600",
  directBonusPercent: "500",
  branchCommissionPercent: "300",
  feePercent: "800",
  foundersPercent: "200",
  pool1Percent: "150",
  pool2Percent: "150",
  pool3Percent: "150",
  pool4Percent: "150",
  cancellationPercent: "200",
};

const defaultExpiry = {
  feePercent: "4000",
  branchPercent: "4000",
  passiveIncomePercent: "2000",
};

const AddPlanModal = ({ open, onOpenChange, onSuccess }) => {
  const { address } = useAccount();
  const { userBranches, isLoading: branchesLoading } = useUserBranches(address);
  const { addPlan, isPending, isConfirming, isConfirmed, isError, error, reset } =
    useAddSubscriptionPlan();

  const [name, setName] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [core, setCore] = useState(defaultCore);
  const [expiry, setExpiry] = useState(defaultExpiry);
  const [hashTreasury, setHashTreasury] = useState(HashTreasury_Address || ZERO_ADDRESS);
  const [feeTreasury, setFeeTreasury] = useState(FeeTreasury_Address || ZERO_ADDRESS);
  const [leadershipPool, setLeadershipPool] = useState(LeadershipPool_Address || ZERO_ADDRESS);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Subscription plan added successfully!");
      onOpenChange(false);
      onSuccess?.();
      resetForm();
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.shortMessage || "Failed to add plan");
    }
  }, [isError]);

  const resetForm = () => {
    setName("");
    setSelectedBranch("");
    setCore(defaultCore);
    setExpiry(defaultExpiry);
    setHashTreasury(HashTreasury_Address || ZERO_ADDRESS);
    setFeeTreasury(FeeTreasury_Address || ZERO_ADDRESS);
    setLeadershipPool(LeadershipPool_Address || ZERO_ADDRESS);
    setActive(true);
    reset();
  };

  const updateCore = (field, value) => setCore((prev) => ({ ...prev, [field]: value }));
  const updateExpiry = (field, value) => setExpiry((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Plan name is required");
      return;
    }
    if (!selectedBranch) {
      toast.error("Please select a branch");
      return;
    }

    const plan = {
      name,
      modelType: 1, // Model B (BTC Mining)
      core: {
        liquidityAllocation: BigInt(core.liquidityAllocation || 0),
        directBonusPercent: BigInt(core.directBonusPercent || 0),
        branchCommissionPercent: BigInt(core.branchCommissionPercent || 0),
        feePercent: BigInt(core.feePercent || 0),
        foundersPercent: BigInt(core.foundersPercent || 0),
        pool1Percent: BigInt(core.pool1Percent || 0),
        pool2Percent: BigInt(core.pool2Percent || 0),
        pool3Percent: BigInt(core.pool3Percent || 0),
        pool4Percent: BigInt(core.pool4Percent || 0),
        passiveIncomePercent: BigInt(core.passiveIncomePercent || 0),
        cancellationPercent: BigInt(core.cancellationPercent || 0),
      },
      expiry: {
        feePercent: BigInt(expiry.feePercent || 0),
        branchPercent: BigInt(expiry.branchPercent || 0),
        passiveIncomePercent: BigInt(expiry.passiveIncomePercent || 0),
      },
      hashTreasury,
      feeTreasury,
      leadershipPool,
      active,
    };

    addPlan(plan, selectedBranch);
  };

  const coreFields = [
    { key: "liquidityAllocation", label: "Liquidity Allocation" },
    { key: "directBonusPercent", label: "Direct Bonus %" },
    { key: "branchCommissionPercent", label: "Branch Commission %" },
    { key: "feePercent", label: "Fee %" },
    { key: "foundersPercent", label: "Founders %" },
    { key: "pool1Percent", label: "Pool 1 %" },
    { key: "pool2Percent", label: "Pool 2 %" },
    { key: "pool3Percent", label: "Pool 3 %" },
    { key: "pool4Percent", label: "Pool 4 %" },
    { key: "cancellationPercent", label: "Cancellation %", excluded: true },
  ];

  // Sum core fields excluding cancellationPercent
  const coreSum = coreFields
    .filter((f) => !f.excluded)
    .reduce((sum, f) => sum + Number(core[f.key] || 0), 0);

  const expirySum = expiryFields.reduce((sum, f) => sum + Number(expiry[f.key] || 0), 0);

  const expiryFields = [
    { key: "feePercent", label: "Fee %" },
    { key: "branchPercent", label: "Branch %" },
    { key: "passiveIncomePercent", label: "Passive Income %" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add Subscription Plan</DialogTitle>
          <DialogDescription>
            Configure a new subscription plan. All percentages are in BPS (e.g. 500 = 5%).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Branch Selection */}
          <div className="space-y-1.5">
            <Label className="text-foreground text-sm">Select Branch</Label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch} disabled={branchesLoading}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder={branchesLoading ? "Loading branches..." : "Select a branch"} />
              </SelectTrigger>
              <SelectContent>
                {userBranches.map((addr, idx) => (
                  <SelectItem key={addr} value={addr}>
                    Branch {idx + 1} — {addr.slice(0, 6)}...{addr.slice(-4)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Plan Name */}
          <div className="space-y-1.5">
            <Label className="text-foreground text-sm">Plan Name</Label>
            <Input
              placeholder="e.g. BTC Mining Pro"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary/50 border-border"
            />
          </div>

          {/* Core Config */}
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">Core Config (BPS)</Label>
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-3 bg-secondary/20">
              {coreFields.map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{label}</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={core[key]}
                    onChange={(e) => updateCore(key, e.target.value)}
                    className="bg-secondary/50 border-border h-8 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Expiry Config */}
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">Expiry Config (BPS)</Label>
            <div className="grid grid-cols-3 gap-2 rounded-lg border border-border p-3 bg-secondary/20">
              {expiryFields.map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{label}</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={expiry[key]}
                    onChange={(e) => updateExpiry(key, e.target.value)}
                    className="bg-secondary/50 border-border h-8 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Addresses */}
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">Contract Addresses</Label>
            <div className="space-y-2 rounded-lg border border-border p-3 bg-secondary/20">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Hash Treasury</Label>
                <Input
                  placeholder="0x..."
                  value={hashTreasury}
                  onChange={(e) => setHashTreasury(e.target.value)}
                  className="bg-secondary/50 border-border h-8 text-sm font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Fee Treasury</Label>
                <Input
                  placeholder="0x..."
                  value={feeTreasury}
                  onChange={(e) => setFeeTreasury(e.target.value)}
                  className="bg-secondary/50 border-border h-8 text-sm font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Leadership Pool</Label>
                <Input
                  placeholder="0x..."
                  value={leadershipPool}
                  onChange={(e) => setLeadershipPool(e.target.value)}
                  className="bg-secondary/50 border-border h-8 text-sm font-mono"
                />
              </div>
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border p-3 bg-secondary/20">
            <div>
              <Label className="text-foreground text-sm">Active</Label>
              <p className="text-xs text-muted-foreground">Enable Auto Investment</p>
            </div>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isPending || isConfirming}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isPending
              ? "Submitting..."
              : isConfirming
              ? "Confirming..."
              : "Add Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlanModal;
