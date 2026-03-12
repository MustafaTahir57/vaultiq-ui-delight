import { motion } from "framer-motion";
import { Rocket, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { coreConfigFields, expiryConfigFields } from "./constants";

const DeployBranchTab = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 border-primary/20">
      <div className="flex items-start gap-3">
        <Rocket className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div>
          <h3 className="font-display font-semibold text-foreground mb-1">Deploy a New Branch</h3>
          <p className="text-sm text-muted-foreground">
            Any user can deploy a new branch if <code className="text-primary text-xs">openDeployment = true</code>, otherwise only DEPLOYER_ROLE holders.
            After deployment, you'll receive your branch proxy address.
          </p>
        </div>
      </div>
    </motion.div>

    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
      <h3 className="font-display font-semibold text-foreground mb-5">Branch Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Branch Name", placeholder: "e.g. Alpha Branch", type: "text" },
          { label: "Branch Owner", placeholder: "Connected wallet (auto-filled)", type: "address" },
          { label: "USDC Token Address", placeholder: "Protocol USDT address", type: "address" },
          { label: "Branch Wallet", placeholder: "Commission wallet (3%)", type: "address" },
          { label: "Founders Wallet", placeholder: "Founders share (2%)", type: "address" },
        ].map((field) => (
          <div key={field.label} className={field.label === "Branch Name" ? "sm:col-span-2" : ""}>
            <label className="text-xs text-muted-foreground mb-1.5 block">{field.label}</label>
            <input
              disabled
              type="text"
              placeholder={field.placeholder}
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 font-mono disabled:opacity-60"
            />
          </div>
        ))}
      </div>
    </motion.div>

    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
      <h3 className="font-display font-semibold text-foreground mb-1">CoreConfig</h3>
      <p className="text-xs text-muted-foreground mb-5">All values in BPS (basis points). Must sum to 10,000.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {coreConfigFields.map((f) => (
          <div key={f.field} className="bg-secondary/50 border border-border rounded-lg p-3">
            <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
            <input
              disabled
              type="text"
              placeholder={f.default}
              className="w-full bg-transparent text-sm text-foreground font-mono placeholder:text-muted-foreground/60 disabled:opacity-60 outline-none"
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Percent className="h-3.5 w-3.5" />
        Total must equal 10,000 BPS (100%)
      </div>
    </motion.div>

    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
      <h3 className="font-display font-semibold text-foreground mb-1">ExpiryConfig</h3>
      <p className="text-xs text-muted-foreground mb-5">Expiry principal split. Must sum to 10,000 BPS.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {expiryConfigFields.map((f) => (
          <div key={f.field} className="bg-secondary/50 border border-border rounded-lg p-3">
            <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
            <input
              disabled
              type="text"
              placeholder={f.default}
              className="w-full bg-transparent text-sm text-foreground font-mono placeholder:text-muted-foreground/60 disabled:opacity-60 outline-none"
            />
          </div>
        ))}
      </div>
    </motion.div>

    <Button disabled className="w-full py-6 text-base opacity-60 cursor-not-allowed">
      <Rocket className="h-5 w-5 mr-2" />
      Deploy Branch — Coming Soon
    </Button>
  </div>
);

export default DeployBranchTab;
