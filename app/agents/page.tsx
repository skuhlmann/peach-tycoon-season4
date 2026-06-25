import Image from "next/image";
import { Bot } from "lucide-react";

const resources = [
  {
    label: "Canonical schema",
    href: "/.well-known/agent-commerce",
  },
  { label: "Product list", href: "/api/products" },
  { label: "Endpoint status", href: "/api/agent/purchase" },
  { label: "Agent index", href: "/agent.txt" },
];

export default function AgentsPage() {
  return (
    <main className="min-h-screen px-[8vw] py-24">
      <div className="flex flex-col gap-4 mb-16">
        <p className="font-display font-bold uppercase text-brand-orange text-sm tracking-widest">
          For AI Agents
        </p>
        <h1 className="font-heading text-[56px] md:text-[80px] text-brand-white leading-tight">
          Agent Commerce
        </h1>
        <p className="font-sans text-brand-white/70 text-xl leading-relaxed max-w-2xl">
          Peach Tycoon exposes machine-readable product metadata for seasonal
          Palisade peach drops.{" "}
          <span className="text-brand-white font-semibold">
            Season 4 is sold out.
          </span>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <div className="flex-1 flex flex-col gap-8 max-w-3xl">
          <section className="bg-brand-gray rounded-[20px] p-8 border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <Bot className="text-brand-orange w-6 h-6 flex-shrink-0" />
              <h2 className="font-heading text-[28px] text-brand-white">
                Current Status
              </h2>
            </div>
            <p className="font-sans text-brand-white/70 text-lg leading-relaxed">
              The Season 4 sale flow is disabled until the next seasonal
              drop. Discovery endpoints remain available so agents can
              understand the product, inventory state, and future availability.
            </p>
          </section>

          <section className="bg-brand-gray rounded-[20px] p-8 border border-white/5">
            <h2 className="font-heading text-[28px] text-brand-white mb-6">
              Seasonal Flow
            </h2>
            <ol className="flex flex-col gap-4">
              {[
                "A limited harvest allocation opens for the season.",
                "Peach Tokens represent real Farmer's Dozen peach boxes.",
                "Palisade peaches ripen and are picked at peak sweetness.",
                "Tokens are redeemed during the harvest window.",
                "Boxes ship directly from the orchard.",
              ].map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="font-heading text-brand-orange text-xl w-6 flex-shrink-0">
                    {index + 1}.
                  </span>
                  <span className="font-sans text-brand-white/75 text-lg">
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="border border-white/10 rounded-[20px] p-8 flex flex-col gap-4">
            <h2 className="font-heading text-[24px] text-brand-white">
              Machine-Readable Resources
            </h2>
            <div className="flex flex-col gap-2">
              {resources.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="font-mono text-brand-blue text-sm hover:text-brand-orange transition-colors flex items-center gap-2"
                >
                  <span className="opacity-40">-&gt;</span>
                  <span>
                    {label}{" "}
                    <span className="opacity-50 font-sans not-italic">
                      {href}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </section>
        </div>

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
              Season 4 Sold Out
            </p>
            <p className="font-sans text-brand-white/70 text-base leading-relaxed">
              Come back next season for updated inventory and availability.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
