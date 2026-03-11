import { useReadContract } from "wagmi";
import { VaultIQMainABI } from "@/constants/abis";
import { VaultIQMain_Address } from "@/constants/contracts";

const useRegisteredBranches = () => {
  const { data: branches, isLoading, isError } = useReadContract({
    address: VaultIQMain_Address,
    abi: VaultIQMainABI,
    functionName: "getRegisteredBranches",
  });

  return { branches: branches || [], isLoading, isError };
};

export default useRegisteredBranches;
