// ============================================================
// ACTIVE CHAIN CONFIGURATION
// Change this value to switch between testnet (97) and mainnet (56)
// ============================================================

export const ACTIVE_CHAIN_ID = Number(import.meta.env.VITE_ACTIVE_CHAIN_ID || 97); // 56 = BSC Mainnet, 97 = BSC Testnet

// Address maps per chain
const contractAddresses = {
  // BSC Testnet (97)
  97: {
    VaultIQMain: "0x83B0EfB04df358460f4Ff96D3EbF661adA104d77",
    Branch: "0x39A636eA908636Bc39Ae4122730B1b30005A0994",
    BranchFactory: "0xf6f3C0187412aE3D500BA66587f130c1026598c7",
    IncubatorPool: "0xb8619c2668e3B8F4C2A5db482FD2B2fE3F156E58",
    FeeTreasury: "0x6fF250Ac6e316618d101F8b8023D1b0777Fd2588",
    LeadershipPool: "0xEDA1206d288aC35275061852521F698cf7110cb6",
    MiningRevenueDistributor: "0x2c149A52555348Bb4B63d1122c8B81E036367f44",
    HashTreasury: "0xB8eE2F10452F24e5380bf23CE7d45bdF51B43C9e",
    USDT: "0x3f34F38c202A73fEFeDef2C202F36D5a28dA271C",
    MockBTCB: "0x89e96c66eF584Da6194DF78bf34Cbf39d367570f",
  },
  // BSC Mainnet (56)
  56: {
    VaultIQMain: "0x0000000000000000000000000000000000000000",
    Branch: "0x0000000000000000000000000000000000000000",
    BranchFactory: "0x0000000000000000000000000000000000000000",
    IncubatorPool: "0x0000000000000000000000000000000000000000",
    FeeTreasury: "0x0000000000000000000000000000000000000000",
    LeadershipPool: "0x0000000000000000000000000000000000000000",
    MiningRevenueDistributor: "0x0000000000000000000000000000000000000000",
    HashTreasury: "0x0000000000000000000000000000000000000000",
    USDT: "0x0000000000000000000000000000000000000000",
    MockBTCB: "0x0000000000000000000000000000000000000000",
  },
};

const active = contractAddresses[ACTIVE_CHAIN_ID];

// Token Contracts
export const USDT_Address = active.USDT;
export const MockBTCB_Address = active.MockBTCB;

// Core System Contracts
export const VaultIQMain_Address = active.VaultIQMain;
export const Branch_Address = active.Branch;
export const BranchFactory_Address = active.BranchFactory;
export const IncubatorPool_Address = active.IncubatorPool;
export const FeeTreasury_Address = active.FeeTreasury;
export const LeadershipPool_Address = active.LeadershipPool;
export const MiningRevenueDistributor_Address = active.MiningRevenueDistributor;
export const HashTreasury_Address = active.HashTreasury;

export default contractAddresses;
