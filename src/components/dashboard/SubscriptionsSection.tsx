import { motion } from "framer-motion";
import { CreditCard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";

const subscriptions = [
  { id: 1, branch: "Alpha Branch", plan: "Premium", status: "active" as const, weeklyReward: "4.2%", accrued: "$1,240", expiry: "2025-08-15" },
  { id: 2, branch: "Beta Branch", plan: "Standard", status: "active" as const, weeklyReward: "3.1%", accrued: "$680", expiry: "2025-09-22" },
  { id: 3, branch: "Gamma Branch", plan: "Premium", status: "pending" as const, weeklyReward: "—", accrued: "$0", expiry: "—" },
  { id: 4, branch: "Delta Branch", plan: "Basic", status: "expired" as const, weeklyReward: "2.5%", accrued: "$320", expiry: "2025-01-10" },
];

const SubscriptionsSection = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">My Subscriptions</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your branch subscriptions & rewards</p>
      </div>
      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
        <CreditCard className="h-4 w-4 mr-2" /> New Subscription
      </Button>
    </div>

    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              {["Branch", "Plan", "Status", "Weekly Reward", "Accrued", "Expiry", ""].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub, i) => (
              <motion.tr
                key={sub.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-border/30 last:border-0 hover:bg-secondary/30 transition-colors"
              >
                <td className="px-5 py-4 text-sm font-medium text-foreground">{sub.branch}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{sub.plan}</td>
                <td className="px-5 py-4"><StatusBadge status={sub.status} /></td>
                <td className="px-5 py-4 text-sm text-primary font-medium">{sub.weeklyReward}</td>
                <td className="px-5 py-4 text-sm text-foreground">{sub.accrued}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{sub.expiry}</td>
                <td className="px-5 py-4">
                  {sub.status === "active" && (
                    <Button variant="outline" size="sm" className="text-xs border-primary/30 text-primary hover:bg-primary/10">
                      Claim
                    </Button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default SubscriptionsSection;
