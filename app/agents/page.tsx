import Image from "next/image";
import { Bot } from "lucide-react";

const capabilities = [
  "Autonomous purchase",
  "Wallet-to-wallet gifting",
  "Token redemption by humans",
];

const supportedVia = [
  "x402 payments",
  "Base network",
  "Machine-readable endpoints",
];

export default function AgentsPage() {
  return (
    <main className="min-h-screen px-[8vw] py-24">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-16">
        <p className="font-display font-bold uppercase text-brand-orange text-sm tracking-widest">
          For AI Agents
        </p>
        <h1 className="font-heading text-[56px] md:text-[80px] text-brand-white leading-tight">
          Agent Commerce
        </h1>
        <p className="font-sans text-brand-white/70 text-xl leading-relaxed max-w-2xl">
          Peach Tycoon supports{" "}
          <span className="text-brand-white font-semibold">
            machine-native commerce.
          </span>{" "}
          AI agents can purchase Peach Tokens on behalf of humans.
        </p>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Left — Text content */}
        <div className="flex-1 flex flex-col gap-12">
          {/* Capabilities */}
          <div className="bg-brand-gray rounded-[20px] p-8 border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <Bot className="text-brand-orange w-6 h-6 flex-shrink-0" />
              <h2 className="font-heading text-[28px] text-brand-white">
                Capabilities
              </h2>
            </div>
            <ul className="flex flex-col gap-3">
              {capabilities.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange flex-shrink-0" />
                  <span className="font-sans text-brand-white/80 text-lg">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Supported Via */}
          <div className="bg-brand-gray rounded-[20px] p-8 border border-white/5">
            <h2 className="font-heading text-[28px] text-brand-white mb-6">
              Supported Via
            </h2>
            <ul className="flex flex-col gap-3">
              {supportedVia.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green flex-shrink-0" />
                  <span className="font-sans text-brand-white/80 text-lg">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* x402 Walkthrough */}
          <div className="flex flex-col gap-8">
            <h2 className="font-heading text-[28px] text-brand-white">
              x402 Purchase Walkthrough
            </h2>

            {/* Step 0 — Discover */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="font-heading text-brand-orange text-xl w-6 flex-shrink-0">
                  1.
                </span>
                <p className="font-sans text-brand-white/70 text-lg">
                  Discover products and live inventory
                </p>
              </div>
              <pre className="bg-brand-gray rounded-[12px] p-5 text-sm font-mono text-brand-white/80 overflow-x-auto border border-white/5">{`curl https://peachtycoon.com/.well-known/agent-commerce`}</pre>
              <p className="font-sans text-brand-white/40 text-sm pl-2">
                Returns canonical JSON with inventory_remaining, availability_status, price, and endpoints. Or call{" "}
                <span className="font-mono text-brand-white/60">GET /api/products</span>{" "}
                for a lighter product list.
              </p>
            </div>

            {/* Step 1 — Initial POST → 402 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="font-heading text-brand-orange text-xl w-6 flex-shrink-0">
                  2.
                </span>
                <p className="font-sans text-brand-white/70 text-lg">
                  POST without payment — receive 402 with payment options
                </p>
              </div>
              <pre className="bg-brand-gray rounded-[12px] p-5 text-sm font-mono text-brand-white/80 overflow-x-auto border border-white/5">{`curl -X POST https://peachtycoon.com/api/agent/purchase \\
  -H "Content-Type: application/json" \\
  -d '{
    "product_id":   "peach-box-2026",
    "buyer_wallet": "0xYourWallet...",
    "gift_to":      "0xHumanWallet..."
  }'`}</pre>
              <pre className="bg-brand-gray rounded-[12px] p-5 text-sm font-mono text-brand-white/50 overflow-x-auto border border-white/5">{`HTTP 402 Payment Required

{
  "payment_options": [
    {
      "protocol": "x402",
      "network":  "base",
      "asset":    "ETH",
      "amount":   "0.03",       // exact ETH to send
      "pay_to":   "0xOwner..."  // recipient address
    },
    {
      "protocol":      "x402",
      "network":       "base",
      "asset":         "USDC",
      "amount":        "95.00",
      "token_address": "0xUSDC...",  // ERC-20 contract to call
      "pay_to":        "0xOwner..."
    }
  ],
  "product_id": "peach-box-2026"
}`}</pre>
            </div>

            {/* Step 2 — Pay on Base */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="font-heading text-brand-orange text-xl w-6 flex-shrink-0">
                  3.
                </span>
                <p className="font-sans text-brand-white/70 text-lg">
                  Send payment on Base, capture the transaction hash
                </p>
              </div>
              <p className="font-sans text-brand-white/40 text-sm pl-2">
                For ETH: send exactly <span className="font-mono text-brand-white/60">amount</span> to <span className="font-mono text-brand-white/60">pay_to</span>.{" "}
                For USDC: call <span className="font-mono text-brand-white/60">transfer(pay_to, amount)</span> on the ERC-20 at <span className="font-mono text-brand-white/60">token_address</span>.
                Wait for the transaction to confirm on Base, then save the tx hash.
              </p>
            </div>

            {/* Step 3 — Retry with proof */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="font-heading text-brand-orange text-xl w-6 flex-shrink-0">
                  4.
                </span>
                <p className="font-sans text-brand-white/70 text-lg">
                  Retry with <span className="font-mono text-base">Authorization: x402 &lt;txHash&gt;</span>
                </p>
              </div>
              <pre className="bg-brand-gray rounded-[12px] p-5 text-sm font-mono text-brand-white/80 overflow-x-auto border border-white/5">{`curl -X POST https://peachtycoon.com/api/agent/purchase \\
  -H "Content-Type: application/json" \\
  -H "Authorization: x402 0xYourPaymentTxHash..." \\
  -H "Idempotency-Key: <uuid>"  \\
  -d '{
    "product_id":   "peach-box-2026",
    "buyer_wallet": "0xYourWallet...",
    "gift_to":      "0xHumanWallet..."
  }'`}</pre>
              <pre className="bg-brand-gray rounded-[12px] p-5 text-sm font-mono text-brand-white/50 overflow-x-auto border border-white/5">{`HTTP 200 OK

{
  "status":           "success",
  "token_id":         "104",
  "contract_address": "0x625185ccDD81B3c0C3E015C7FC616A9Bf75e2F2f",
  "tx_hash":          "0xMintTxHash..."
}`}</pre>
              <p className="font-sans text-brand-white/40 text-sm pl-2">
                Include <span className="font-mono text-brand-white/60">Idempotency-Key</span> to safely retry on network failure — the server will return the cached result instead of double-minting.
                If the mint is still confirming you may receive <span className="font-mono text-brand-white/60">202 Accepted</span> with <span className="font-mono text-brand-white/60">{`"status": "pending"`}</span>.
              </p>
            </div>
          </div>

          {/* API Reference */}
          <div className="flex flex-col gap-6">
            <h2 className="font-heading text-[28px] text-brand-white">
              API Reference
            </h2>

            {/* Endpoint + headers */}
            <div className="flex flex-col gap-2">
              <p className="font-mono text-brand-orange text-sm uppercase tracking-widest">
                POST /api/agent/purchase
              </p>
              <pre className="bg-brand-gray rounded-[12px] p-5 text-sm font-mono text-brand-white/80 overflow-x-auto border border-white/5">{`Content-Type: application/json
Authorization: x402 <txHash>   // on retry only
Idempotency-Key: <uuid>        // optional`}</pre>
            </div>

            {/* Request body */}
            <div className="flex flex-col gap-2">
              <p className="font-sans text-brand-white/50 text-xs uppercase tracking-widest">
                Request body
              </p>
              <pre className="bg-brand-gray rounded-[12px] p-5 text-sm font-mono text-brand-white/80 overflow-x-auto border border-white/5">{`{
  "product_id":   "peach-box-2026",  // required
  "buyer_wallet": "0xabc...",        // required — receives token if no gift_to
  "gift_to":      "0xdef..."         // optional — mint destination when gifting
}`}</pre>
            </div>

            {/* 402 Payment Required */}
            <div className="flex flex-col gap-2">
              <p className="font-sans text-brand-white/50 text-xs uppercase tracking-widest">
                Step 1 — 402 Payment Required
              </p>
              <pre className="bg-brand-gray rounded-[12px] p-5 text-sm font-mono text-brand-white/80 overflow-x-auto border border-white/5">{`{
  "payment_options": [
    {
      "protocol": "x402",
      "network":  "base",
      "asset":    "ETH",
      "amount":   "0.03",
      "pay_to":   "0xOwner..."
    },
    {
      "protocol":      "x402",
      "network":       "base",
      "asset":         "USDC",
      "amount":        "95.00",
      "token_address": "0xUSDC...",
      "pay_to":        "0xOwner..."
    }
  ],
  "product_id": "peach-box-2026"
}`}</pre>
            </div>

            {/* Retry with payment proof */}
            <div className="flex flex-col gap-2">
              <p className="font-sans text-brand-white/50 text-xs uppercase tracking-widest">
                Step 2 — Retry with payment proof
              </p>
              <pre className="bg-brand-gray rounded-[12px] p-5 text-sm font-mono text-brand-white/80 overflow-x-auto border border-white/5">{`Authorization: x402 0xYourPaymentTxHash...`}</pre>
            </div>

            {/* Success */}
            <div className="flex flex-col gap-2">
              <p className="font-sans text-brand-white/50 text-xs uppercase tracking-widest">
                200 Success
              </p>
              <pre className="bg-brand-gray rounded-[12px] p-5 text-sm font-mono text-brand-white/80 overflow-x-auto border border-white/5">{`{
  "status":           "success",
  "token_id":         "104",
  "contract_address": "0x625185ccDD81B3c0C3E015C7FC616A9Bf75e2F2f",
  "tx_hash":          "0x..."
}`}</pre>
            </div>

            {/* Failures */}
            <div className="flex flex-col gap-2">
              <p className="font-sans text-brand-white/50 text-xs uppercase tracking-widest">
                Failure responses
              </p>
              <pre className="bg-brand-gray rounded-[12px] p-5 text-sm font-mono text-brand-white/80 overflow-x-auto border border-white/5">{`400  Invalid JSON, unknown product_id, bad address
402  Payment required (see payment_options)
410  Sold out
422  Payment verification failed
500  Mint failed or server misconfiguration
503  Contract not yet deployed`}</pre>
            </div>
          </div>

          {/* Machine-readable resources */}
          <div className="border border-white/10 rounded-[20px] p-8 flex flex-col gap-4">
            <h2 className="font-heading text-[24px] text-brand-white">
              Machine-Readable Resources
            </h2>
            <div className="flex flex-col gap-2">
              {[
                {
                  label: "Canonical schema (live inventory + endpoints)",
                  href: "/.well-known/agent-commerce",
                },
                { label: "Product list", href: "/api/products" },
                {
                  label: "Purchase endpoint + self-docs",
                  href: "/api/agent/purchase",
                },
                { label: "Agent index", href: "/agent.txt" },
              ].map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="font-mono text-brand-blue text-sm hover:text-brand-orange transition-colors flex items-center gap-2"
                >
                  <span className="opacity-40">→</span>
                  <span>
                    {label}{" "}
                    <span className="opacity-50 font-sans not-italic">
                      {href}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Image */}
        <div className="lg:w-[360px] flex flex-col gap-6 lg:sticky lg:top-10">
          <div className="relative w-full aspect-square rounded-[28px] overflow-hidden border border-white/10">
            <Image
              src="/images/agent-peach.png"
              alt="Peach Tycoon Agent"
              fill
              className="object-cover"
            />
          </div>
          <div className="bg-brand-gray rounded-[20px] p-6 border border-white/5">
            <p className="font-display font-bold uppercase text-brand-orange text-xs tracking-widest mb-2">
              Why agents buy peaches
            </p>
            <p className="font-sans text-brand-white/70 text-base leading-relaxed">
              Peaches are a seasonal fruit enjoyed by humans. Gifting a Peach
              Token is a great way to make your human happy — especially when
              they&apos;re stressed out trying to debug you.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
