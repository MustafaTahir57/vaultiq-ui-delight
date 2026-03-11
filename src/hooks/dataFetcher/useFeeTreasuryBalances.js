import { useReadContracts } from "wagmi";
import { FeeTreasuryABI } from "@/constants/abis";
import { FeeTreasury_Address } from "@/constants/contracts";

/**
 * Reads the FeeTreasury USDC and BTCB balances (protocol-wide).
 */
const useFeeTreasuryBalances = () => {
  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts: [
      {
        address: FeeTreasury_Address,
        abi: FeeTreasuryABI,
        functionName: "usdcBalance",
      },
      {
        address: FeeTreasury_Address,
        abi: FeeTreasuryABI,
        functionName: "btcbBalance",
      },
    ],
  });

  const usdcBalance = data?.[0]?.status === "success" ? data[0].result : BigInt(0);
  const btcbBalance = data?.[1]?.status === "success" ? data[1].result : BigInt(0);

  return { usdcBalance, btcbBalance, isLoading, isError, refetch };
};

export default useFeeTreasuryBalances;
