import { Layers } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { Branch_Address } from "@/constants/contracts";
import PoolCard from "./PoolCard";

const POOL_IDS = [1, 2, 3, 4];

const PoolsSection = () => {
  const { address } = useWallet();
  // TODO: replace Branch_Address with user's actual branch once the contract function is available
  const branchAddress = Branch_Address;

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
