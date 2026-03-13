import { useReadContract } from "wagmi";
import { ERC20ABI } from "@/constants/erc20Abi";

const useTokenAllowance = (tokenAddress, ownerAddress, spenderAddress) => {
  const { data: allowance, isLoading, refetch } = useReadContract({
    address: tokenAddress,
    abi: ERC20ABI,
    functionName: "allowance",
    args: [ownerAddress, spenderAddress],
    query: {
      enabled: !!tokenAddress && !!ownerAddress && !!spenderAddress,
    },
  });

  return { allowance, isLoading, refetch };
};

export default useTokenAllowance;
