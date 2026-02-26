import { motion } from "framer-motion";
import { ArrowRight, Shield, GitBranch, Coins, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Shield, label: "Governance", desc: "UUPS upgradeable, multi-sig secured" },
  { icon: GitBranch, label: "Branches", desc: "Independent subscription engines" },
  { icon: Coins, label: "Incubator", desc: "Token rounds for active members" },
  { icon: TrendingUp, label: "Passive Income", desc: "Real yield from ecosystem fees" },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 hero-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          Live on BNB Smart Chain
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-6">
          <span className="gradient-text">VaultIQ</span>
          <br />
          <span className="text-foreground/90">Ecosystem Dashboard</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Multi-branch subscription & incubator ecosystem. 
          Transparent passive income, governed pools, and token rounds — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link to="/app">
            <Button size="lg" className="text-base font-semibold px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.4)] transition-all hover:shadow-[0_0_40px_-5px_hsl(var(--primary)/0.6)]">
              Enter App
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="text-base px-8 py-6 border-border/60 text-foreground hover:bg-secondary">
            Learn More
          </Button>
        </div>
      </motion.div>

      {/* Feature cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl w-full"
      >
        {features.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="glass-card-hover p-6 text-center group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <f.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1">{f.label}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default HeroSection;
