import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import useNextDistribution from "@/hooks/dataFetcher/useNextDistribution";

const CountdownTimer = ({ userAddress, mode = "month", label = "Next Distribution" }) => {
  const { secondsLeft: initialSecondsLeft, isLoading } = useNextDistribution(userAddress, mode);
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Sync when contract data arrives or changes
  useEffect(() => {
    if (initialSecondsLeft != null) {
      setSecondsLeft(initialSecondsLeft);
    }
  }, [initialSecondsLeft]);

  // Tick every second locally
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [secondsLeft > 0]);

  const units = useMemo(() => {
    const d = Math.floor(secondsLeft / 86400);
    const h = Math.floor((secondsLeft % 86400) / 3600);
    const m = Math.floor((secondsLeft % 3600) / 60);
    const s = secondsLeft % 60;
    return [
      { val: d, label: "d" },
      { val: h, label: "h" },
      { val: m, label: "m" },
      { val: s, label: "s" },
    ];
  }, [secondsLeft]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Clock className="h-4 w-4 text-primary" />
        </div>
      </div>
      {isLoading ? (
        <p className="text-2xl font-display font-bold text-foreground">...</p>
      ) : (
        <div className="flex items-center gap-2">
          {units.map((unit) => (
            <div key={unit.label} className="flex items-baseline gap-0.5">
              <span className="text-2xl font-display font-bold text-foreground tabular-nums">
                {String(unit.val).padStart(2, "0")}
              </span>
              <span className="text-xs text-primary font-semibold">{unit.label}</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-1">Countdown</p>
    </motion.div>
  );
};

export default CountdownTimer;
