import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Pickaxe,
  DollarSign,
  Clock,
  Percent,
  Bitcoin,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import InputField from "./InputField";
import MiniStat from "./MiniStat";

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
    engine70: { principal: principal70, profit: profit70, total: total70, btc: btc70 },
    engine30: { start: reinvestStart, final: reinvestFinal, btc: btc30 },
    totalBTC: btc70 + btc30,
  };
}

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
          <InputField label="Investment Amount" icon={DollarSign} value={investment} onChange={setInvestment} prefix="$" />
          <InputField label="Estimated ROI per Cycle" icon={Percent} value={roi} onChange={setRoi} suffix="%" />
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
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
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
                <RefreshCw className={`h-3.5 w-3.5 ${btcLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setCalculated(true)}
          className="w-full bg-gradient-to-r from-primary to-[hsl(35,100%,60%)] text-primary-foreground font-display font-semibold py-3 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.4)] transition-shadow"
        >
          <Calculator className="h-4 w-4 mr-2" />
          Calculate Projection
        </Button>

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
                    <span className="text-xs font-display font-bold text-primary">70%</span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">Withdrawal Engine</h4>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <MiniStat label="Principal" value={`$${result.engine70.principal.toLocaleString()}`} />
                  <MiniStat label="Profit" value={`$${result.engine70.profit.toLocaleString()}`} highlight />
                  <MiniStat label="BTC Yield" value={`₿${result.engine70.btc.toFixed(4)}`} highlight />
                </div>
              </div>

              {/* 30% Engine */}
              <div className="bg-[hsl(var(--accent)/0.05)] rounded-xl p-5 space-y-3 border border-[hsl(var(--accent)/0.15)]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[hsl(var(--accent)/0.15)] flex items-center justify-center">
                    <span className="text-xs font-display font-bold text-[hsl(var(--accent))]">30%</span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Reinvestment Engine
                    <span className="text-xs text-muted-foreground ml-2">(6 cycles compound)</span>
                  </h4>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <MiniStat label="Start" value={`$${result.engine30.start.toLocaleString()}`} />
                  <MiniStat label="After 6 Cycles" value={`$${result.engine30.final.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} highlight />
                  <MiniStat label="BTC Yield" value={`₿${result.engine30.btc.toFixed(4)}`} highlight />
                </div>
              </div>

              {/* Total */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-br from-primary/15 via-primary/10 to-[hsl(var(--accent)/0.08)] rounded-xl p-5 border border-primary/20 text-center space-y-1"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Projected BTC</p>
                <p className="text-3xl font-display font-bold gradient-text">₿{result.totalBTC.toFixed(4)}</p>
                <p className="text-xs text-muted-foreground">
                  ≈ ${(result.totalBTC * btcPrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </motion.div>

              <p className="text-xs text-muted-foreground italic text-center">
                ⚠ This is a simulation tool. Actual results may vary based on market conditions.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ModelBCalculator;
