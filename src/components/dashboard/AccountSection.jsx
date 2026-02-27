import { motion } from "framer-motion";
import { User, Copy, ExternalLink, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";

const transactions = [
  { type: "Reward Claim", amount: "+$240", date: "Feb 24, 2025", hash: "0xabc...123" },
  { type: "Subscription", amount: "-$500", date: "Feb 20, 2025", hash: "0xdef...456" },
  { type: "Incubator Deposit", amount: "-$1,200", date: "Feb 18, 2025", hash: "0xghi...789" },
  { type: "Passive Withdrawal", amount: "+$820", date: "Feb 15, 2025", hash: "0xjkl...012" },
];

const AccountSection = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground">Account</h1>
      <p className="text-muted-foreground text-sm mt-1">Your wallet, referrals, and transaction history</p>
    </div>

    <div>
      {/* Profile */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground">Connected Wallet</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground font-mono">0x1a2b3c4d5e6f...8a9b0c1d2e3f</span>
              <button className="text-muted-foreground hover:text-primary transition-colors"><Copy className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-border/30">
            <span className="text-sm text-muted-foreground">Role</span>
            <span className="text-sm font-medium text-foreground flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" /> Branch Manager</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/30">
            <span className="text-sm text-muted-foreground">Referral address</span>
            <span className="text-sm font-mono text-primary">0x7f2c...4a8b</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-muted-foreground">Referrals</span>
            <span className="text-sm text-foreground">14 users</span>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

export default AccountSection;
