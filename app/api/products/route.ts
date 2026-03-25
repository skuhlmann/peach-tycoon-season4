import { NextResponse } from "next/server";
import { nftAbi } from "@/lib/contracts";
import {
  getBasePublicClient,
  NFT_ADDRESS_BASE,
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

  console.log("ownerAddress", ownerAddress);

  console.log("NFT_ADDRESS_BASE", NFT_ADDRESS_BASE);

  try {
    const [totalSupply, maxSupply, priceErc20Units] =
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
          args: [(ownerAddress ?? ZERO_ADDRESS) as `0x${string}`, true],
        }),
      ]);

    const available = Number(maxSupply) - Number(totalSupply);

    return NextResponse.json({
      products: [
        {
          id: "peach-box-2026",
          name: "Farmer's Dozen Peach Box",
          description:
            "13 premium Palisade peaches harvested at peak ripeness.",
          price: {
            usd: Number(priceErc20Units) / 10 ** PAYMENT_ERC20_DECIMALS,
            currencies: ["ETH", "USDC"],
          },
          inventory_remaining: available,
          harvest_window: "2026-08",
          shipping_region: "US",
          redeemable: true,
          tradable: true,
          giftable: true,
          purchase_endpoint: "https://peachtycoon.com/api/agent/purchase",
        },
      ],
    });
  } catch (err) {
    console.error("[GET /api/products]", err);
    return NextResponse.json(
      { error: "Failed to read contract data" },
      { status: 500 },
    );
  }
}
