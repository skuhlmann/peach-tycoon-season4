import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { nftAbi, getContracts } from "@/lib/contracts";
import { CHAIN_OBJ } from "@/lib/constants";

/**
 * GET /api/order?tokenId=X&wallet=0x...
 *
 * 1. Verifies on-chain that the token is redeemed (tokenState == 1)
 * 2. Verifies the wallet owns the token
 * 3. Checks for an existing Shopify order (stubbed — reads from in-memory map for now)
 * 4. Returns order info or a checkout URL
 */

// In-memory stub for development (replace with Shopify API when credentials arrive)
const stubOrders = new Map<
  string,
  { orderedAt: string; orderNumber: string }
>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tokenIdParam = searchParams.get("tokenId");
  const wallet = searchParams.get("wallet");
  const redirect = searchParams.get("redirect") === "true";

  if (!tokenIdParam || !wallet) {
    return NextResponse.json(
      { error: "Missing tokenId or wallet" },
      { status: 400 },
    );
  }

  const tokenId = BigInt(tokenIdParam);
  const { nft: nftAddress } = getContracts();
  const chain = CHAIN_OBJ;

  const client = createPublicClient({
    chain,
    transport: http(),
  });

  try {
    // Verify on-chain: token is redeemed
    const tokenState = await client.readContract({
      address: nftAddress,
      abi: nftAbi,
      functionName: "tokenState",
      args: [tokenId],
    });

    if (Number(tokenState) !== 1) {
      return NextResponse.json(
        { error: "Token has not been redeemed" },
        { status: 400 },
      );
    }

    // Verify token ownership
    const owner = await client.readContract({
      address: nftAddress,
      abi: nftAbi,
      functionName: "ownerOf",
      args: [tokenId],
    });

    if ((owner as string).toLowerCase() !== wallet.toLowerCase()) {
      return NextResponse.json(
        { error: "Wallet does not own this token" },
        { status: 403 },
      );
    }

    // Check for existing order (stub)
    const orderKey = `${tokenIdParam}`;
    const existingOrder = stubOrders.get(orderKey);

    if (existingOrder) {
      return NextResponse.json({
        ordered: true,
        orderedAt: existingOrder.orderedAt,
        orderNumber: existingOrder.orderNumber,
      });
    }

    // No order yet — return stub checkout URL
    // TODO: Replace with real Shopify checkout URL when credentials are available:
    //   const shopify = new Shopify({ shop: process.env.SHOPIFY_STORE_URL, ... });
    //   const checkout = await shopify.checkout.create({ ... });
    //   return NextResponse.json({ ordered: false, checkoutUrl: checkout.webUrl });

    const stubCheckoutUrl = `/api/order/stub-checkout?tokenId=${tokenIdParam}&wallet=${wallet}`;

    if (redirect) {
      return NextResponse.redirect(new URL(stubCheckoutUrl, req.url));
    }

    return NextResponse.json({ ordered: false, checkoutUrl: stubCheckoutUrl });
  } catch (err) {
    console.error("Order API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
