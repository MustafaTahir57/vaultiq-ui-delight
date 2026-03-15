import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import useProtocolStats from "@/hooks/dataFetcher/useProtocolStats";

const formatTVL = (val) => {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M+`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K+`;
  return `$${val.toFixed(0)}`;
};

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { stats, isLoading } = useProtocolStats();

  const items = [
    { value: isLoading ? "..." : formatTVL(stats?.tvl || 0), label: "TVL" },
    { value: isLoading ? "..." : String(stats?.activeBranches || 0), label: "Active Branches" },
    { value: isLoading ? "..." : (stats?.totalActiveMembers || 0).toLocaleString(), label: "Active Members" },
    { value: isLoading ? "..." : `${(stats?.avgPerformanceBps || 0).toFixed(1)}%`, label: "Protocol Performance" },
  ];

  return (
    <section ref={ref} className="relative py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="glass-card p-1 rounded-2xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-primary/10">
            {items.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-8 text-center"
              >
                <div className="font-display text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
