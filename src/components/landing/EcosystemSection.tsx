import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Layers, Zap, Lock } from "lucide-react";

const pillars = [
  {
    icon: Shield,
    title: "VaultIQ Main",
    desc: "The governance layer managing global fee wallets, branch approvals, and protocol upgrades via UUPS proxy.",
    highlight: true,
  },
  {
    icon: Layers,
    title: "Branch Network",
    desc: "Each branch operates independently with its own subscription engine, trading wallets, reward pools, and passive income distributions.",
  },
  {
    icon: Zap,
    title: "Incubator Rounds",
    desc: "Active members can participate in token rounds with transparent allocation, deposit tracking, and pull-based claiming.",
  },
  {
    icon: Lock,
    title: "Passive Income Pools",
    desc: "Qualified members earn from ecosystem fees distributed across Pool 1–4 based on subscription tier and activity.",
  },
];

const EcosystemSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="ecosystem" ref={ref} className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm text-primary font-semibold tracking-widest uppercase mb-3 block">
            Ecosystem
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Built for <span className="gradient-text">Transparency</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every layer of VaultIQ is designed for clear separation of funds, governed upgrades, and verifiable on-chain activity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              className={`glass-card-hover p-8 flex gap-5 ${p.highlight ? "border-primary/30 shadow-[0_0_30px_-8px_hsl(var(--primary)/0.15)]" : ""}`}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <p.icon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;
