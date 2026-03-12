import { parseEventLogs } from "viem";
import { getBasePublicClient } from "@/lib/serverWallet";

const ERC20_TRANSFER_ABI = [
  {
    name: "Transfer",
    type: "event",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
  },
] as const;

export function parsePaymentProof(authHeader: string): `0x${string}` | null {
  // Expected format: "x402 <txHash>"
  const parts = authHeader.trim().split(" ");
  if (parts.length !== 2 || parts[0] !== "x402") return null;
  const txHash = parts[1];
  if (!/^0x[0-9a-fA-F]{64}$/.test(txHash)) return null;
  return txHash as `0x${string}`;
}

export async function verifyPayment(
  txHash: `0x${string}`,
  expectedEthWei: bigint,
  expectedErc20Units: bigint,
  payToAddress: `0x${string}`,
  erc20Address: `0x${string}`
): Promise<{
  valid: boolean;
  asset?: "ETH" | "USDC";
  fromAddress?: `0x${string}`;
  error?: string;
}> {
  const client = getBasePublicClient();

  let tx;
  try {
    tx = await client.getTransaction({ hash: txHash });
  } catch {
    return { valid: false, error: "Transaction not found" };
  }
  if (!tx) return { valid: false, error: "Transaction not found" };

  let receipt;
  try {
    receipt = await client.getTransactionReceipt({ hash: txHash });
  } catch {
    return { valid: false, error: "Transaction receipt not found" };
  }
  if (!receipt) return { valid: false, error: "Transaction not yet mined" };
  if (receipt.status !== "success") {
    return { valid: false, error: "Transaction reverted" };
  }

  // ETH payment: tx carries ETH value directly to pay_to address
  if (tx.value > 0n) {
    if (tx.to?.toLowerCase() !== payToAddress.toLowerCase()) {
      return { valid: false, error: "ETH not sent to correct address" };
    }
    if (tx.value < expectedEthWei) {
      return {
        valid: false,
        error: `ETH amount too low: got ${tx.value}, expected ${expectedEthWei}`,
      };
    }
    return { valid: true, asset: "ETH", fromAddress: tx.from };
  }

  // USDC payment: look for ERC20 Transfer event on the payment token contract
  const matchingLogs = receipt.logs.filter(
    (l) => l.address.toLowerCase() === erc20Address.toLowerCase()
  );

  let transferLogs;
  try {
    transferLogs = parseEventLogs({
      abi: ERC20_TRANSFER_ABI,
      logs: matchingLogs,
    });
  } catch {
    return { valid: false, error: "Could not parse ERC20 transfer logs" };
  }

  const transferLog = transferLogs.find(
    (l) => l.args.to.toLowerCase() === payToAddress.toLowerCase()
  );

  if (!transferLog) {
    return {
      valid: false,
      error: "No ERC20 transfer to pay_to address found in transaction",
    };
  }

  if (transferLog.args.value < expectedErc20Units) {
    return {
      valid: false,
      error: `USDC amount too low: got ${transferLog.args.value}, expected ${expectedErc20Units}`,
    };
  }

  return { valid: true, asset: "USDC", fromAddress: transferLog.args.from };
}
