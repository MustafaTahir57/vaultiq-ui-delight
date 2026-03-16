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

export default InputField;
