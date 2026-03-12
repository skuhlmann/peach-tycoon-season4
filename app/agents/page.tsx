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

          {/* How it works */}
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-[28px] text-brand-white">
              How It Works
            </h2>
            <ol className="flex flex-col gap-4">
              {[
                "Agent discovers available products via GET /api/products",
                "Agent sends purchase request to POST /api/agent/purchase",
                "Server responds with HTTP 402 and payment options (ETH or USDC)",
                "Agent pays on Base network and retries with payment proof",
                "Token is minted and transferred to the agent's wallet",
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="font-heading text-brand-orange text-xl w-6 flex-shrink-0">
                    {i + 1}.
                  </span>
                  <span className="font-sans text-brand-white/70 text-lg leading-snug">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Machine-readable resources */}
          <div className="border border-white/10 rounded-[20px] p-8 flex flex-col gap-4">
            <h2 className="font-heading text-[24px] text-brand-white">
              Machine-Readable Resources
            </h2>
            <div className="flex flex-col gap-2">
              {[
                { label: "Agent guide", href: "/agent.txt" },
                { label: "Agent guideinteraction schema", href: "/agent.txt" },
                { label: "Product endpoint", href: "/api/products" },
                { label: "Purchase endpoint", href: "/api/agent/purchase" },
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
