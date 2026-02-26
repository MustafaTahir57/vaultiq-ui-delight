import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-28 px-6">
      <div className="absolute inset-0 hero-glow opacity-50" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-2xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold font-display mb-6">
          Ready to <span className="gradient-text">Earn</span>?
        </h2>
        <p className="text-muted-foreground mb-10 text-lg">
          Join thousands of members already earning transparent passive income through the VaultIQ ecosystem.
        </p>
        <Link to="/app">
          <Button
            size="lg"
            className="text-base font-semibold px-10 py-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_40px_-5px_hsl(var(--primary)/0.5)] transition-all hover:shadow-[0_0_50px_-5px_hsl(var(--primary)/0.7)]"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
};

export default CTASection;
