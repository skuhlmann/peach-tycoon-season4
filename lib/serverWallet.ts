import { createPublicClient, createWalletClient, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { CONTRACTS } from "@/lib/contracts";

// Agent commerce always targets Base mainnet regardless of NEXT_PUBLIC_NETWORK.
// This module intentionally does NOT use CHAIN_OBJ or ALCHEMY_RPC from constants.ts.
const ALCHEMY_BASE_RPC = `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;

export const NFT_ADDRESS_BASE = CONTRACTS.base.nft;
export const PAYMENT_ERC20_ADDRESS = CONTRACTS.base.paymentERC20;
export const PAYMENT_ERC20_DECIMALS = 6;

if (NFT_ADDRESS_BASE === "0x0000000000000000000000000000000000000000") {
  console.warn(
    "[serverWallet] NEXT_PUBLIC_NFT_CONTRACT_MAINNET is not set. " +
      "Agent commerce endpoints will return 503 until this is configured."
  );
}

export function getBasePublicClient() {
  return createPublicClient({ chain: base, transport: http(ALCHEMY_BASE_RPC) });
}

export function getOwnerWalletClient() {
  const pk = process.env.OWNER_PRIVATE_KEY;
  if (!pk) throw new Error("OWNER_PRIVATE_KEY is not set");
  if (!pk.startsWith("0x") || pk.length !== 66) {
    throw new Error("OWNER_PRIVATE_KEY must be a 0x-prefixed 32-byte hex string");
  }
  const account = privateKeyToAccount(pk as `0x${string}`);
  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(ALCHEMY_BASE_RPC),
  });
  return { account, walletClient };
}
