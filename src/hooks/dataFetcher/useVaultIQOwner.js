import { useReadContract } from "wagmi";
import { VaultIQMainABI } from "@/constants/abis";
import { VaultIQMain_Address } from "@/constants/contracts";

const useVaultIQOwner = (address) => {
  const { data: DEFAULT_ADMIN_ROLE } = useReadContract({
    address: VaultIQMain_Address,
    abi: VaultIQMainABI,
    functionName: "DEFAULT_ADMIN_ROLE",
  });

  const { data: isOwner, isLoading } = useReadContract({
    address: VaultIQMain_Address,
    abi: VaultIQMainABI,
    functionName: "hasRole",
    args: [DEFAULT_ADMIN_ROLE, address],
    query: {
      enabled: !!DEFAULT_ADMIN_ROLE && !!address, //wait for both
    },
  });

  return { isVaultIQOwner: isOwner ?? null, isLoading };
};

export default useVaultIQOwner;