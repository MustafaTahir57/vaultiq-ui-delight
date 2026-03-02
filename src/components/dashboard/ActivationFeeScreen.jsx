import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, Loader2, Zap, Lock } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

const ActivationFeeScreen = () => {
  const { shortAddress, activate, disconnect } = useWallet();
  const [isPaying, setIsPaying] = useState(false);
  const [step, setStep] = useState("confirm"); // confirm | processing | success

  const handlePay = async () => {
    setIsPaying(true);
    setStep("processing");
    // Simulate blockchain transaction
    await new Promise((r) => setTimeout(r, 2500));
    setStep("success");
    await new Promise((r) => setTimeout(r, 1200));
    activate();
  };

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
              {step === "success" ? "Activation Complete" : "Protocol Activation"}
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              {step === "success"
                ? "Welcome to VaultIQ. Redirecting to your dashboard..."
                : "A one-time activation fee is required to access the VaultIQ Governed Protocol Dashboard."}
            </p>
          </div>

          {/* Fee Card */}
          {step !== "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-xl border border-border/40 bg-secondary/30 p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Activation Fee</span>
                <span className="text-2xl font-display font-bold text-primary">30 USDC</span>
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
          {step === "confirm" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <button
                onClick={handlePay}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                Pay 30 USDC & Activate
              </button>
              <button
                onClick={disconnect}
                className="w-full py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Disconnect Wallet
              </button>
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3 py-2"
            >
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground">Confirming transaction on-chain...</span>
              </div>
              <div className="w-full bg-secondary/50 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                  className="h-full bg-primary rounded-full"
                />
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
                Transaction confirmed
              </div>
            </motion.div>
          )}

          <p className="text-xs text-muted-foreground">
            By proceeding, you authorize a one-time 30 USDC transfer on BNB Smart Chain.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ActivationFeeScreen;
