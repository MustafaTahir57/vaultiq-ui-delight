import { useReadContract } from "wagmi";
import { VaultIQMainABI } from "@/constants/abis";
import { VaultIQMain_Address } from "@/constants/contracts";

const useRegistrationFee = () => {
  const { data: fee, isLoading, isError } = useReadContract({
    address: VaultIQMain_Address,
    abi: VaultIQMainABI,
    functionName: "registrationFee",
  });

  return { fee, isLoading, isError };
};

export default useRegistrationFee;
