import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Layers, Settings, Send, ArrowRight, Terminal, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const functions = [
  {
    icon: Layers,
    name: "setPoolRule",
    selector: "0x31609f0f",
    desc: "Configure distribution rules and allocation parameters for branch reward pools.",
  },
  {
    icon: Settings,
    name: "setPrincipalTier",
    selector: "0x9a919f94",
    desc: "Define and update principal tier thresholds for participant classification.",
  },
  {
    icon: Shield,
    name: "setTestingTimeConfig",
    selector: "0xed5712cf",
    desc: "Adjust testing period durations and time-based protocol parameters.",
  },
  {
    icon: Send,
    name: "submitWeeklyPerformance",
    selector: "0x2ceb41f9",
    desc: "Submit verified weekly branch performance data to the protocol.",
  },
];

const BranchManager = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-destructive/40 bg-destructive/10 text-sm text-destructive"
          >
            <Lock className="h-3.5 w-3.5" />
            Restricted Access
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight mb-6">
            <span className="gradient-text">Branch Manager</span>
            <br />
            <span className="text-foreground/90">Protocol Operations</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Authorized Protocol Operations for Qualified Branch Operators. Execute governed on-chain functions within the VaultIQ ecosystem.
          </p>

          <Link to="/app">
            <Button variant="outline" size="lg" className="text-base px-8 py-6 border-border/60 text-foreground hover:bg-secondary">
              <ArrowRight className="mr-2 h-5 w-5" />
              Back to Dashboard
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Function Cards */}
      <section ref={ref} className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-sm text-primary font-semibold tracking-widest uppercase mb-3 block">
              Smart Contract Interface
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Protocol <span className="gradient-text">Functions</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Core on-chain operations available to authorized branch managers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {functions.map((fn, i) => (
              <motion.div
                key={fn.selector}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                className="glass-card-hover p-8 flex flex-col group"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <fn.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border">
                    <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                    <code className="text-xs font-mono text-primary">{fn.selector}</code>
                  </div>
                </div>

                <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                  {fn.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                  {fn.desc}
                </p>

                <Button
                  disabled
                  className="w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 cursor-not-allowed opacity-60"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Execute Function
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-12 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="glass-card p-6 flex items-center justify-center gap-3">
            <Shield className="h-5 w-5 text-primary shrink-0" />
            <p className="text-sm text-muted-foreground">
              All operations require authorized wallet signature and are executed on <span className="text-foreground font-medium">BNB Smart Chain</span>.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default BranchManager;
