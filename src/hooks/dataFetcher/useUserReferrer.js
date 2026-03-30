import { useReadContract } from "wagmi";
import { VaultIQMainABI } from "@/constants/abis";
import { VaultIQMain_Address } from "@/constants/contracts";

const useUserReferrer = (userAddress) => {
  const { data: refAddress, isLoading, isError } = useReadContract({
    address: VaultIQMain_Address,
    abi: VaultIQMainABI,
    functionName: "userReferrer",
    args: [userAddress],
    query: {
      enabled: !!userAddress,
    },
  });

  return { referrerAddress: refAddress || null, isLoading, isError };
};

export default useUserReferrer;
