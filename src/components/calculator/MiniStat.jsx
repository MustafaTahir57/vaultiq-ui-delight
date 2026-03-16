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

export default MiniStat;
