import { motion } from "framer-motion";
import { TrendingUp, Clock, Users, ArrowDownToLine } from "lucide-react";
import StatCard from "./StatCard";
import { Button } from "@/components/ui/button";

const PassiveIncomeSection = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground">Passive Income</h1>
      <p className="text-muted-foreground text-sm mt-1">Your confirmed and projected passive earnings</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Confirmed Pool" value="$3,250" subtitle="Withdrawable now" icon={TrendingUp} />
      <StatCard title="Projected Income" value="$1,840" subtitle="From active subs" icon={TrendingUp} />
      <StatCard title="Next Distribution" value="3d 14h" subtitle="Countdown" icon={Clock} />
      <StatCard title="Qualified Members" value="89" icon={Users} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold text-foreground">Confirmed Passive Pool</h3>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <ArrowDownToLine className="h-4 w-4 mr-2" /> Withdraw
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-border/30">
            <span className="text-sm text-muted-foreground">Available balance</span>
            <span className="text-sm font-medium text-foreground">$3,250.00</span>
          </div>
          <div className="flex justify-between py-3 border-b border-border/30">
            <span className="text-sm text-muted-foreground">Last withdrawal</span>
            <span className="text-sm text-muted-foreground">Feb 15, 2025</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-sm text-muted-foreground">Total withdrawn</span>
            <span className="text-sm font-medium text-foreground">$12,480.00</span>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h3 className="font-display font-semibold text-foreground mb-6">Projected Income</h3>
        <div className="space-y-4">
          {[
            { branch: "Alpha Branch", amount: "$820", pct: "4.2%" },
            { branch: "Beta Branch", amount: "$540", pct: "3.1%" },
            { branch: "Gamma Branch", amount: "$480", pct: "2.8%" },
          ].map((item) => (
            <div key={item.branch} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
              <div>
                <p className="text-sm text-foreground">{item.branch}</p>
                <p className="text-xs text-muted-foreground">Weekly rate: {item.pct}</p>
              </div>
              <span className="text-sm font-medium text-warning">{item.amount}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 italic">
          ⚠ Projected values are estimates and may differ from actual distributions
        </p>
      </motion.div>
    </div>
  </div>
);

export default PassiveIncomeSection;
