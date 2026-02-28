import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, KeyRound, FileCode2, Eye } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Upgradeable Governance", desc: "Upgradeable Protocol Architecture." },
  { icon: KeyRound, title: "Multi-Signature Authorization", desc: "Critical Protocol Operations Require Multi-Signature Authorization." },
  { icon: FileCode2, title: "Audited Smart Contracts", desc: "Verified, Audited, and Transparently Executed On-Chain." },
  { icon: Eye, title: "Full Transparency", desc: "All Protocol Activity Publicly Verifiable on BNB Smart Chain Explorer." },
];

const SecuritySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="security" ref={ref} className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-sm text-primary font-semibold tracking-widest uppercase mb-3 block">
            Security
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Institutional-Grade Protocol <span className="gradient-text">Architecture</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Designed for structured Web3 participation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              className="glass-card p-6 text-center group hover:border-primary/30 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)] transition-shadow">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
