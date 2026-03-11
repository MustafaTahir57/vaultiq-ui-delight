import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const WalletContext = createContext(null);

// Add branch manager addresses here (lowercase)
const BRANCH_MANAGER_ADDRESSES = [];

export const WalletProvider = ({ children }) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  const [justConnected, setJustConnected] = useState(false);
  const [wasConnected, setWasConnected] = useState(false);

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

  const activate = useCallback(() => {
    setIsActivated(true);
  }, []);

  const disconnect = useCallback(() => {
    wagmiDisconnect();
    setIsActivated(false);
    setJustConnected(false);
    setWasConnected(false);
  }, [wagmiDisconnect]);

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  const isBranchManager = address
    ? BRANCH_MANAGER_ADDRESSES.includes(address.toLowerCase())
    : false;

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isConnecting,
        isActivated,
        isBranchManager,
        address,
        shortAddress,
        justConnected,
        connectors,
        connect: connectWallet,
        activate,
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
