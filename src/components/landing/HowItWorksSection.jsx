import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { UserPlus, GitBranch, Coins, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Connect & Activate",
    desc: "Connect your wallet and activate your selected Participation Tier.",
    step: "01",
  },
  {
    icon: GitBranch,
    title: "Branch Earns Yield",
    desc: "Your branch deploys capital across structured DeFi strategies designed to generate consistent weekly performance.",
    step: "02",
  },
  {
    icon: Coins,
    title: "Earn Weekly Residual",
    desc: "Track Protocol-Based Rewards in real time. Distribution pools grow based on Qualified Branch Participation.",
    step: "03",
  },
  {
    icon: TrendingUp,
    title: "Algorithmic Protocol",
    desc: "At Expiry: Claim Confirmation Protocol Withdraw.",
    step: "04",
  },
];

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" ref={ref} className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm text-primary font-semibold tracking-widest uppercase mb-3 block">
            How It Works
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            From <span className="gradient-text">Subscription</span> to Yield
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Four simple steps to start earning transparent passive income through the VaultIQ ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
              className="relative glass-card-hover p-6 group"
            >
              <div className="text-5xl font-display font-bold text-primary/10 absolute top-4 right-4">
                {step.step}
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
