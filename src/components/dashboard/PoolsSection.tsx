import { motion } from "framer-motion";
import { Layers, Lock, Unlock, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const pools = [
  { name: "Pool 1", distribution: "$2,400", members: 45, threshold: "$500", unlocked: true, fill: 82 },
  { name: "Pool 2", distribution: "$4,800", members: 32, threshold: "$1,000", unlocked: true, fill: 64 },
  { name: "Pool 3", distribution: "$8,200", members: 18, threshold: "$2,500", unlocked: false, fill: 38 },
  { name: "Pool 4", distribution: "$15,000", members: 8, threshold: "$5,000", unlocked: false, fill: 15 },
];

const PoolsSection = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground">Pools</h1>
      <p className="text-muted-foreground text-sm mt-1">Weekly distribution pools & qualification status</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {pools.map((pool, i) => (
        <motion.div
          key={pool.name}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card-hover p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${pool.unlocked ? "bg-primary/10" : "bg-secondary"}`}>
                {pool.unlocked ? <Unlock className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">{pool.name}</h3>
                <span className={`text-xs ${pool.unlocked ? "text-success" : "text-muted-foreground"}`}>
                  {pool.unlocked ? "Unlocked" : "Locked"}
                </span>
              </div>
            </div>
            <span className="text-lg font-display font-bold text-foreground">{pool.distribution}</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>Qualification progress</span>
                <span>{pool.fill}%</span>
              </div>
              <Progress value={pool.fill} className="h-2 bg-secondary [&>div]:bg-primary" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {pool.members} members</span>
              <span className="text-muted-foreground">Threshold: {pool.threshold}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default PoolsSection;
