import { motion } from "framer-motion";

const AnimNum = ({ value, prefix = "", suffix = "", decimals = 2 }) => (
  <motion.span
    key={value}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="tabular-nums"
  >
    {prefix}
    {typeof value === "number"
      ? value.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : value}
    {suffix}
  </motion.span>
);

export default AnimNum;
