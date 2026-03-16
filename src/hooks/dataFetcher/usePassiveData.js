import { useReadContract } from "wagmi";
import { BranchExtensionABI } from "@/constants/abis";
import { formatUnits } from "viem";

const usePassiveData = (branchAddress, userAddress) => {
  const { data, isLoading, isError } = useReadContract({
    address: branchAddress,
    abi: BranchExtensionABI,
    functionName: "getPassiveData",
    args: [userAddress],
    query: {
      enabled: !!branchAddress && !!userAddress,
    },
  });

  const lastWithdrawalTimestamp = data?.lastWithdrawalTimestamp
    ? Number(data.lastWithdrawalTimestamp)
    : null;

  const lastWithdrawal = lastWithdrawalTimestamp
    ? new Date(lastWithdrawalTimestamp * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  const totalWithdrawn = data?.totalWithdrawn
    ? `$${parseFloat(formatUnits(data.totalWithdrawn, 18)).toLocaleString()}`
    : "$0.00";

  const isQualified = data?.isQualified ?? false;

  return { lastWithdrawal, totalWithdrawn, isLoading, isError , isQualified };
};

export default usePassiveData;
