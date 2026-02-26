import { Wallet, Users, TrendingUp, DollarSign, BarChart3, PieChart } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const passiveData = [
  { month: "Jan", projected: 1200, actual: 980 },
  { month: "Feb", projected: 1400, actual: 1350 },
  { month: "Mar", projected: 1600, actual: 1520 },
  { month: "Apr", projected: 1500, actual: 1480 },
  { month: "May", projected: 1800, actual: 1700 },
  { month: "Jun", projected: 2000, actual: 0 },
];

const recentActivity = [
  { action: "Subscription renewed", branch: "Alpha Branch", status: "active", time: "2h ago" },
  { action: "Pool 2 reward claimed", branch: "VaultIQ Main", status: "claimable", time: "5h ago" },
  { action: "Incubator deposit", branch: "Round #4", status: "pending", time: "1d ago" },
  { action: "Passive income distributed", branch: "Beta Branch", status: "active", time: "2d ago" },
];

const OverviewSection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Your VaultIQ ecosystem at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Subscriptions" value="12" icon={Users} trend={{ value: "+3 this month", positive: true }} />
        <StatCard title="Total Rewards" value="$8,420" icon={DollarSign} trend={{ value: "+12.5%", positive: true }} />
        <StatCard title="Fee Wallet" value="$24,180" subtitle="Platform revenue" icon={Wallet} />
        <StatCard title="Passive Income" value="$3,250" subtitle="Confirmed pool" icon={TrendingUp} trend={{ value: "+8.2%", positive: true }} />
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Passive Income
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Projected vs Actual</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-primary/40" /> Projected</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-primary" /> Actual</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={passiveData} barGap={4}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ background: "hsl(222 41% 10%)", border: "1px solid hsl(222 30% 18%)", borderRadius: 8, color: "hsl(210 40% 96%)" }}
                formatter={(value) => [`$${value}`, ""]}
              />
              <Bar dataKey="projected" radius={[4, 4, 0, 0]} fill="hsl(174 72% 52% / 0.25)" />
              <Bar dataKey="actual" radius={[4, 4, 0, 0]}>
                {passiveData.map((_, i) => (
                  <Cell key={i} fill={passiveData[i].actual > 0 ? "hsl(174, 72%, 52%)" : "hsl(174 72% 52% / 0.1)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2 mb-4">
            <PieChart className="h-4 w-4 text-primary" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{item.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{item.branch}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OverviewSection;
