import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Terminal, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { protocolFunctions } from "./constants";

const ProtocolOpsTab = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="text-center mb-2"
      >
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Core on-chain operations available to authorized branch managers. All transactions require wallet signature on BNB Smart Chain.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {protocolFunctions.map((fn, i) => (
          <motion.div
            key={fn.name}
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.05 + i * 0.04, duration: 0.4 }}
            className="glass-card-hover p-6 flex flex-col group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <fn.icon className="h-6 w-6 text-primary" />
              </div>
              {fn.selector !== "—" && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary border border-border">
                  <Terminal className="h-3 w-3 text-muted-foreground" />
                  <code className="text-xs font-mono text-primary">{fn.selector}</code>
                </div>
              )}
            </div>

            <h3 className="font-display font-semibold text-lg text-foreground mb-1">
              {fn.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2 flex-1">
              {fn.desc}
            </p>
            <p className="text-xs text-muted-foreground/70 font-mono mb-5">
              Params: {fn.params}
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
  );
};

export default ProtocolOpsTab;
