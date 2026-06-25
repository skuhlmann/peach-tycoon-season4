import { NextResponse } from "next/server";
import { nftAbi } from "@/lib/contracts";
import {
  getBasePublicClient,
  NFT_ADDRESS_BASE,
  PAYMENT_ERC20_DECIMALS,
} from "@/lib/serverWallet";
import { SALE_STATE } from "@/lib/constants";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export async function GET() {
  if (SALE_STATE === "closed") {
    return NextResponse.json({
      products: [
        {
          id: "peach-box-2026",
          name: "Farmer's Dozen Peach Box",
          description:
            "Season 4 is sold out. Come back next season for the next Palisade peach drop.",
          price: {
            usd: null,
            currencies: ["ETH", "USDC"],
          },
          inventory_remaining: 0,
          availability_status: "sold_out",
          harvest_window: "2026-08",
          shipping_region: "US",
          redeemable: true,
          purchase_endpoint: null,
        },
      ],
    });
  }

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

    const available = Math.max(0, Number(maxSupply) - Number(totalSupply));
    const soldOut = available === 0;

    return NextResponse.json({
      products: [
        {
          id: "peach-box-2026",
          name: "Farmer's Dozen Peach Box",
          description:
            soldOut
              ? "Season 4 is sold out. Come back next season for the next Palisade peach drop."
              : "13 premium Palisade peaches harvested at peak ripeness.",
          price: {
            usd: Number(priceErc20Units) / 10 ** PAYMENT_ERC20_DECIMALS,
            currencies: ["ETH", "USDC"],
          },
          inventory_remaining: available,
          availability_status: soldOut ? "sold_out" : "available",
          harvest_window: "2026-08",
          shipping_region: "US",
          redeemable: true,
          tradable: true,
          giftable: true,
          purchase_endpoint: soldOut
            ? null
            : "https://peachtycoon.com/api/agent/purchase",
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
