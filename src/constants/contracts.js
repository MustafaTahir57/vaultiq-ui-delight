export const ACTIVE_CHAIN_ID = Number(import.meta.env.VITE_ACTIVE_CHAIN_ID || 97);

const contractAddresses = {
  // BSC Testnet (97)
  97: {
    VaultIQMain: "0x8556B2aA5091b806B1091E59A1F8F9a9A7Bb6102",
    Branch: "0xb6f98F83A658428F1642d4DAA69100E363E6C600",
    BranchFactory: "0x5f0D47fb2898b511e01857E01D5586f07da45D29",
    IncubatorPool: "0xEb7dE9775847c711936eE1de2Ef0C526EcDa8028",
    FeeTreasury: "0xD4227a0280Bdf07169aB234cdc7467197F1A3798",
    LeadershipPool: "0xd309f8eBf28D358c63Ca72bF98662FF6530D1d9e",
    MiningRevenueDistributor: "0x101a8667037bD1759B2a5b68b8127b254C39f407",
    HashTreasury: "0x624408B5c8529244aFb118B3A7fCb3d806a50950",
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
