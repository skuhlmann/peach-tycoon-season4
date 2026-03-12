import { NextResponse } from "next/server";
import { nftAbi } from "@/lib/contracts";
import {
  getBasePublicClient,
  NFT_ADDRESS_BASE,
  PAYMENT_ERC20_ADDRESS,
  PAYMENT_ERC20_DECIMALS,
} from "@/lib/serverWallet";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export async function GET() {
  if (NFT_ADDRESS_BASE === ZERO_ADDRESS) {
    return NextResponse.json(
      { error: "Contract not yet deployed on mainnet" },
      { status: 503 },
    );
  }

  const client = getBasePublicClient();
  const ownerAddress = process.env.OWNER_WALLET_ADDRESS as
    | `0x${string}`
    | undefined;

  try {
    const [totalSupply, maxSupply, priceEthWei, priceErc20Units] =
      await Promise.all([
        client.readContract({
          address: NFT_ADDRESS_BASE,
          abi: nftAbi,
          functionName: "totalSupply",
        }),
        client.readContract({
          address: NFT_ADDRESS_BASE,
          abi: nftAbi,
          functionName: "maxSupply",
        }),
        client.readContract({
          address: NFT_ADDRESS_BASE,
          abi: nftAbi,
          functionName: "getMintPrice",
          // Use owner address for price lookup so discount logic applies;
          // fall back to zero address if not yet configured
          args: [(ownerAddress ?? ZERO_ADDRESS) as `0x${string}`, false],
        }),
        client.readContract({
          address: NFT_ADDRESS_BASE,
          abi: nftAbi,
          functionName: "getMintPrice",
          args: [(ownerAddress ?? ZERO_ADDRESS) as `0x${string}`, true],
        }),
      ]);

    const available = Number(maxSupply) - Number(totalSupply);

    return NextResponse.json([
      {
        id: "0x82Db219d098b4EC1885161A9109A742660b480B2",
        name: "Farmer's Dozen Peach Box",
        description: "13 premium Palisade peaches shipped from Colorado",
        price_eth: Number(priceEthWei) / 1e18,
        price_usdc: Number(priceErc20Units) / 10 ** PAYMENT_ERC20_DECIMALS,
        payment_token_address: PAYMENT_ERC20_ADDRESS,
        available,
        redeemable: true,
        harvest_window: "August 2026",
        token_contract: NFT_ADDRESS_BASE,
      },
    ]);
  } catch (err) {
    console.error("[GET /api/products]", err);
    return NextResponse.json(
      { error: "Failed to read contract data" },
      { status: 500 },
    );
  }
}
