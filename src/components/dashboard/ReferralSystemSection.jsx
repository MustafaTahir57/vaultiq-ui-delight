import { motion } from "framer-motion";
import { Users, Copy, Link2, TrendingUp, ChevronRight, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useWallet } from "@/contexts/WalletContext";
import useReferralData from "@/hooks/dataFetcher/useReferralData";
import { useAccount } from "wagmi";
import { toast } from "sonner";

const formatSales = (val) => {
  const num = parseFloat(val);
  if (num >= 1000) return `$${(num / 1000).toFixed(1)}k`;
  return `$${num.toFixed(0)}`;
};

const POOL_LABEL_NAMES = {
  "Pool 1": "Emerald",
  "Pool 2": "Diamond",
  "Pool 3": "Blue Diamond",
  "Pool 4": "Black Diamond",
  "Passive": "Crown Diamond",
};

const QualBadge = ({ qualified, label }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
    {qualified ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-muted-foreground" />
    )}
    <span className="text-xs font-medium text-foreground">{label}</span>
    <span className="text-xs font-bold text-primary">{POOL_LABEL_NAMES[label]}</span>
  </div>
);

const ReferralSystemSection = () => {
  const { address } = useAccount();
  const { userBranchAddress } = useWallet();
  const { referralData, treeCounts, isLoading, isError } = useReferralData(userBranchAddress, address);

    const referralLink = userBranchAddress
    ? `https://vaultiq-ui-delight.vercel.app/app/deploy?address=${userBranchAddress}&ref=${address}`
    : null;

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("Address copied!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading referral data...</span>
      </div>
    );
  }

  if (isError || !referralData) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-sm text-muted-foreground">Unable to load referral data.</span>
      </div>
    );
  }

  const totalMembers = treeCounts
    ? treeCounts.l1Members + treeCounts.l2Members + treeCounts.l3Members + treeCounts.l4Members
    : 0;

  const referralLevels = [
    {
      level: 1,
      label: "Direct Referrals",
      members: treeCounts?.l1Members || 0,
      active: treeCounts?.l1Active || 0,
      sales: referralData.level1Sales,
      color: "bg-primary",
    },
    {
      level: 2,
      label: "Level 2",
      members: treeCounts?.l2Members || 0,
      active: treeCounts?.l2Active || 0,
      sales: referralData.level2Sales,
      color: "bg-chart-2",
    },
    {
      level: 3,
      label: "Level 3",
      members: treeCounts?.l3Members || 0,
      active: treeCounts?.l3Active || 0,
      sales: referralData.level3Sales,
      color: "bg-chart-3",
    },
    {
      level: 4,
      label: "Level 4+",
      members: treeCounts?.l4Members || 0,
      active: treeCounts?.l4Active || 0,
      sales: referralData.level4PlusSales,
      color: "bg-chart-4",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Referral System</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your 4-level referral tree &amp; qualification status — Week {referralData.currentWeek}
        </p>
      </div>

      {/* Referral Link */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Link2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Your Referral Address</p>
            <p className="text-xs text-muted-foreground">Share to grow your team</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-4 py-2.5">
          <span className="text-xs font-mono text-muted-foreground truncate flex-1">{referralLink}</span>
          <button onClick={handleCopy} className="text-muted-foreground hover:text-primary transition-colors shrink-0">
            <Copy className="h-4 w-4" />
          </button>
        </div>
        {referralData.myReferrer && referralData.myReferrer !== "0x0000000000000000000000000000000000000000" && (
          <p className="text-xs text-muted-foreground mt-2">
            Referred by: <span className="font-mono text-foreground">{referralData.myReferrer.slice(0, 6)}...{referralData.myReferrer.slice(-4)}</span>
          </p>
        )}
      </motion.div>

      {/* Team Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Team Members", value: totalMembers, icon: Users },
          { label: "Total Team Sales", value: formatSales(referralData.totalTeamSales), icon: TrendingUp },
          { label: "Pool 3 Qualified (Depth 3+)", value: referralData.pool3Depth3PlusCount, icon: ChevronRight },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-xl font-display font-bold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Weekly Sales */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
        <p className="text-xs text-muted-foreground mb-1">Weekly Team Sales (This Week)</p>
        <p className="text-lg font-display font-bold text-primary">{formatSales(referralData.weeklyTeamSalesThisWeek)}</p>
      </motion.div>

      {/* Qualification Status */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5">
        <h2 className="text-sm font-display font-semibold text-foreground mb-3">Qualification Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          <QualBadge qualified={referralData.isPool1Qualified} label="Pool 1" />
          <QualBadge qualified={referralData.isPool2Qualified} label="Pool 2" />
          <QualBadge qualified={referralData.isPool3Qualified} label="Pool 3" />
          <QualBadge qualified={referralData.isPool4Qualified} label="Pool 4" />
          <QualBadge qualified={referralData.isPassiveQualified} label="Passive" />
        </div>
      </motion.div>

      {/* 4-Level Tree Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50">
          <h2 className="text-sm font-display font-semibold text-foreground">4-Level Tree Summary</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                {["Level", "Members", "Active", "Sales", "Activity"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {referralLevels.map((lvl, i) => (
                <motion.tr
                  key={lvl.level}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border/30 last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${lvl.color}`} />
                      <span className="text-sm font-medium text-foreground">{lvl.label}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-foreground">{lvl.members}</td>
                  <td className="px-5 py-4 text-sm text-foreground">{lvl.active}</td>
                  <td className="px-5 py-4 text-sm text-primary font-medium">{formatSales(lvl.sales)}</td>
                  <td className="px-5 py-4 w-40">
                    <Progress value={lvl.members > 0 ? (lvl.active / lvl.members) * 100 : 0} className="h-1.5" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ReferralSystemSection;
