import { useState, useEffect, useCallback } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BranchFactoryABI, VaultIQMainABI } from "@/constants/abis";
import { BranchFactory_Address, VaultIQMain_Address, USDT_Address } from "@/constants/contracts";
import { keccak256, toBytes } from "viem";
import { toast } from "sonner";

const useDeployBranch = (userAddress) => {
  const [deployedBranchAddress, setDeployedBranchAddress] = useState(null);
  const [nameToCheck, setNameToCheck] = useState(null);

  // Pre-check: is open deployment enabled?
  const { data: isOpenDeployment, isLoading: checkingOpen } = useReadContract({
    address: BranchFactory_Address,
    abi: BranchFactoryABI,
    functionName: "openDeployment",
  });

  // Branch name uniqueness check (on-demand via state)
  const { data: nameUsedResult, isFetching: nameCheckFetching } = useReadContract({
    address: VaultIQMain_Address,
    abi: VaultIQMainABI,
    functionName: "branchNameUsed",
    args: nameToCheck ? [keccak256(toBytes(nameToCheck))] : undefined,
    query: { enabled: !!nameToCheck },
  });

  const checkBranchName = useCallback(async (name) => {
    if (!name) return false;
    setNameToCheck(name);
    // This is a fire-and-forget trigger; the result is read reactively
    // For imperative checks in deployBranch, we do a one-off read below
    return false;
  }, []);

  const { writeContract, data: txHash, isPending: isDeploying, error: writeError, reset: resetWrite } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  // Fetch branches after tx confirms
  const { data: branchList } = useReadContract({
    address: BranchFactory_Address,
    abi: BranchFactoryABI,
    functionName: "getBranchesOf",
    args: [userAddress],
    query: { enabled: !!isConfirmed && !!userAddress },
  });

  // When confirmed and branch list arrives, set deployed address
  useEffect(() => {
    if (isConfirmed && branchList && branchList.length > 0 && !deployedBranchAddress) {
      const newBranch = branchList[branchList.length - 1];
      setDeployedBranchAddress(newBranch);
      toast.success("Branch deployed successfully!");
    }
  }, [isConfirmed, branchList, deployedBranchAddress]);

  const deployBranch = async ({ branchName, branchWallet, foundersWallet, coreConfig, expiryConfig }) => {
    if (!userAddress) {
      toast.error("Wallet not connected");
      return;
    }

    // Imperative name check using the reactive hook result
    if (nameToCheck === branchName && nameUsedResult === true) {
      toast.error("Branch name is already taken");
      return;
    }

    const core = [
      BigInt(coreConfig.liquidityAllocation),
      BigInt(coreConfig.directBonusPercent),
      BigInt(coreConfig.branchCommissionPercent),
      BigInt(coreConfig.feePercent),
      BigInt(coreConfig.foundersPercent),
      BigInt(coreConfig.pool1Percent),
      BigInt(coreConfig.pool2Percent),
      BigInt(coreConfig.pool3Percent),
      BigInt(coreConfig.pool4Percent),
      BigInt(coreConfig.passiveIncomePercent),
      BigInt(coreConfig.cancellationPercent),
    ];

    const expiry = [
      BigInt(expiryConfig.feePercent),
      BigInt(expiryConfig.branchPercent),
      BigInt(expiryConfig.passiveIncomePercent),
    ];

    writeContract(
      {
        address: BranchFactory_Address,
        abi: BranchFactoryABI,
        functionName: "deployBranch",
        args: [branchName, userAddress, USDT_Address, branchWallet, foundersWallet, core, expiry],
      },
      {
        onSuccess: () => {
          toast.info("Transaction submitted, waiting for confirmation...");
        },
        onError: (err) => {
          toast.error(err?.shortMessage || err?.message || "Deployment failed");
        },
      }
    );
  };

  const resetDeploy = useCallback(() => {
    setDeployedBranchAddress(null);
    resetWrite();
  }, [resetWrite]);

  return {
    isOpenDeployment: !!isOpenDeployment,
    checkingOpen,
    deployBranch,
    isDeploying: isDeploying || isConfirming,
    isSuccess: isConfirmed,
    deployedBranchAddress,
    writeError,
    checkBranchName,
    nameUsedResult,
    nameCheckFetching,
    resetDeploy,
  };
};

export default useDeployBranch;
