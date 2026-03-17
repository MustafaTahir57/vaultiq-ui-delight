import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, ExternalLink, Zap, Bitcoin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatusBadge from "./StatusBadge";
import { useWallet } from "@/contexts/WalletContext";
import { USDT_Address } from "@/constants/contracts";
import useUSDTApproval from "@/hooks/dataSender/useUSDTApproval";
import usePurchaseSubscription from "@/hooks/dataSender/usePurchaseSubscription";
import usePurchaseSubscriptionWithPlan from "@/hooks/dataSender/usePurchaseSubscriptionWithPlan";
import useUserSubscriptions from "@/hooks/dataFetcher/useUserSubscriptions";
import useTokenBalance from "@/hooks/dataFetcher/useTokenBalance";
import useTokenAllowance from "@/hooks/dataFetcher/useTokenAllowance";
import useBranchPlans from "@/hooks/dataFetcher/useBranchPlans";
import useClaimRewards from "@/hooks/dataSender/useClaimRewards";
import useClaimBTC from "@/hooks/dataSender/useClaimBTC";
import useCancelSubscription from "@/hooks/dataSender/useCancelSubscription";
import { parseUnits, formatUnits } from "viem";
import { toast } from "sonner";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const PRESET_PLANS = [
  { id: "premium",       label: "1x100th Premium",       days: 90,  price: "500" },
  { id: "platinum",      label: "3x100th Platinum",      days: 90,  price: "1500" },
  { id: "titanium",      label: "6x100th Titanium",      days: 90,  price: "3000" },
  { id: "premiumPlus",   label: "1x100th PremiumPlus",   days: 180, price: "1000" },
  { id: "platinumPlus",  label: "3x100th PlatinumPlus",  days: 180, price: "3000" },
  { id: "titaniumPlus",  label: "6x100th TitaniumPlus",  days: 180, price: "6000" },
];

const SubscriptionsSection = () => {
  const { address, userBranchAddress } = useWallet();
  const {
    subscriptions,
    activeCount,
    totalRewards,
    isLoading,
    refetch: refetchSubscriptions,
  } = useUserSubscriptions(address);
  const { balance: usdtBalance } = useTokenBalance(USDT_Address, address);
  const { plans, isLoading: plansLoading } = useBranchPlans(userBranchAddress);
  const { allowance, refetch: refetchAllowance } = useTokenAllowance(
    USDT_Address,
    address,
    userBranchAddress,
  );

  const [modalOpen, setModalOpen] = useState(false);

  const [model, setModel] = useState("A");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [principalInput, setPrincipalInput] = useState("");
  const [durationInput, setDurationInput] = useState(String(90 * 24 * 60 * 60));
  const [referral, setReferral] = useState("");
  const [planId, setPlanId] = useState("1");
  const [autoRoll, setAutoRoll] = useState(false);

  const durationOptions = [
    { label: "30 Days", value: 30 * 24 * 60 * 60 },
    { label: "60 Days", value: 60 * 24 * 60 * 60 },
    { label: "90 Days", value: 90 * 24 * 60 * 60 },
    { label: "180 Days", value: 180 * 24 * 60 * 60 },
    { label: "365 Days", value: 365 * 24 * 60 * 60 },
  ];

  const currentPreset = PRESET_PLANS.find((p) => p.id === selectedPlan);
  const principal = model === "B" && currentPreset ? currentPreset.price : principalInput;
  const duration = model === "B" && currentPreset ? String(currentPreset.days * 24 * 60 * 60) : durationInput;

  // Hooks
  const approval = useUSDTApproval();
  const modelA = usePurchaseSubscription();
  const modelB = usePurchaseSubscriptionWithPlan();
  const claimRewards = useClaimRewards();
  const claimBTC = useClaimBTC();
  const cancelSub = useCancelSubscription();

  const activePurchase = model === "A" ? modelA : modelB;

  const parsedAmount =
    principal && Number(principal) > 0 ? parseUnits(principal, 18) : BigInt(0);
  const hasEnoughAllowance =
    allowance !== undefined && parsedAmount > 0 && allowance >= parsedAmount;

  // After approval confirmed, automatically trigger purchase
  useEffect(() => {
    if (approval.isConfirmed) {
      toast.success("Approval confirmed! Purchasing...");
      refetchAllowance();
      executePurchase();
    }
  }, [approval.isConfirmed]);

  // After purchase confirmed, close modal
  useEffect(() => {
    if (activePurchase.isConfirmed) {
      toast.success("Subscription purchased successfully!");
      setModalOpen(false);
      resetForm();
    }
  }, [activePurchase.isConfirmed]);

  const resetForm = () => {
    setSelectedPlan("");
    setPrincipalInput("");
    setDurationInput(String(90 * 24 * 60 * 60));
    setReferral("");
    setPlanId("1");
    setAutoRoll(false);
    setModel("A");
    approval.reset();
    modelA.reset();
    modelB.reset();
  };

  const handleOpenModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const executePurchase = () => {
    const amount = parseUnits(principal, 18);
    const dur = BigInt(duration);
    const ref = referral && referral.startsWith("0x") ? referral : ZERO_ADDRESS;

    if (model === "A") {
      modelA.purchase(userBranchAddress, amount, dur, ref);
    } else {
      modelB.purchase(
        userBranchAddress,
        amount,
        dur,
        ref,
        Number(planId),
        autoRoll,
      );
    }
  };

  useEffect(() => {
    if (cancelSub.isConfirmed) {
      toast.success("Subscription cancelled successfully!");
      refetchSubscriptions();
    }
    if (cancelSub.isError)
      toast.error(error?.shortMessage || "Cancellation failed");
  }, [cancelSub.isConfirmed, cancelSub.isError, cancelSub.error]);

  const handleSubmit = () => {
    if (!selectedPlan || !currentPreset) {
      toast.error("Please select a plan");
      return;
    }
    if (!userBranchAddress) {
      toast.error("No branch found for your account");
      return;
    }

    if (hasEnoughAllowance) {
      // Already approved, purchase directly
      executePurchase();
    } else {
      // Need approval first, purchase will auto-trigger via useEffect
      const amount = parseUnits(principal, 18);
      approval.approve(USDT_Address, userBranchAddress, amount);
    }
  };

  const formattedBalance = usdtBalance ? formatUnits(usdtBalance, 18) : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            My Subscriptions
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your branch subscriptions & rewards
            {activeCount > 0 && (
              <span className="ml-2 text-primary font-medium">
                ({activeCount} active)
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleOpenModal}
          >
            <CreditCard className="h-4 w-4 mr-2" /> New Subscription
          </Button>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                {[
                  "Branch",
                  "Model",
                  "Principal",
                  "Status",
                  "Rewards",
                  "Withdrawable BTC",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-medium text-muted-foreground px-5 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-muted-foreground text-sm"
                  >
                    Loading subscriptions...
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-muted-foreground text-sm"
                  >
                    No subscriptions found. Click "New Subscription" to get
                    started.
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub, i) => (
                  <motion.tr
                    key={`${sub.branch}-${sub.index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/30 last:border-0 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-medium text-foreground font-mono">
                      {sub.branch.slice(0, 6)}...{sub.branch.slice(-4)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge
                        status={
                          Number(sub.planId) === 0 ? "Model A" : "Model B"
                        }
                      />
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground">
                      {formatUnits(sub.principal, 18)} USDC
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge
                        status={
                          sub.isActive
                            ? "active"
                            : sub.cancelled
                              ? "cancelled"
                              : sub.expired
                                ? "expired"
                                : "matured"
                        }
                      />
                    </td>
                    <td className="px-5 py-4 text-sm text-primary font-medium">
                      {formatUnits(sub.accumulatedRewards, 18)} USDC
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground">
                      {formatUnits(sub.withdrawableBTC, 18)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {sub.isActive && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs border-primary/30 text-primary hover:bg-primary/10"
                              disabled={
                                claimRewards.isPending ||
                                claimRewards.isConfirming ||
                                claimBTC.isPending ||
                                claimBTC.isConfirming ||
                                (Number(sub.planId) === 0
                                  ? Number(sub.accumulatedRewards) === 0
                                  : Number(sub.withdrawableBTC) === 0)
                              }
                              onClick={() => {
                                if (Number(sub.planId) === 0) {
                                  claimRewards.claim(sub.branch, sub.index);
                                } else {
                                  claimBTC.claim(sub.branch, sub.index);
                                }
                              }}
                            >
                              {Number(sub.planId) === 0
                                ? "Claim USDC"
                                : "Claim BTC"}
                            </Button>
                            {Number(sub.planId) === 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                                disabled={
                                  cancelSub.isPending || cancelSub.isConfirming
                                }
                                onClick={() =>
                                  cancelSub.cancel(sub.branch, sub.index)
                                }
                              >
                                {cancelSub.isPending || cancelSub.isConfirming
                                  ? "Cancelling..."
                                  : "Cancel"}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Subscription Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              New Subscription
            </DialogTitle>
            <DialogDescription>
              Choose a model and configure your subscription.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Model Selection */}
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium">
                Select Model
              </Label>
              <RadioGroup
                value={model}
                onValueChange={(v) => {
                  setModel(v);
                  setStep("form");
                }}
                className="grid grid-cols-2 gap-3"
              >
                <Label
                  htmlFor="model-a"
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                    model === "A"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <RadioGroupItem value="A" id="model-a" className="sr-only" />
                  <Zap className="h-6 w-6 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Model A
                  </span>
                  <span className="text-xs text-muted-foreground text-center">
                    USDC Compounding
                  </span>
                </Label>
                <Label
                  htmlFor="model-b"
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                    model === "B"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <RadioGroupItem value="B" id="model-b" className="sr-only" />
                  <Bitcoin className="h-6 w-6 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Model B
                  </span>
                  <span className="text-xs text-muted-foreground text-center">
                    BTC Mining
                  </span>
                </Label>
              </RadioGroup>
            </div>

            {/* Plan Selection */}
            <div className="space-y-1.5">
              <Label className="text-foreground text-sm">Select Plan</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger className="bg-secondary/50 border-border">
                  <SelectValue placeholder="Choose a plan" />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_PLANS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.label} — ${Number(p.price).toLocaleString()} / {p.days} days
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Auto-filled Amount & Duration (read-only) */}
            {currentPreset && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-foreground text-sm">Amount (USDC)</Label>
                  <Input
                    value={`$${Number(currentPreset.price).toLocaleString()}`}
                    readOnly
                    disabled
                    className="bg-secondary/50 border-border opacity-70"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-foreground text-sm">Duration</Label>
                  <Input
                    value={`${currentPreset.days} Days`}
                    readOnly
                    disabled
                    className="bg-secondary/50 border-border opacity-70"
                  />
                </div>
              </div>
            )}

            {/* Referral */}
            <div className="space-y-1.5">
              <Label className="text-foreground text-sm">
                Referral Address (optional)
              </Label>
              <Input
                placeholder="0x..."
                value={referral}
                onChange={(e) => setReferral(e.target.value)}
                className="bg-secondary/50 border-border"
              />
            </div>

            {/* Model B extras */}
            {model === "B" && (
              <div className="space-y-4 rounded-lg border border-border p-3 bg-secondary/20">
                <div className="space-y-1.5">
                  <Label className="text-foreground text-sm">Mining Plan</Label>
                  <Select value={planId} onValueChange={setPlanId}>
                    <SelectTrigger className="bg-secondary/50 border-border">
                      <SelectValue
                        placeholder={
                          plansLoading ? "Loading plans..." : "Select plan"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.name || `Plan ${p.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground text-sm">Auto-Roll</Label>
                    <p className="text-xs text-muted-foreground">
                      Re-invest automatically at maturity
                    </p>
                  </div>
                  <Switch checked={autoRoll} onCheckedChange={setAutoRoll} />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={handleSubmit}
              disabled={
                approval.isPending ||
                approval.isConfirming ||
                activePurchase.isPending ||
                activePurchase.isConfirming
              }
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {approval.isPending
                ? "Approving..."
                : approval.isConfirming
                  ? "Confirming Approval..."
                  : activePurchase.isPending
                    ? "Purchasing..."
                    : activePurchase.isConfirming
                      ? "Confirming Purchase..."
                      : hasEnoughAllowance
                        ? `Purchase ${model === "A" ? "USDC Compounding" : "BTC Mining"}`
                        : "Approve & Purchase"}
            </Button>
          </DialogFooter>

          {(approval.isError || activePurchase.isError) && (
            <p className="text-xs text-destructive text-center mt-1">
              {approval.error?.shortMessage ||
                activePurchase.error?.shortMessage ||
                "Transaction failed"}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionsSection;
