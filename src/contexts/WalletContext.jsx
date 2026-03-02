import { createContext, useContext, useState, useCallback } from "react";

const WalletContext = createContext(null);

const mockAddress = "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12";
const BRANCH_MANAGER_ADDRESSES = [mockAddress.toLowerCase()];

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [address, setAddress] = useState(null);
  const [justConnected, setJustConnected] = useState(false);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setAddress(mockAddress);
    setIsConnected(true);
    setJustConnected(true);
    setIsConnecting(false);
  }, []);

  const clearJustConnected = useCallback(() => {
    setJustConnected(false);
  }, []);

  const activate = useCallback(() => {
    setIsActivated(true);
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setIsConnected(false);
    setIsActivated(false);
  }, []);

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
        connect,
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
