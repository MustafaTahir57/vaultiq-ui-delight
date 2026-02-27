import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, Shield, Zap, Loader2 } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

const walletOptions = [
  {
    id: "metamask",
    name: "MetaMask",
    desc: "Connect using browser extension",
    icon: () => (
      <svg viewBox="0 0 40 40" className="h-8 w-8" fill="none">
        <path d="M32.96 4L21.08 13.02l2.2-5.2L32.96 4z" fill="#E17726"/>
        <path d="M7.04 4l11.78 9.1-2.1-5.28L7.04 4zM28.8 27.14l-3.16 4.84 6.76 1.86 1.94-6.58-5.54-.12zM5.68 27.26l1.92 6.58 6.76-1.86-3.16-4.84-5.52.12z" fill="#E27625"/>
        <path d="M14.02 17.58l-1.88 2.84 6.7.3-.24-7.2-4.58 4.06zM25.98 17.58l-4.64-4.14-.16 7.28 6.68-.3-1.88-2.84zM14.36 32l4.04-1.98-3.5-2.72-.54 4.7zM21.6 30.02l4.04 1.98-.54-4.7-3.5 2.72z" fill="#E27625"/>
        <path d="M25.64 32l-4.04-1.98.32 2.64-.04 1.12 3.76-1.78zM14.36 32l3.76 1.78-.02-1.12.3-2.64-4.04 1.98z" fill="#D5BFB2"/>
        <path d="M18.22 25.68l-3.38-.98 2.38-1.1.98 2.08zM21.78 25.68l1-2.08 2.4 1.1-3.4.98z" fill="#233447"/>
        <path d="M14.36 32l.56-4.84-3.72.12 3.16 4.72zM25.08 27.16l.56 4.84 3.16-4.72-3.72-.12zM27.86 20.42l-6.68.3.62 3.46 1-2.08 2.4 1.1 2.66-2.78zM14.84 23.2l2.4-1.1.98 2.08.62-3.46-6.7-.3 2.7 2.78z" fill="#CC6228"/>
        <path d="M12.14 20.42l2.8 5.46-.1-2.68-2.7-2.78zM25.2 23.2l-.12 2.68 2.78-5.46-2.66 2.78zM18.84 20.72l-.62 3.46.78 4.02.18-5.3-.34-2.18zM21.18 20.72l-.32 2.16.16 5.32.78-4.02-.62-3.46z" fill="#E27525"/>
        <path d="M21.8 25.68l-.78 4.02.56.38 3.5-2.72.12-2.68-3.4.98zM14.84 24.68l.1 2.68 3.5 2.72.56-.38-.78-4.02-3.38-1z" fill="#F5841F"/>
        <path d="M21.84 33.78l.04-1.12-.3-.26h-3.16l-.28.26.02 1.12-3.76-1.78 1.32 1.08 2.66 1.84h3.22l2.68-1.84 1.3-1.08-3.74 1.78z" fill="#C0AC9D"/>
        <path d="M21.6 30.02l-.56-.38h-2.08l-.56.38-.3 2.64.28-.26h3.16l.3.26-.24-2.64z" fill="#161616"/>
        <path d="M33.52 13.62l1-4.84L32.96 4l-11.36 8.44 4.38 3.7 6.18 1.8 1.36-1.6-.6-.42.94-.86-.72-.56.94-.72-.62-.46zM5.48 8.78l1.02 4.84-.66.48.96.72-.72.56.94.86-.6.42 1.36 1.6 6.18-1.8 4.38-3.7L7.04 4 5.48 8.78z" fill="#763E1A"/>
        <path d="M32.16 17.94l-6.18-1.8 1.88 2.84-2.78 5.46 3.66-.04h5.54l-2.12-6.46zM14.02 16.14l-6.18 1.8-2.06 6.46h5.52l3.66.04-2.8-5.46 1.86-2.84zM21.18 20.72l.4-6.86 1.8-4.04h-6.74l1.78 4.04.42 6.86.16 2.2.02 5.28h2.08l.02-5.28.06-2.2z" fill="#F5841F"/>
      </svg>
    ),
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    desc: "Scan QR code with mobile wallet",
    icon: () => (
      <svg viewBox="0 0 40 40" className="h-8 w-8" fill="none">
        <rect width="40" height="40" rx="8" fill="#3B99FC"/>
        <path d="M12.2 15.6c4.3-4.2 11.3-4.2 15.6 0l.5.5c.2.2.2.6 0 .8l-1.7 1.7c-.1.1-.3.1-.4 0l-.7-.7c-3-2.9-7.8-2.9-10.8 0l-.8.7c-.1.1-.3.1-.4 0l-1.7-1.7c-.2-.2-.2-.6 0-.8l.4-.5zm19.3 3.6 1.5 1.5c.2.2.2.6 0 .8l-6.9 6.7c-.2.2-.6.2-.8 0l-4.9-4.8c-.05-.05-.15-.05-.2 0l-4.9 4.8c-.2.2-.6.2-.8 0l-6.9-6.7c-.2-.2-.2-.6 0-.8l1.5-1.5c.2-.2.6-.2.8 0l4.9 4.8c.05.05.15.05.2 0l4.9-4.8c.2-.2.6-.2.8 0l4.9 4.8c.05.05.15.05.2 0l4.9-4.8c.2-.2.6-.2.8 0z" fill="#fff"/>
      </svg>
    ),
  },
];

const features = [
  { icon: Shield, label: "Non-custodial" },
  { icon: Zap, label: "Instant access" },
];

const ConnectWalletScreen = () => {
  const { connect, isConnecting } = useWallet();
  const [connectingId, setConnectingId] = useState(null);

  const handleConnect = (walletId) => {
    setConnectingId(walletId);
    connect();
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center"
          >
            <Wallet className="h-8 w-8 text-primary" />
          </motion.div>

          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Connect Your Wallet</h1>
            <p className="text-muted-foreground text-sm mt-2">
              Choose your preferred wallet to access the VaultIQ dashboard.
            </p>
          </div>

          <div className="space-y-3">
            {walletOptions.map((wallet, i) => (
              <motion.button
                key={wallet.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                onClick={() => handleConnect(wallet.id)}
                disabled={isConnecting}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/60 border border-border/30 hover:border-primary/30 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="shrink-0">
                  <wallet.icon />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{wallet.name}</p>
                  <p className="text-xs text-muted-foreground">{wallet.desc}</p>
                </div>
                {isConnecting && connectingId === wallet.id ? (
                  <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
                ) : (
                  <div className="w-4" />
                )}
              </motion.button>
            ))}
          </div>

          <div className="flex gap-4 justify-center pt-2">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <f.icon className="h-3.5 w-3.5 text-primary" />
                {f.label}
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            By connecting, you agree to VaultIQ's terms of service.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ConnectWalletScreen;
