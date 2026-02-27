import { createContext, useContext, useState, useCallback } from "react";

const WalletContext = createContext(null);

const mockAddress = "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12";

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState(null);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    // Simulate connection delay
    await new Promise((r) => setTimeout(r, 1500));
    setAddress(mockAddress);
    setIsConnected(true);
    setIsConnecting(false);
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setIsConnected(false);
  }, []);

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  return (
    <WalletContext.Provider value={{ isConnected, isConnecting, address, shortAddress, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
};
