import { motion } from "framer-motion";
import { User, Copy, Shield, UserCheck, Link2 } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { toast } from "sonner";

const AccountSection = () => {
  const { address, shortAddress, isBranchManager, userBranchAddress } = useWallet();

  const referralLink = userBranchAddress
    ? `https://vaultiq-ui-delight.vercel.app/app/deploy?address=${userBranchAddress}&ref=${address}`
    : null;

  const copyToClipboard = (text, label = "Copied!") => {
    navigator.clipboard.writeText(text);
    toast.success(label);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Account</h1>
        <p className="text-muted-foreground text-sm mt-1">Your wallet, role, and referral link</p>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
        {/* Wallet */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground">Connected Wallet</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground font-mono">{shortAddress || "—"}</span>
              {address && (
                <button onClick={() => copyToClipboard(address, "Address copied!")} className="text-muted-foreground hover:text-primary transition-colors">
                  <Copy className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* Role */}
          <div className="flex justify-between py-2 border-b border-border/30">
            <span className="text-sm text-muted-foreground">Role</span>
            <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
              {isBranchManager ? (
                <><Shield className="h-3.5 w-3.5 text-primary" /> Branch Manager</>
              ) : (
                <><UserCheck className="h-3.5 w-3.5 text-primary" /> User</>
              )}
            </span>
          </div>

          {/* Referral Link */}
          <div className="flex flex-col gap-2 py-2">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5" /> Referral Link
            </span>
            {referralLink ? (
              <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2">
                <span className="text-xs font-mono text-muted-foreground truncate flex-1">{referralLink}</span>
                <button onClick={() => copyToClipboard(referralLink, "Referral link copied!")} className="text-muted-foreground hover:text-primary transition-colors shrink-0">
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">No branch assigned yet</span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountSection;
