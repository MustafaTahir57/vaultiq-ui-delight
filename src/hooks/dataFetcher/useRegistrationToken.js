import { useReadContract } from "wagmi";
import { VaultIQMainABI } from "@/constants/abis";
import { VaultIQMain_Address } from "@/constants/contracts";

const useRegistrationToken = () => {
  const { data: tokenAddress, isLoading, isError } = useReadContract({
    address: VaultIQMain_Address,
    abi: VaultIQMainABI,
    functionName: "registrationToken",
  });

  return { tokenAddress, isLoading, isError };
};

export default useRegistrationToken;
