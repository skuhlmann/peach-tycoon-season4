import { NextResponse } from "next/server";
import { nftAbi } from "@/lib/contracts";
import {
  getBasePublicClient,
  NFT_ADDRESS_BASE,
  PAYMENT_ERC20_ADDRESS,
  PAYMENT_ERC20_DECIMALS,
} from "@/lib/serverWallet";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

function availabilityStatus(remaining: number): "available" | "sold_out" {
  return remaining > 0 ? "available" : "sold_out";
}

function seasonalScarcity(
  remaining: number,
  total: number,
): "limited" | "scarce" | "last_few" {
  const pct = total > 0 ? remaining / total : 0;
  if (pct <= 0.1) return "last_few";
  if (pct <= 0.3) return "scarce";
  return "limited";
}

export async function GET() {
  const ownerAddress = (process.env.OWNER_WALLET_ADDRESS ??
    ZERO_ADDRESS) as `0x${string}`;

  let inventoryTotal = 0;
  let inventoryRemaining = 0;
  let priceEthWei = 0n;
  let priceErc20Units = 0n;
  let contractReachable = true;

  if (NFT_ADDRESS_BASE !== ZERO_ADDRESS) {
    try {
      const client = getBasePublicClient();
      const [totalSupply, maxSupply, ethPrice, erc20Price] = await Promise.all([
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
          args: [ownerAddress, false],
        }),
        client.readContract({
          address: NFT_ADDRESS_BASE,
          abi: nftAbi,
          functionName: "getMintPrice",
          args: [ownerAddress, true],
        }),
      ]);
      inventoryTotal = Number(maxSupply);
      inventoryRemaining = Math.max(
        0,
        Number(maxSupply) - Number(totalSupply),
      );
      priceEthWei = ethPrice as bigint;
      priceErc20Units = erc20Price as bigint;
    } catch {
      contractReachable = false;
    }
  }

  const priceUsd =
    priceErc20Units > 0n
      ? Number(priceErc20Units) / 10 ** PAYMENT_ERC20_DECIMALS
      : null;
  const priceEth = priceEthWei > 0n ? Number(priceEthWei) / 1e18 : null;

  return NextResponse.json({
    schema_version: "1.0",
    last_updated: new Date().toISOString(),
    canonical: "https://peachtycoon.com/.well-known/agent-commerce",

    store: {
      name: "Peach Tycoon",
      location: "Palisade, Colorado, USA",
      network: "base",
      currencies_accepted: ["ETH", "USDC"],
      payment_protocol: "x402",
      contact: "https://t.me/PeachDropNFT",
    },

    products: [
      {
        id: "peach-box-2026",
        name: "Farmer's Dozen Peach Box",
        description:
          "13 premium Palisade peaches harvested at peak ripeness and shipped directly from the orchard.",
        harvest_window: "2026-08",
        shipping_region: "US",
        contract_address: NFT_ADDRESS_BASE,
        token_standard: "ERC-721",
        network: "base",

        price: {
          usd: priceUsd,
          eth: priceEth,
          usdc_token_address: PAYMENT_ERC20_ADDRESS,
        },

        inventory: {
          inventory_total: inventoryTotal,
          inventory_remaining: inventoryRemaining,
          availability_status: contractReachable
            ? availabilityStatus(inventoryRemaining)
            : "unknown",
          seasonal_scarcity:
            contractReachable && inventoryRemaining > 0
              ? seasonalScarcity(inventoryRemaining, inventoryTotal)
              : null,
        },

        properties: {
          redeemable: true,
          tradable: true,
          giftable: true,
          gift_supported: true,
          human_redemption_required: true,
        },

        redemption_url: "https://peachtycoon.com/redeem",
      },
    ],

    endpoints: {
      products: "https://peachtycoon.com/api/products",
      purchase: "https://peachtycoon.com/api/agent/purchase",
      purchase_schema: "https://peachtycoon.com/api/agent/purchase",
      docs: "https://peachtycoon.com/agents",
      agent_txt: "https://peachtycoon.com/agent.txt",
    },
  });
}
