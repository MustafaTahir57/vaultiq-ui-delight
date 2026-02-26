import { motion } from "framer-motion";
import { Rocket, ArrowDownToLine, ArrowUpFromLine, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";

const rounds = [
  { id: "#R-007", token: "VIQX", status: "open" as const, allocation: "500,000", deposited: "$12,400", userDeposit: "$500", claimable: "—" },
  { id: "#R-006", token: "ORBX", status: "claimable" as const, allocation: "1,000,000", deposited: "$28,000", userDeposit: "$1,200", claimable: "8,420 ORBX" },
  { id: "#R-005", token: "NOVA", status: "closed" as const, allocation: "750,000", deposited: "$18,500", userDeposit: "$800", claimable: "—" },
  { id: "#R-004", token: "FLUX", status: "canceled" as const, allocation: "300,000", deposited: "$4,200", userDeposit: "$200", claimable: "—" },
];

const IncubatorSection = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground">Incubator Rounds</h1>
      <p className="text-muted-foreground text-sm mt-1">Participate in token launch rounds for ecosystem projects</p>
    </div>

    <div className="space-y-4">
      {rounds.map((round, i) => (
        <motion.div
          key={round.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="glass-card p-5"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center">
                <Rocket className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-foreground">{round.token}</span>
                  <span className="text-xs text-muted-foreground">{round.id}</span>
                  <StatusBadge status={round.status} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Allocation: {round.allocation} tokens</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Total Deposited</p>
                <p className="font-medium text-foreground">{round.deposited}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Your Deposit</p>
                <p className="font-medium text-primary">{round.userDeposit}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Claimable</p>
                <p className="font-medium text-foreground">{round.claimable}</p>
              </div>

              <div className="flex gap-2">
                {round.status === "open" && (
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                    <ArrowUpFromLine className="h-3.5 w-3.5 mr-1" /> Deposit
                  </Button>
                )}
                {round.status === "claimable" && (
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                    <ArrowDownToLine className="h-3.5 w-3.5 mr-1" /> Claim
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default IncubatorSection;
