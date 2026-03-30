import { useReadContract } from "wagmi";
import { VaultIQMainABI } from "@/constants/abis";
import { VaultIQMain_Address } from "@/constants/contracts";

const useVaultIQOwner = () => {
  const { data: owner, isLoading } = useReadContract({
    address: VaultIQMain_Address,
    abi: VaultIQMainABI,
    functionName: "owner",
  });

  return { owner: owner || null, isLoading };
};

export default useVaultIQOwner;
