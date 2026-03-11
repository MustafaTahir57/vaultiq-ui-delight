import { useReadContract } from "wagmi";
import { ERC20ABI } from "@/constants/erc20Abi";

const useTokenBalance = (tokenAddress, userAddress) => {
  const { data: balance, isLoading, isError, refetch } = useReadContract({
    address: tokenAddress,
    abi: ERC20ABI,
    functionName: "balanceOf",
    args: [userAddress],
    query: {
      enabled: !!tokenAddress && !!userAddress,
    },
  });

  return { balance, isLoading, isError, refetch };
};

export default useTokenBalance;
