import { motion } from "framer-motion";
import { User, Copy, Shield, UserCheck, Link2, Wallet, ExternalLink } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { toast } from "sonner";

const AccountSection = () => {
  const { address, shortAddress, isBranchManager, userBranchAddress } =
    useWallet();

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
        <h1 className="text-2xl font-display font-bold text-foreground">
          Account
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your wallet, role, and referral link
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Wallet Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="glass-card p-5 flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Connected Wallet</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-display font-bold text-foreground">
              {shortAddress || "—"}
            </span>
            {address && (
              <button
                onClick={() => copyToClipboard(address, "Address copied!")}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {address && (
            <a
              href={`https://bscscan.com/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary/70 hover:text-primary flex items-center gap-1 transition-colors"
            >
              View on Explorer <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </motion.div>

        {/* Role Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card p-5 flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              {isBranchManager ? (
                <Shield className="h-5 w-5 text-primary" />
              ) : (
                <UserCheck className="h-5 w-5 text-primary" />
              )}
            </div>
            <span className="text-sm text-muted-foreground">Role</span>
          </div>
          <span className="text-lg font-display font-bold text-foreground">
            {isBranchManager ? "Branch Manager" : "User"}
          </span>
          <span className="text-xs text-muted-foreground">
            {isBranchManager
              ? "You manage one or more branches"
              : "Standard protocol participant"}
          </span>
        </motion.div>

        {/* Referrals Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Referrals</span>
          </div>
          <span className="text-lg font-display font-bold text-foreground">
            14 users
          </span>
          <span className="text-xs text-muted-foreground">
            Total referred participants
          </span>
        </motion.div>
      </div>

      {/* Referral Link Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-5"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Link2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground text-sm">
              Your Referral Link
            </p>
            <p className="text-xs text-muted-foreground">
              Share this link to invite new users to your branch
            </p>
          </div>
        </div>

        {referralLink ? (
          <div className="flex items-center gap-2 bg-secondary/50 border border-border/30 rounded-lg px-4 py-3">
            <span className="text-xs font-mono text-muted-foreground truncate flex-1">
              {referralLink}
            </span>
            <button
              onClick={() =>
                copyToClipboard(referralLink, "Referral link copied!")
              }
              className="bg-primary/10 hover:bg-primary/20 text-primary rounded-md px-3 py-1.5 text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5"
            >
              <Copy className="h-3 w-3" /> Copy
            </button>
          </div>
        ) : (
          <div className="bg-secondary/30 border border-border/20 rounded-lg px-4 py-3">
            <span className="text-xs text-muted-foreground">
              No branch assigned yet — referral link will appear once you're linked to a branch.
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AccountSection;
