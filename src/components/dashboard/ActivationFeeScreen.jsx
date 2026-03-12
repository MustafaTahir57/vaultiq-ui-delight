import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, CheckCircle, Loader2, Zap, Lock, Wallet, AlertCircle } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { VaultIQMain_Address } from "@/constants/contracts";
import useRegistrationFee from "@/hooks/dataFetcher/useRegistrationFee";
import useRegistrationToken from "@/hooks/dataFetcher/useRegistrationToken";
import useRegisteredBranches from "@/hooks/dataFetcher/useRegisteredBranches";
import useTokenBalance from "@/hooks/dataFetcher/useTokenBalance";
import useUSDTApproval from "@/hooks/dataSender/useUSDTApproval";
import useUserRegistration from "@/hooks/dataSender/useUserRegistration";
import { toast } from "sonner";
import { formatUnits } from "viem";

const ActivationFeeScreen = ({ onRegistered }) => {
  const { shortAddress, address, disconnect } = useWallet();
  const [selectedBranch, setSelectedBranch] = useState("");
  const [step, setStep] = useState("form"); // form | approving | registering | success

  // Data fetchers
  const { fee, isLoading: feeLoading } = useRegistrationFee();
  const { tokenAddress, isLoading: tokenLoading } = useRegistrationToken();
  const { branches, isLoading: branchesLoading } = useRegisteredBranches();
  const { balance, isLoading: balanceLoading } = useTokenBalance(tokenAddress, address);

  // Data senders
  const {
    approve,
    isPending: approvalPending,
    isConfirming: approvalConfirming,
    isConfirmed: approvalConfirmed,
    isError: approvalError,
    error: approvalErrorMsg,
    reset: resetApproval,
  } = useUSDTApproval();

  const {
    registerUser,
    isPending: regPending,
    isConfirming: regConfirming,
    isConfirmed: regConfirmed,
    isError: regError,
    error: regErrorMsg,
    reset: resetRegistration,
  } = useUserRegistration();

  const formattedFee = fee ? formatUnits(fee, 18) : "...";
  const formattedBalance = balance !== undefined ? formatUnits(balance, 18) : "...";
  const hasEnoughBalance = fee && balance !== undefined ? balance >= fee : false;

  // Handle approval confirmation → trigger registration
  useEffect(() => {
    if (approvalConfirmed && step === "approving") {
      setStep("registering");
      toast.success("USDT approved successfully! Registering...");
      registerUser(selectedBranch);
    }
  }, [approvalConfirmed, step, selectedBranch, registerUser]);

  // Handle registration confirmation
  useEffect(() => {
    if (regConfirmed && step === "registering") {
      setStep("success");
      toast.success("Registration complete! Welcome to VaultIQ.");
      setTimeout(() => {
        onRegistered?.();
      }, 1500);
    }
  }, [regConfirmed, step, onRegistered]);

  // Handle errors
  useEffect(() => {
    if (approvalError) {
      setStep("form");
      toast.error("Approval failed: " + (approvalErrorMsg?.shortMessage || approvalErrorMsg?.message || "Transaction rejected"));
      resetApproval();
    }
  }, [approvalError, approvalErrorMsg, resetApproval]);

  useEffect(() => {
    if (regError) {
      setStep("form");
      toast.error("Registration failed: " + (regErrorMsg?.shortMessage || regErrorMsg?.message || "Transaction rejected"));
      resetRegistration();
    }
  }, [regError, regErrorMsg, resetRegistration]);

  const handleRegister = () => {
    if (!selectedBranch) {
      toast.error("Please select a branch");
      return;
    }
    if (!hasEnoughBalance) {
      toast.error("Insufficient USDT balance");
      return;
    }
    setStep("approving");
    approve(tokenAddress, VaultIQMain_Address, fee);
  };

  const isProcessing = step === "approving" || step === "registering";

  return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 text-center space-y-6">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center"
          >
            {step === "success" ? (
              <CheckCircle className="h-8 w-8 text-[hsl(var(--success))]" />
            ) : (
              <Shield className="h-8 w-8 text-primary" />
            )}
          </motion.div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {step === "success" ? "Registration Complete" : "Protocol Registration"}
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              {step === "success"
                ? "Welcome to VaultIQ. Redirecting to your dashboard..."
                : "A one-time registration fee is required to access the VaultIQ Governed Protocol Dashboard."}
            </p>
          </div>

          {/* Fee & Balance Card */}
          {step !== "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-xl border border-border/40 bg-secondary/30 p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Registration Fee</span>
                <span className="text-2xl font-display font-bold text-primary">
                  {feeLoading ? "..." : `${formattedFee} USDT`}
                </span>
              </div>

              <div className="h-px bg-border/30" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Your USDT Balance</span>
                <span className={`text-sm font-semibold ${hasEnoughBalance ? "text-[hsl(var(--success))]" : "text-destructive"}`}>
                  {balanceLoading || tokenLoading ? "..." : `${Number(formattedBalance).toFixed(2)} USDT`}
                </span>
              </div>

              {!balanceLoading && !hasEnoughBalance && balance !== undefined && (
                <div className="flex items-center gap-2 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  Insufficient balance to cover the registration fee
                </div>
              )}

              <div className="h-px bg-border/30" />

              {/* Branch Selection */}
              <div className="text-left space-y-2">
                <label className="text-sm text-muted-foreground">Select Branch</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  disabled={isProcessing}
                  className="w-full rounded-lg border border-border/40 bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                >
                  <option value="">Choose a branch...</option>
                  {branchesLoading ? (
                    <option disabled>Loading branches...</option>
                  ) : (
                    branches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch.slice(0, 6)}...{branch.slice(-4)}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="h-px bg-border/30" />

              <div className="space-y-2.5 text-left">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
                  One-time payment — no recurring charges
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3.5 w-3.5 text-primary shrink-0" />
                  Grants full access to the protocol dashboard
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5 text-primary shrink-0" />
                  Secured on-chain transaction via BNB Smart Chain
                </div>
              </div>
            </motion.div>
          )}

          {/* Connected Wallet */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--success))]" />
            Connected: <span className="font-mono text-foreground">{shortAddress}</span>
          </div>

          {/* Action Buttons */}
          {step === "form" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <button
                onClick={handleRegister}
                disabled={!hasEnoughBalance || !selectedBranch || feeLoading || tokenLoading}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Register & Activate
              </button>
              <button
                onClick={disconnect}
                className="w-full py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Disconnect Wallet
              </button>
            </motion.div>
          )}

          {(step === "approving" || step === "registering") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3 py-2"
            >
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground">
                  {step === "approving"
                    ? approvalConfirming
                      ? "Confirming USDT approval..."
                      : "Approve USDT in your wallet..."
                    : regConfirming
                      ? "Confirming registration on-chain..."
                      : "Confirm registration in your wallet..."}
                </span>
              </div>
              <div className="flex gap-2">
                <div className={`flex-1 h-1.5 rounded-full ${approvalConfirmed || step === "registering" ? "bg-primary" : "bg-secondary/50"}`}>
                  {step === "approving" && !approvalConfirmed && (
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "80%" }}
                      transition={{ duration: 10, ease: "easeOut" }}
                      className="h-full bg-primary rounded-full"
                    />
                  )}
                </div>
                <div className={`flex-1 h-1.5 rounded-full ${regConfirmed ? "bg-primary" : "bg-secondary/50"}`}>
                  {step === "registering" && !regConfirmed && (
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "80%" }}
                      transition={{ duration: 10, ease: "easeOut" }}
                      className="h-full bg-primary rounded-full"
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className={step === "approving" ? "text-primary" : ""}>1. Approve USDT</span>
                <span className={step === "registering" ? "text-primary" : ""}>2. Register</span>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-2"
            >
              <div className="flex items-center justify-center gap-2 text-sm text-[hsl(var(--success))]">
                <CheckCircle className="h-4 w-4" />
                Registration confirmed
              </div>
            </motion.div>
          )}

          <p className="text-xs text-muted-foreground">
            By proceeding, you authorize a USDT transfer on BNB Smart Chain for protocol registration.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ActivationFeeScreen;
