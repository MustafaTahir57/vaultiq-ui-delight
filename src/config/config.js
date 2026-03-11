import { createConfig, http, fallback } from 'wagmi'
import { bsc, bscTestnet } from 'wagmi/chains'
import { metaMask, walletConnect } from 'wagmi/connectors'
import {ACTIVE_CHAIN_ID} from "@/constants/contracts.js"

const chains = {
  56: bsc,
  97: bscTestnet,
};

const activeChain = chains[ACTIVE_CHAIN_ID];

const transports = {
  56: {
    [bsc.id]: fallback([
    //   http(`https://bnb-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_RPC_KEY}`),
      http('https://bsc-dataseed2.binance.org'),
      http('https://bsc-dataseed3.binance.org'),
      http('https://bsc-dataseed4.binance.org'),
      http('https://bsc-rpc.publicnode.com'),
      http(),
    ]),
  },
  97: {
    [bscTestnet.id]: fallback([
    //   http(`https://bnb-testnet.g.alchemy.com/v2/${import.meta.env.VITE_RPC_KEY}`),
      http('https://data-seed-prebsc-2-s1.binance.org:8545'),
      http('https://data-seed-prebsc-1-s2.binance.org:8545'),
      http('https://data-seed-prebsc-2-s2.binance.org:8545'),
      http('https://bsc-testnet-rpc.publicnode.com'),
      http(),
    ]),
  },
};

export const config = createConfig({
  chains: [activeChain],
  connectors: [
    metaMask(),
    walletConnect({ projectId: "18e5dbfec5539cf4cd18f5ecdf94eb6a" })
  ],
  transports: transports[ACTIVE_CHAIN_ID],
})
