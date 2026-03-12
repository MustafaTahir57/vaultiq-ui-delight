import { useState, useCallback } from "react";
import { useReadContract } from "wagmi";
import { VaultIQMainABI } from "@/constants/abis";
import { VaultIQMain_Address } from "@/constants/contracts";
import { keccak256, toBytes } from "viem";

const useBranchNameUsed = () => {
  const [nameToCheck, setNameToCheck] = useState(null);

  const { data: nameUsedResult, isFetching: nameCheckFetching } = useReadContract({
    address: VaultIQMain_Address,
    abi: VaultIQMainABI,
    functionName: "branchNameUsed",
    args: nameToCheck ? [keccak256(toBytes(nameToCheck))] : undefined,
    query: { enabled: !!nameToCheck },
  });

  const checkBranchName = useCallback((name) => {
    if (!name) return;
    setNameToCheck(name);
  }, []);

  return { nameUsedResult, nameCheckFetching, checkBranchName, nameToCheck };
};

export default useBranchNameUsed;
