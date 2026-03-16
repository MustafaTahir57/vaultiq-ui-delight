import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Pickaxe, Loader2 } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import useUserSubscriptions from "@/hooks/dataFetcher/useUserSubscriptions";
import ModelACard from "@/components/calculator/ModelACard";
import ModelBCalculator from "@/components/calculator/ModelBCalculator";

const CalculatorSection = () => {
  const { address } = useWallet();
  const { subscriptions, isLoading } = useUserSubscriptions(address);
  const [activeTab, setActiveTab] = useState("modelA");

  const modelASubs = useMemo(
    () => subscriptions.filter((s) => s.isActive && Number(s.planId) === 0),
    [subscriptions]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-display font-bold text-foreground">Calculator</h1>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>
      <p className="text-muted-foreground text-sm -mt-4">
        Project your earnings and simulate mining returns
      </p>

      {/* Tab switch */}
      <div className="flex gap-2 p-1 bg-muted/40 rounded-xl w-fit">
        {[
          { id: "modelA", label: "Model A", icon: TrendingUp, desc: "Subscription Projections" },
          { id: "modelB", label: "Model B", icon: Pickaxe, desc: "Mining Calculator" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-primary/15 text-primary border border-primary/25 shadow-[0_0_15px_-5px_hsl(var(--primary)/0.2)]"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="hidden md:inline text-xs opacity-70">— {tab.desc}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "modelA" ? (
          <motion.div
            key="modelA"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {isLoading ? (
              <div className="glass-card p-12 flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-sm">Loading your subscriptions...</span>
              </div>
            ) : modelASubs.length === 0 ? (
              <div className="glass-card p-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto">
                  <TrendingUp className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No active Model A subscriptions found</p>
                <p className="text-xs text-muted-foreground/70">Purchase a Model A subscription to see projections here</p>
              </div>
            ) : (
              modelASubs.map((sub, i) => <ModelACard key={sub.index} sub={sub} index={i} />)
            )}
          </motion.div>
        ) : (
          <motion.div
            key="modelB"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ModelBCalculator />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalculatorSection;
