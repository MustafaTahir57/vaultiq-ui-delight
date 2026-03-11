import { useReadContract } from "wagmi";
import { VaultIQMainABI } from "@/constants/abis";
import { VaultIQMain_Address } from "@/constants/contracts";

const useRegistrationStatus = (userAddress) => {
  const { data: isRegistered, isLoading, isError, refetch } = useReadContract({
    address: VaultIQMain_Address,
    abi: VaultIQMainABI,
    functionName: "isRegisteredUser",
    args: [userAddress],
    query: {
      enabled: !!userAddress,
    },
  });

  return { isRegistered: !!isRegistered, isLoading, isError, refetch };
};

export default useRegistrationStatus;
