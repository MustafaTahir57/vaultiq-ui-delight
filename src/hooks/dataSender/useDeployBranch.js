import { useState } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { BranchFactoryABI, VaultIQMainABI } from "@/constants/abis";
import { BranchFactory_Address, VaultIQMain_Address, USDT_Address } from "@/constants/contracts";
import { keccak256, toBytes } from "viem";
import { toast } from "sonner";

const useDeployBranch = (userAddress) => {
  const [deployedBranchAddress, setDeployedBranchAddress] = useState(null);
  const publicClient = usePublicClient();

  // Pre-check: is open deployment enabled?
  const { data: isOpenDeployment, isLoading: checkingOpen } = useReadContract({
    address: BranchFactory_Address,
    abi: BranchFactoryABI,
    functionName: "openDeployment",
  });

  // Branch name uniqueness check
  const checkBranchName = async (name) => {
    if (!name || !publicClient) return false;
    try {
      const nameHash = keccak256(toBytes(name));
      const used = await publicClient.readContract({
        address: VaultIQMain_Address,
        abi: VaultIQMainABI,
        functionName: "branchNameUsed",
        args: [nameHash],
      });
      return used; // true = already taken
    } catch {
      return false;
    }
  };

  const { writeContract, data: txHash, isPending: isDeploying, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const deployBranch = async ({ branchName, branchWallet, foundersWallet, coreConfig, expiryConfig }) => {
    if (!userAddress) {
      toast.error("Wallet not connected");
      return;
    }

    const nameUsed = await checkBranchName(branchName);
    if (nameUsed) {
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

    try {
      writeContract(
        {
          address: BranchFactory_Address,
          abi: BranchFactoryABI,
          functionName: "deployBranch",
          args: [branchName, userAddress, USDT_Address, branchWallet, foundersWallet, core, expiry],
        },
        {
          onSuccess: async (hash) => {
            toast.info("Transaction submitted, waiting for confirmation...");
            try {
              await publicClient.waitForTransactionReceipt({ hash });
              const branches = await publicClient.readContract({
                address: BranchFactory_Address,
                abi: BranchFactoryABI,
                functionName: "getBranchesOf",
                args: [userAddress],
              });
              const newBranch = branches[branches.length - 1];
              setDeployedBranchAddress(newBranch);
              toast.success("Branch deployed successfully!");
            } catch (err) {
              toast.error("Failed to fetch deployed branch address");
            }
          },
          onError: (err) => {
            toast.error(err?.shortMessage || err?.message || "Deployment failed");
          },
        }
      );
    } catch (err) {
      toast.error(err?.shortMessage || err?.message || "Deployment failed");
    }
  };

  return {
    isOpenDeployment: !!isOpenDeployment,
    checkingOpen,
    deployBranch,
    isDeploying: isDeploying || isConfirming,
    isSuccess,
    deployedBranchAddress,
    writeError,
    checkBranchName,
    resetDeploy: () => setDeployedBranchAddress(null),
  };
};

export default useDeployBranch;
