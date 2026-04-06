import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bitcoin, RefreshCw, DollarSign } from "lucide-react";
import InputField from "./InputField";

const ModelBCalculator = () => {
  const [btcAmount, setBtcAmount] = useState(0.07);
  const [btcPrice, setBtcPrice] = useState(80000);
  const [btcLoading, setBtcLoading] = useState(false);

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

  const usdValue = btcAmount * btcPrice;

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
            <Bitcoin className="h-5 w-5 text-[hsl(var(--accent))]" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">
              BTC Value Calculator
            </h3>
            <p className="text-xs text-muted-foreground">
              Convert your BTC holdings to USD
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="BTC Amount"
            icon={Bitcoin}
            value={btcAmount}
            onChange={setBtcAmount}
            prefix="₿"
          />
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> BTC Price
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

        {/* Result */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-br from-primary/15 via-primary/10 to-[hsl(var(--accent)/0.08)] rounded-xl p-5 border border-primary/20 text-center space-y-1"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Value (USDC)</p>
          <p className="text-3xl font-display font-bold gradient-text">
            ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground">
            ₿{btcAmount} × ${btcPrice.toLocaleString()}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ModelBCalculator;
