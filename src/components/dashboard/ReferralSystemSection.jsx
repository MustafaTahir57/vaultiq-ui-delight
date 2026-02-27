import { motion } from "framer-motion";
import { Users, Copy, Link2, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const referralLevels = [
  {
    level: 1,
    label: "Direct Referrals",
    members: 14,
    sales: "$12,400",
    qualified: 8,
    color: "bg-primary",
  },
  {
    level: 2,
    label: "Level 2",
    members: 42,
    sales: "$28,600",
    qualified: 22,
    color: "bg-chart-2",
  },
  {
    level: 3,
    label: "Level 3",
    members: 118,
    sales: "$64,200",
    qualified: 56,
    color: "bg-chart-3",
  },
  {
    level: 4,
    label: "Level 4",
    members: 310,
    sales: "$142,800",
    qualified: 134,
    color: "bg-chart-4",
  },
];

const teamStats = {
  totalTeamSales: "$248,000",
  totalMembers: 484,
  qualifiedPool3: 42,
  referralAddress: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
};

const ReferralSystemSection = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground">Referral System</h1>
      <p className="text-muted-foreground text-sm mt-1">Your 4-level referral tree, sales counters & qualification</p>
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
        <span className="text-xs font-mono text-muted-foreground truncate flex-1">{teamStats.referralAddress}</span>
        <button className="text-muted-foreground hover:text-primary transition-colors shrink-0">
          <Copy className="h-4 w-4" />
        </button>
      </div>
    </motion.div>

    {/* Team Summary Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        { label: "Total Team Members", value: teamStats.totalMembers, icon: Users },
        { label: "Total Team Sales", value: teamStats.totalTeamSales, icon: TrendingUp },
        { label: "Pool 3 Qualified (Depth 3+)", value: teamStats.qualifiedPool3, icon: ChevronRight },
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

    {/* 4-Level Tree Summary */}
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border/50">
        <h2 className="text-sm font-display font-semibold text-foreground">4-Level Tree Summary</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              {["Level", "Members", "Sales", "Qualified", "Depth"].map((h) => (
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
                <td className="px-5 py-4 text-sm text-primary font-medium">{lvl.sales}</td>
                <td className="px-5 py-4 text-sm text-foreground">{lvl.qualified}</td>
                <td className="px-5 py-4 w-40">
                  <Progress value={(lvl.qualified / lvl.members) * 100} className="h-1.5" />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  </div>
);

export default ReferralSystemSection;
