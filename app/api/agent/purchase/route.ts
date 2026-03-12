import { NextRequest, NextResponse } from "next/server";
import { isAddress, parseEventLogs, formatUnits } from "viem";
import { nftAbi } from "@/lib/contracts";
import {
  getBasePublicClient,
  getOwnerWalletClient,
  NFT_ADDRESS_BASE,
  PAYMENT_ERC20_ADDRESS,
  PAYMENT_ERC20_DECIMALS,
} from "@/lib/serverWallet";
import { parsePaymentProof, verifyPayment } from "@/lib/paymentVerifier";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const PRODUCT_ID = "0x82Db219d098b4EC1885161A9109A742660b480B2";

// In-memory idempotency store.
// MVP only: lost on server restart, not safe across multiple serverless instances.
// The contract supply cap is the final safety net against duplicate mints.
// Upgrade to Redis/KV for production.
const idempotencyStore = new Map<
  string,
  { status: string; token_id?: number | null; tx_hash?: string }
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
  if (NFT_ADDRESS_BASE === ZERO_ADDRESS) {
    return NextResponse.json(
      { error: "Contract not yet deployed on mainnet" },
      { status: 503 },
    );
  }

  // Parse and validate request body
  let body: { product_id?: string; recipient_wallet?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { product_id, recipient_wallet } = body;

  if (product_id !== PRODUCT_ID) {
    return NextResponse.json(
      { error: `Unknown product_id: ${product_id}` },
      { status: 400 },
    );
  }
  if (!recipient_wallet || !isAddress(recipient_wallet)) {
    return NextResponse.json(
      { error: "Invalid or missing recipient_wallet" },
      { status: 400 },
    );
  }

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
      args: [[recipient_wallet as `0x${string}`]],
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

  const result = { status: "success", token_id: tokenId, tx_hash: mintTxHash };
  if (idempotencyKey) idempotencyStore.set(idempotencyKey, result);

  return NextResponse.json(result);
}
