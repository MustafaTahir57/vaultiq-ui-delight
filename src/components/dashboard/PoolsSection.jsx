import { Layers } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import PoolCard from "./PoolCard";

const POOL_IDS = [1, 2, 3, 4];

const PoolsSection = () => {
  const { address, userBranchAddress } = useWallet();
  const branchAddress = userBranchAddress;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Pools</h1>
        <p className="text-muted-foreground text-sm mt-1">Weekly distribution pools & qualification status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {POOL_IDS.map((poolId, i) => (
          <PoolCard
            key={poolId}
            poolId={poolId}
            userAddress={address}
            branchAddress={branchAddress}
            index={i}
          />
        ))}
      </div>
    </div>
  );
};

export default PoolsSection;
