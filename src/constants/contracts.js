export const ACTIVE_CHAIN_ID = Number(import.meta.env.VITE_ACTIVE_CHAIN_ID || 97);

const contractAddresses = {
  // BSC Testnet (97)
  97: {
    VaultIQMain: "0x78879182f48A53EB06d948269Bb6FCDBbfAbE5C0",
    Branch: "0x523a64872dAc9C09AD84E87E3ecD697F08CEfea3",
    BranchFactory: "0x1e778A3F4D101f24B94159fa3548aDE75A65417e",
    BranchExtension: "0xc8f92068e44d91F3586556067f56b36467121264",
    IncubatorPool: "0x1E6A023b6BFE520365C2Efe249FA0384A44aF023",
    FeeTreasury: "0x480BBAa8a4Fe44bc8389F5c45CD9678211862FFa",
    LeadershipPool: "0xB380C3936303353e62fBB2DA902Ffc35E86272b5",
    MiningRevenueDistributor: "0xbfea6e105F30c49Da12aA8Ce6DbA6F7Ac7947F33",
    HashTreasury: "0xB37CF1556868285fB003f283f831Ac812877F1e2",
    USDT: "0x3f34F38c202A73fEFeDef2C202F36D5a28dA271C",
    MockBTCB: "0x89e96c66eF584Da6194DF78bf34Cbf39d367570f",
    BranchViews : "0x31EE34880A37Ef83a81e8cb06e53419b0195659D"
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
export const BranchExtension_Address = active.BranchExtension;
export const IncubatorPool_Address = active.IncubatorPool;
export const FeeTreasury_Address = active.FeeTreasury;
export const LeadershipPool_Address = active.LeadershipPool;
export const MiningRevenueDistributor_Address = active.MiningRevenueDistributor;
export const HashTreasury_Address = active.HashTreasury;

export default contractAddresses;
