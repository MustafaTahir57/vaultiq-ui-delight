import { useReadContract } from "wagmi";
import { BranchABI } from "@/constants/abis";
import { Branch_Address } from "@/constants/contracts";

const POOL_STATE_NAMES = {
  1: "pool1State",
  2: "pool2State",
  3: "pool3State",
  4: "pool4State",
};

const POOL_RULE_NAMES = {
  1: "pool1Rule",
  2: "pool2Rule",
  3: "pool3Rule",
  4: "pool4Rule",
};

const usePoolCard = (poolId, userAddress, branchAddress) => {
  const contractAddress = branchAddress || Branch_Address;

  // Pool pending balance
  const { data: pendingBalance, isLoading: pendingLoading } = useReadContract({
    address: contractAddress,
    abi: BranchABI,
    functionName: "previewPoolPending",
    args: [poolId, userAddress],
    query: { enabled: !!userAddress && !!poolId },
  });

  // Qualification status
  const { data: isQualified, isLoading: qualifiedLoading } = useReadContract({
    address: contractAddress,
    abi: BranchABI,
    functionName: "isPoolQualifiedMember",
    args: [poolId, userAddress],
    query: { enabled: !!userAddress && !!poolId },
  });

  // Pool state (qualifiedCount)
  const { data: poolState, isLoading: stateLoading } = useReadContract({
    address: contractAddress,
    abi: BranchABI,
    functionName: POOL_STATE_NAMES[poolId],
    query: { enabled: !!poolId },
  });

  // Pool rule (salesRequirement / threshold)
  const { data: poolRule, isLoading: ruleLoading } = useReadContract({
    address: contractAddress,
    abi: BranchABI,
    functionName: POOL_RULE_NAMES[poolId],
    query: { enabled: !!poolId },
  });

  return {
    pendingBalance: pendingBalance ?? 0n,
    isQualified: isQualified ?? false,
    qualifiedCount: poolState ? Number(poolState[0]) : 0,
    threshold: poolRule ? poolRule[0] : 0n,
    isLoading: pendingLoading || qualifiedLoading || stateLoading || ruleLoading,
  };
};

export default usePoolCard;
