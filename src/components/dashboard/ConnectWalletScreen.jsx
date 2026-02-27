import { motion } from "framer-motion";
import { Wallet, Shield, Zap, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";

const features = [
  { icon: Shield, label: "Non-custodial", desc: "You keep full control of your assets" },
  { icon: Zap, label: "Instant access", desc: "View subscriptions, rewards & referrals" },
  { icon: Wallet, label: "Multi-wallet", desc: "MetaMask, WalletConnect & more" },
];

const ConnectWalletScreen = () => {
  const { connect, isConnecting } = useWallet();

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
            <Wallet className="h-8 w-8 text-primary" />
          </motion.div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Connect Your Wallet</h1>
            <p className="text-muted-foreground text-sm mt-2">
              Connect your wallet to access your VaultIQ dashboard, subscriptions, and rewards.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 text-left">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Connect Button */}
          <Button
            onClick={connect}
            disabled={isConnecting}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm"
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting…
              </>
            ) : (
              <>
                Connect Wallet
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground">
            By connecting, you agree to VaultIQ's terms of service.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ConnectWalletScreen;
