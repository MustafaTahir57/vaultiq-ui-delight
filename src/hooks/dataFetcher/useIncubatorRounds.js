import { useReadContract } from "wagmi";
import { IncubatorPool_Address } from "@/constants/contracts";
import { IncubatorPoolABI } from "@/constants/abis";

const useIncubatorRounds = (userAddress) => {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: IncubatorPool_Address,
    abi: IncubatorPoolABI,
    functionName: "getAllRoundsWithUserData",
    args: [userAddress || "0x0000000000000000000000000000000000000000"],
    query: { enabled: true },
  });

  const rounds = data
    ? data.map((r) => ({
        roundId: Number(r.roundId),
        state: Number(r.state), // 0=OPEN 1=CLOSED 2=CLAIMABLE 3=CANCELED
        usdcToken: r.usdcToken,
        saleToken: r.saleToken,
        minDeposit: r.minDeposit,
        maxDeposit: r.maxDeposit,
        totalParticipating: r.totalParticipating,
        totalTokensSupplied: r.totalTokensSupplied,
        userDeposit: r.userDeposit,
        userPendingBalance: r.userPendingBalance,
        tokenClaimed: r.tokenClaimed,
        claimableTokens: r.claimableTokens,
        canDeposit: r.canDeposit,
        canClaim: r.canClaim,
        canRefund: r.canRefund,
        canClaimPending: r.canClaimPending,
      }))
    : [];

  return { rounds, isLoading, isError, refetch };
};

export default useIncubatorRounds;
