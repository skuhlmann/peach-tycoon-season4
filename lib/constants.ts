import { base, sepolia } from "viem/chains";

export type SaleState = "upcoming" | "ongoing" | "closed";

// Sale state — managed here since mintOpen is private on-chain.
// Set to "upcoming" before launch, "ongoing" when minting opens, "closed" when sold out or ended.
export const SALE_STATE: SaleState = "ongoing";

// Sale dates — used for countdown timer (upcoming) and display only.
// These are informational; the contract enforces actual mint availability.
export const SALE_START: Date | null = null; // e.g. new Date("2025-07-01T18:00:00Z")
export const SALE_END: Date | null = null; // e.g. new Date("2025-08-01T18:00:00Z")

// Redemption window is read live from the contract (redemptionStart / redemptionEnd public timestamps).
// No duplication needed here.

// Chain IDs
export const CHAIN_IDS = {
  mainnet: 8453, // Base mainnet
  testnet: 11155111, // Sepolia
} as const;

// Season info
export const SEASON = 4;
export const PROJECT_NAME = "Peach Tycoon";
export const SITE_URL = "https://peachtycoon.com";

// Social links (fill in when available)
export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/PeachDropNFT",
  farcaster: "", // e.g. "https://warpcast.com/peachtycoon"
  telegram: "https://t.me/PeachDropNFT",
  opensea: "", // fill after mainnet deployment
};

export const TARGET_NETWORK = process.env.NEXT_PUBLIC_NETWORK as string;

export const ALCHEMY_RPC =
  TARGET_NETWORK === "base"
    ? `https://base-mainnet.g.alchemy.com/v2/${
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
      }`
    : `https://eth-sepolia.g.alchemy.com/v2/${
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
      }`;

export const CHAIN_OBJ = TARGET_NETWORK === "base" ? base : sepolia;
