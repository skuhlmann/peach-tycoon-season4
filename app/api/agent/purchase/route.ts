import { NextRequest, NextResponse } from "next/server";
import { isAddress, parseEventLogs, formatUnits } from "viem";
import { nftAbi } from "@/lib/contracts";
import { SALE_STATE } from "@/lib/constants";
import {
  getBasePublicClient,
  getOwnerWalletClient,
  NFT_ADDRESS_BASE,
  PAYMENT_ERC20_ADDRESS,
  PAYMENT_ERC20_DECIMALS,
} from "@/lib/serverWallet";
import { parsePaymentProof, verifyPayment } from "@/lib/paymentVerifier";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const PRODUCT_ID = "peach-box-2026";

// In-memory idempotency store.
// MVP only: lost on server restart, not safe across multiple serverless instances.
// The contract supply cap is the final safety net against duplicate mints.
// Upgrade to Redis/KV for production.
const idempotencyStore = new Map<
  string,
  {
    status: string;
    token_id?: string | null;
    contract_address?: string;
    tx_hash?: string;
    mint_tx_hash?: string;
  }
>();

async function getPricesAndSupply() {
  const client = getBasePublicClient();
  const ownerAddress = (process.env.OWNER_WALLET_ADDRESS ??
    ZERO_ADDRESS) as `0x${string}`;

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
        args: [ownerAddress, false],
      }),
      client.readContract({
        address: NFT_ADDRESS_BASE,
        abi: nftAbi,
        functionName: "getMintPrice",
        args: [ownerAddress, true],
      }),
    ]);

  return {
    totalSupply: totalSupply as bigint,
    maxSupply: maxSupply as bigint,
    priceEthWei: priceEthWei as bigint,
    priceErc20Units: priceErc20Units as bigint,
  };
}

export async function GET() {
  if (SALE_STATE === "closed") {
    return NextResponse.json({
      endpoint: "/api/agent/purchase",
      method: "POST",
      status: "sold_out",
      description:
        "Peach Tycoon Season 4 is sold out. The purchase endpoint is disabled until the next seasonal drop.",
      failure_responses: {
        410: "Sold out",
      },
    });
  }

  return NextResponse.json({
    endpoint: "/api/agent/purchase",
    method: "POST",
    description:
      "Purchase a Peach Token NFT on behalf of a buyer. Implements the x402 payment protocol: send the request without an Authorization header to receive payment instructions, then retry with proof of payment.",
    headers: {
      "Content-Type": "application/json",
      Authorization: "x402 <txHash>  // required on retry after payment",
      "Idempotency-Key": "<uuid>      // optional, prevents duplicate mints",
    },
    request_schema: {
      product_id: "string (required) — must be 'peach-box-2026'",
      buyer_wallet: "address (required) — receives the token if gift_to is omitted",
      gift_to: "address (optional) — mint destination when gifting",
    },
    example_request: {
      product_id: "peach-box-2026",
      buyer_wallet: "0xabc...",
      gift_to: "0xdef...",
    },
    flow: [
      {
        step: 1,
        description: "POST without Authorization header",
        response_status: 402,
        example_response: {
          payment_options: [
            {
              protocol: "x402",
              network: "base",
              asset: "ETH",
              amount: "0.03",
              pay_to: "0xOwner...",
            },
            {
              protocol: "x402",
              network: "base",
              asset: "USDC",
              amount: "95.00",
              token_address: "0xUSDC...",
              pay_to: "0xOwner...",
            },
          ],
          product_id: "peach-box-2026",
        },
      },
      {
        step: 2,
        description: "Pay on Base, then retry with Authorization: x402 <txHash>",
        response_status: 200,
        example_response: {
          status: "success",
          token_id: "104",
          contract_address: NFT_ADDRESS_BASE,
          tx_hash: "0x...",
        },
      },
    ],
    failure_responses: {
      400: "Invalid JSON, unknown product_id, missing/invalid buyer_wallet or gift_to",
      402: "Payment required — see payment_options in response body",
      410: "Sold out",
      422: "Payment verification failed",
      500: "Mint transaction failed or server misconfiguration",
      503: "Contract not yet deployed",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers":
        "Authorization, Content-Type, Idempotency-Key",
    },
  });
}

export async function POST(req: NextRequest) {
  if (SALE_STATE === "closed") {
    return NextResponse.json(
      {
        error: "Sold out",
        message:
          "Peach Tycoon Season 4 is sold out. Come back next season for the next drop.",
      },
      { status: 410 },
    );
  }

  if (NFT_ADDRESS_BASE === ZERO_ADDRESS) {
    return NextResponse.json(
      { error: "Contract not yet deployed on mainnet" },
      { status: 503 },
    );
  }

  // Parse and validate request body
  let body: { product_id?: string; buyer_wallet?: string; gift_to?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { product_id, buyer_wallet, gift_to } = body;

  if (product_id !== PRODUCT_ID) {
    return NextResponse.json(
      { error: `Unknown product_id: ${product_id}` },
      { status: 400 },
    );
  }
  if (!buyer_wallet || !isAddress(buyer_wallet)) {
    return NextResponse.json(
      { error: "Invalid or missing buyer_wallet" },
      { status: 400 },
    );
  }
  if (gift_to !== undefined && !isAddress(gift_to)) {
    return NextResponse.json(
      { error: "Invalid gift_to address" },
      { status: 400 },
    );
  }

  const mintRecipient = (gift_to ?? buyer_wallet) as `0x${string}`;

  const ownerAddress = process.env.OWNER_WALLET_ADDRESS;
  if (!ownerAddress || !isAddress(ownerAddress)) {
    console.error("[agent/purchase] OWNER_WALLET_ADDRESS not configured");
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 },
    );
  }

  const authHeader = req.headers.get("authorization");

  // ─── Path A: No Authorization header — return 402 Payment Required ───────────
  if (!authHeader) {
    let prices;
    try {
      prices = await getPricesAndSupply();
    } catch (err) {
      console.error("[agent/purchase] contract read failed", err);
      return NextResponse.json(
        { error: "Failed to read contract" },
        { status: 500 },
      );
    }

    if (prices.totalSupply >= prices.maxSupply) {
      return NextResponse.json({ error: "Sold out" }, { status: 410 });
    }

    const ethAmount = formatUnits(prices.priceEthWei, 18);
    const usdcAmount = formatUnits(
      prices.priceErc20Units,
      PAYMENT_ERC20_DECIMALS,
    );

    return NextResponse.json(
      {
        payment_options: [
          {
            protocol: "x402",
            network: "base",
            asset: "ETH",
            amount: ethAmount,
            pay_to: ownerAddress,
          },
          {
            protocol: "x402",
            network: "base",
            asset: "USDC",
            amount: usdcAmount,
            token_address: PAYMENT_ERC20_ADDRESS,
            pay_to: ownerAddress,
          },
        ],
        product_id: PRODUCT_ID,
      },
      { status: 402 },
    );
  }

  // ─── Path B: Authorization header present — verify payment and mint ──────────
  const txHash = parsePaymentProof(authHeader);
  if (!txHash) {
    return NextResponse.json(
      { error: "Malformed Authorization header. Expected: x402 <txHash>" },
      { status: 400 },
    );
  }

  // Idempotency: return cached result if this key was already processed
  const idempotencyKey = req.headers.get("idempotency-key") ?? "";
  if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
    return NextResponse.json(idempotencyStore.get(idempotencyKey)!);
  }

  let prices;
  try {
    prices = await getPricesAndSupply();
  } catch (err) {
    console.error("[agent/purchase] contract read failed", err);
    return NextResponse.json(
      { error: "Failed to read contract" },
      { status: 500 },
    );
  }

  if (prices.totalSupply >= prices.maxSupply) {
    return NextResponse.json({ error: "Sold out" }, { status: 410 });
  }

  // Verify payment on-chain
  const verification = await verifyPayment(
    txHash,
    prices.priceEthWei,
    prices.priceErc20Units,
    ownerAddress as `0x${string}`,
    PAYMENT_ERC20_ADDRESS,
  );

  if (!verification.valid) {
    return NextResponse.json(
      { error: "Payment verification failed", detail: verification.error },
      { status: 422 },
    );
  }

  // Mint token to recipient
  let mintTxHash: `0x${string}`;
  try {
    const { account, walletClient } = getOwnerWalletClient();
    mintTxHash = await walletClient.writeContract({
      address: NFT_ADDRESS_BASE,
      abi: nftAbi,
      functionName: "mintTo",
      args: [[mintRecipient]],
      account,
    });
  } catch (err) {
    console.error("[agent/purchase] mintTo failed", err);
    return NextResponse.json(
      { error: "Mint transaction failed" },
      { status: 500 },
    );
  }

  // Wait for mint receipt
  const client = getBasePublicClient();
  let mintReceipt;
  try {
    mintReceipt = await client.waitForTransactionReceipt({
      hash: mintTxHash,
      timeout: 60_000,
    });
  } catch {
    // Timeout — return 202 so agent can check back
    const pendingResult = { status: "pending", mint_tx_hash: mintTxHash };
    if (idempotencyKey) idempotencyStore.set(idempotencyKey, pendingResult);
    return NextResponse.json(pendingResult, { status: 202 });
  }

  if (mintReceipt.status !== "success") {
    return NextResponse.json(
      { error: "Mint transaction reverted" },
      { status: 500 },
    );
  }

  // Parse tokenId from Transfer(address(0), recipient, tokenId) event
  let tokenId: number | null = null;
  try {
    const transferLogs = parseEventLogs({
      abi: nftAbi,
      eventName: "Transfer",
      logs: mintReceipt.logs,
    }) as unknown as { args: { from: string; tokenId: bigint } }[];
    const mintLog = transferLogs.find((l) => l.args.from === ZERO_ADDRESS);
    if (mintLog) tokenId = Number(mintLog.args.tokenId);
  } catch {
    // tokenId parsing failed — still return success with null tokenId
  }

  const result = {
    status: "success",
    token_id: tokenId !== null ? String(tokenId) : null,
    contract_address: NFT_ADDRESS_BASE,
    tx_hash: mintTxHash,
  };
  if (idempotencyKey) idempotencyStore.set(idempotencyKey, result);

  return NextResponse.json(result);
}
