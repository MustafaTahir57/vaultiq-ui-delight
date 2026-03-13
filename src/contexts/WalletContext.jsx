import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { ACTIVE_CHAIN_ID } from "@/constants/contracts";
import { toast } from "sonner";
import useUserBranches from "@/hooks/dataFetcher/useUserBranches";
import useUserBranch from "@/hooks/dataFetcher/useUserBranch";

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { userBranches, isBranchManager, isLoading: branchesLoading } = useUserBranches(address);

  const [justConnected, setJustConnected] = useState(false);
  const [wasConnected, setWasConnected] = useState(false);

  const isWrongChain = isConnected && chain?.id !== ACTIVE_CHAIN_ID;

  // Auto-switch chain when on wrong network
  useEffect(() => {
    if (isWrongChain && switchChain) {
      toast.info("Switching to the correct network...");
      switchChain(
        { chainId: ACTIVE_CHAIN_ID },
        {
          onSuccess: () => toast.success("Switched to the correct network!"),
          onError: (err) => toast.error(`Failed to switch network: ${err.shortMessage || err.message}`),
        }
      );
    }
  }, [isWrongChain, switchChain]);

  // Detect fresh connection
  useEffect(() => {
    if (isConnected && !wasConnected) {
      setJustConnected(true);
    }
    setWasConnected(isConnected);
  }, [isConnected, wasConnected]);

  const connectWallet = useCallback((connectorId) => {
    const connector = connectors.find((c) =>
      c.id.toLowerCase().includes(connectorId.toLowerCase()) ||
      c.name.toLowerCase().includes(connectorId.toLowerCase())
    ) || connectors[0];
    if (connector) {
      connect({ connector });
    }
  }, [connect, connectors]);

  const clearJustConnected = useCallback(() => {
    setJustConnected(false);
  }, []);

  const disconnect = useCallback(() => {
    wagmiDisconnect();
    setJustConnected(false);
    setWasConnected(false);
  }, [wagmiDisconnect]);

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isConnecting,
        isWrongChain,
        isBranchManager,
        branchesLoading,
        userBranches,
        address,
        chain,
        shortAddress,
        justConnected,
        connectors,
        connect: connectWallet,
        disconnect,
        clearJustConnected,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
};
