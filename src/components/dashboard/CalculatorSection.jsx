import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  TrendingUp,
  Pickaxe,
  ChevronDown,
  DollarSign,
  Clock,
  Percent,
  Bitcoin,
  ArrowRight,
  Loader2,
  Zap,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import useUserSubscriptions from "@/hooks/dataFetcher/useUserSubscriptions";
import useModelAProjection from "@/hooks/dataFetcher/useModelAProjection";

/* ─── Model B pure-frontend calculator ─── */
function modelBCalculator(investment, roiPercent, btcPrice) {
  const roi = roiPercent / 100;
  const profit = investment * roi;

  const principal70 = investment * 0.7;
  const profit70 = profit * 0.7;
  const total70 = principal70 + profit70;
  const btc70 = total70 / btcPrice;

  const principal30 = investment * 0.3;
  const profit30 = profit * 0.3;
  const reinvestStart = principal30 + profit30;
  const reinvestFinal = reinvestStart * Math.pow(1 + roi, 6);
  const btc30 = reinvestFinal / btcPrice;

  return {
    engine70: {
      principal: principal70,
      profit: profit70,
      total: total70,
      btc: btc70,
    },
    engine30: { start: reinvestStart, final: reinvestFinal, btc: btc30 },
    totalBTC: btc70 + btc30,
  };
}

/* ─── Animated number ─── */
const AnimNum = ({ value, prefix = "", suffix = "", decimals = 2 }) => (
  <motion.span
    key={value}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="tabular-nums"
  >
    {prefix}
    {typeof value === "number" ? value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : value}
    {suffix}
  </motion.span>
);

/* ─── Model A Subscription Card ─── */
const ModelACard = ({ sub, index }) => {
  const { address } = useWallet();
  const { projection, isLoading } = useModelAProjection(address, sub.index);

  if (isLoading) {
    return (
      <div className="glass-card p-5 flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading subscription #{index + 1}...</span>
      </div>
    );
  }

  if (!projection) return null;

  const progressPct = Math.min(
    100,
    (projection.elapsedWeeks / projection.totalWeeks) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card-hover p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
            <span className="font-display text-sm font-bold text-primary">
              #{index + 1}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Model A — Subscription #{index + 1}
            </p>
            <p className="text-xs text-muted-foreground">
              Weekly rate: {projection.weeklyRatePercent.toFixed(2)}%
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-[hsl(var(--success))] border border-[hsl(var(--success)/0.2)]">
          Active
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>
            Week {projection.elapsedWeeks} / {projection.totalWeeks}
          </span>
          <span>{projection.remainingWeeks} weeks remaining</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(35,100%,60%)]"
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/50 rounded-xl p-4 space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <DollarSign className="h-3 w-3" /> Principal
          </p>
          <p className="text-lg font-display font-bold text-foreground">
            <AnimNum value={projection.principal} prefix="$" />
          </p>
        </div>
        <div className="bg-muted/50 rounded-xl p-4 space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Earned So Far
          </p>
          <p className="text-lg font-display font-bold text-[hsl(var(--success))]">
            <AnimNum value={projection.totalEarned} prefix="$" />
          </p>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/15 rounded-xl p-4 space-y-1">
          <p className="text-xs text-primary/80 flex items-center gap-1">
            <Zap className="h-3 w-3" /> PTR (Projected Rewards)
          </p>
          <p className="text-lg font-display font-bold gradient-text">
            <AnimNum value={projection.PTR} prefix="$" />
          </p>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/15 rounded-xl p-4 space-y-1">
          <p className="text-xs text-primary/80 flex items-center gap-1">
            <BarChart3 className="h-3 w-3" /> PTG (Total Growth)
          </p>
          <p className="text-lg font-display font-bold gradient-text">
            <AnimNum value={projection.PTG} prefix="+" suffix="%" />
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Model B Calculator ─── */
const ModelBCalculator = () => {
  const [investment, setInvestment] = useState(10000);
  const [roi, setRoi] = useState(15);
  const [cycleDuration, setCycleDuration] = useState(90);
  const [btcPrice, setBtcPrice] = useState(80000);
  const [btcLoading, setBtcLoading] = useState(false);
  const [calculated, setCalculated] = useState(false);

  const fetchBTC = async () => {
    setBtcLoading(true);
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      );
      const data = await res.json();
      if (data?.bitcoin?.usd) setBtcPrice(data.bitcoin.usd);
    } catch {
      /* keep manual */
    } finally {
      setBtcLoading(false);
    }
  };

  useEffect(() => {
    fetchBTC();
  }, []);

  const result = useMemo(
    () => (calculated ? modelBCalculator(investment, roi, btcPrice) : null),
    [calculated, investment, roi, btcPrice]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card-hover overflow-hidden"
    >
      {/* Header accent bar */}
      <div className="h-1 bg-gradient-to-r from-[hsl(var(--accent))] via-primary to-[hsl(35,100%,60%)]" />

      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[hsl(var(--accent)/0.15)] border border-[hsl(var(--accent)/0.25)] flex items-center justify-center">
            <Pickaxe className="h-5 w-5 text-[hsl(var(--accent))]" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">
              Model B — Mining Projection
            </h3>
            <p className="text-xs text-muted-foreground">
              Simulate your mining returns • No contract calls needed
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Investment Amount"
            icon={DollarSign}
            value={investment}
            onChange={setInvestment}
            prefix="$"
          />
          <InputField
            label="Estimated ROI per Cycle"
            icon={Percent}
            value={roi}
            onChange={setRoi}
            suffix="%"
          />
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" /> Cycle Duration
            </label>
            <div className="flex gap-2">
              {[90, 180].map((d) => (
                <button
                  key={d}
                  onClick={() => setCycleDuration(d)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    cycleDuration === d
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted"
                  }`}
                >
                  {d} days
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Bitcoin className="h-3 w-3" /> BTC Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <input
                type="number"
                value={btcPrice}
                onChange={(e) => setBtcPrice(Number(e.target.value))}
                className="w-full bg-muted/50 border border-border/50 rounded-lg py-2.5 pl-7 pr-10 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button
                onClick={fetchBTC}
                disabled={btcLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                title="Fetch live BTC price"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${btcLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Calculate button */}
        <Button
          onClick={() => setCalculated(true)}
          className="w-full bg-gradient-to-r from-primary to-[hsl(35,100%,60%)] text-primary-foreground font-display font-semibold py-3 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.4)] transition-shadow"
        >
          <Calculator className="h-4 w-4 mr-2" />
          Calculate Projection
        </Button>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* 70% Engine */}
              <div className="bg-muted/40 rounded-xl p-5 space-y-3 border border-border/30">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-display font-bold text-primary">
                      70%
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Withdrawal Engine
                  </h4>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <MiniStat
                    label="Principal"
                    value={`$${result.engine70.principal.toLocaleString()}`}
                  />
                  <MiniStat
                    label="Profit"
                    value={`$${result.engine70.profit.toLocaleString()}`}
                    highlight
                  />
                  <MiniStat
                    label="BTC Yield"
                    value={`₿${result.engine70.btc.toFixed(4)}`}
                    highlight
                  />
                </div>
              </div>

              {/* 30% Engine */}
              <div className="bg-[hsl(var(--accent)/0.05)] rounded-xl p-5 space-y-3 border border-[hsl(var(--accent)/0.15)]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[hsl(var(--accent)/0.15)] flex items-center justify-center">
                    <span className="text-xs font-display font-bold text-[hsl(var(--accent))]">
                      30%
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Reinvestment Engine
                    <span className="text-xs text-muted-foreground ml-2">
                      (6 cycles compound)
                    </span>
                  </h4>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <MiniStat
                    label="Start"
                    value={`$${result.engine30.start.toLocaleString()}`}
                  />
                  <MiniStat
                    label="After 6 Cycles"
                    value={`$${result.engine30.final.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    highlight
                  />
                  <MiniStat
                    label="BTC Yield"
                    value={`₿${result.engine30.btc.toFixed(4)}`}
                    highlight
                  />
                </div>
              </div>

              {/* Total */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-br from-primary/15 via-primary/10 to-[hsl(var(--accent)/0.08)] rounded-xl p-5 border border-primary/20 text-center space-y-1"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Total Projected BTC
                </p>
                <p className="text-3xl font-display font-bold gradient-text">
                  ₿{result.totalBTC.toFixed(4)}
                </p>
                <p className="text-xs text-muted-foreground">
                  ≈ $
                  {(result.totalBTC * btcPrice).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </motion.div>

              <p className="text-xs text-muted-foreground italic text-center">
                ⚠ This is a simulation tool. Actual results may vary based on
                market conditions.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* ─── Reusable input ─── */
const InputField = ({ label, icon: Icon, value, onChange, prefix, suffix }) => (
  <div className="space-y-2">
    <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
      <Icon className="h-3 w-3" /> {label}
    </label>
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {prefix}
        </span>
      )}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full bg-muted/50 border border-border/50 rounded-lg py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors ${
          prefix ? "pl-7" : "pl-3"
        } ${suffix ? "pr-8" : "pr-3"}`}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

/* ─── Mini stat ─── */
const MiniStat = ({ label, value, highlight }) => (
  <div className="text-center space-y-0.5">
    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
      {label}
    </p>
    <p
      className={`text-sm font-display font-bold ${highlight ? "text-foreground" : "text-muted-foreground"}`}
    >
      {value}
    </p>
  </div>
);

/* ─── Main Calculator Section ─── */
const CalculatorSection = () => {
  const { address } = useWallet();
  const { subscriptions, isLoading } = useUserSubscriptions(address);
  const [activeTab, setActiveTab] = useState("modelA");

  const modelASubs = useMemo(
    () =>
      subscriptions.filter(
        (s) => s.isActive && Number(s.planId) === 0
      ),
    [subscriptions]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Calculator
        </h1>
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
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
            <span className="hidden md:inline text-xs opacity-70">
              — {tab.desc}
            </span>
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
                <p className="text-sm text-muted-foreground">
                  No active Model A subscriptions found
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Purchase a Model A subscription to see projections here
                </p>
              </div>
            ) : (
              modelASubs.map((sub, i) => (
                <ModelACard key={sub.index} sub={sub} index={i} />
              ))
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
