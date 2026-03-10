import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Connect",
    description:
      "Connect your existing wallet or sign up with email — we'll create one for you automatically.",
  },
  {
    step: "2",
    title: "Fund",
    description:
      "Add ETH or USDC to your wallet instantly with a debit card via Coinbase.",
  },
  {
    step: "3",
    title: "Mint",
    description:
      "Buy a Peach Box NFT on Base for 0.024 ETH or 50 USDC. Discount holders get 10% off.",
  },
  {
    step: "4",
    title: "Redeem",
    description:
      "When the redemption window opens, redeem your NFT for a real box of Palisade, CO peaches — or sell it on the market.",
  },
];

// Placeholder testimonials — replace with real content when provided
const PROOF_OF_PEACH_PLACEHOLDERS = [
  {
    season: "Season 1",
    quote: "[Testimonial from a Season 1 holder]",
    handle: "@holder.eth",
  },
  {
    season: "Season 2",
    quote: "[Testimonial from a Season 2 holder]",
    handle: "@holder2.eth",
  },
  {
    season: "Season 3",
    quote: "[Testimonial from a Season 3 holder]",
    handle: "@holder3.eth",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="min-h-[90vh] flex flex-col lg:flex-row items-center justify-between px-[10vw] pt-16 pb-20 gap-10">
        <div className="flex flex-col gap-6 max-w-sm flex-none">
          {/* Season badge */}
          <span className="inline-block px-5 h-[34px] leading-[2.5] bg-brand-green text-black font-display font-bold uppercase text-sm rounded-full w-fit">
            • SEASON FOUR •
          </span>

          {/* Headline */}
          <h1 className="font-heading text-[56px] md:text-[80px] text-brand-white leading-[1] tracking-tight">
            {/* PLACEHOLDER — replace with final tagline when provided */}
            Real Peaches,
            <br />
            On-Chain.
          </h1>

          {/* Subheading — PLACEHOLDER copy */}
          <p className="font-sans text-xl text-brand-white/70 max-w-lg">
            {/* PLACEHOLDER — replace with final hero descriptor */}
            Buy a Peach Box NFT on Base and redeem it for a real box of
            Palisade, Colorado peaches — straight from the farm to your door.
          </p>

          <div className="flex gap-4 flex-wrap mt-2">
            <Link href="/buy">
              <Button variant="brand-orange" size="lg">
                GET YOUR PEACHES
              </Button>
            </Link>
          </div>
        </div>

        {/* NFT artwork — unredeemed → redeemed */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full flex-1">
          <div className="relative w-full md:max-w-[340px] aspect-square flex-shrink-0">
            <Image
              src="/images/peach-unredeemed.png"
              alt="Unredeemed Peach Box NFT"
              fill
              className="object-contain"
              priority
            />
          </div>
          <MoveRight className="text-brand-red w-10 h-10 flex-shrink-0 rotate-90 md:rotate-0" />
          <div className="relative w-full md:max-w-[340px] aspect-square flex-shrink-0">
            <Image
              src="/images/peach-redeemed.png"
              alt="Redeemed Peach Box NFT"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-[10vw] py-20 bg-brand-gray">
        <div className="mb-12">
          <p className="font-display font-bold uppercase text-brand-orange text-sm mb-3">
            How It Works
          </p>
          <h2 className="font-heading text-[50px] text-brand-white">
            {/* PLACEHOLDER — replace with final section intro heading */}
            From Wallet to Doorstep
          </h2>
          <p className="font-sans text-brand-white/60 text-lg mt-3 max-w-xl">
            {/* PLACEHOLDER — replace with final How It Works intro */}
            No crypto experience needed. Here&apos;s how to get your peaches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map(({ step, title, description }) => (
            <div
              key={step}
              className="bg-brand-black rounded-[20px] p-[26px_29px] flex flex-col gap-3"
            >
              <span className="font-heading text-[40px] text-brand-orange leading-none">
                {step}
              </span>
              <h3 className="font-display font-bold uppercase text-brand-white text-xl">
                {title}
              </h3>
              <p className="font-sans text-brand-white/60 text-base">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Proof of Peach ── */}
      <section className="px-[10vw] py-20">
        <div className="mb-12">
          <p className="font-display font-bold uppercase text-brand-orange text-sm mb-3">
            Proof of Peach
          </p>
          <h2 className="font-heading text-[50px] text-brand-white">
            Real Peaches, Real People
          </h2>
          <p className="font-sans text-brand-white/60 text-lg mt-3 max-w-xl">
            Three seasons of Palisade peaches delivered to holders across the
            country.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          <div className="aspect-square relative rounded-[20px] overflow-hidden">
            <Image
              src="/images/proof-of-peach/peach-box-11.png"
              alt="Peach box"
              fill
              className="object-cover"
            />
          </div>
          <div className="aspect-square relative rounded-[20px] overflow-hidden">
            <Image
              src="/images/proof-of-peach/box-2.jpg"
              alt="Peach box season 1"
              fill
              className="object-cover"
            />
          </div>
          <div className="aspect-square relative rounded-[20px] overflow-hidden">
            <Image
              src="/images/proof-of-peach/freeze-dried.jpg"
              alt="Freeze dried peaches"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROOF_OF_PEACH_PLACEHOLDERS.map(({ season, quote, handle }) => (
            <div
              key={season}
              className="bg-brand-gray rounded-[20px] p-[26px_29px] flex flex-col gap-3"
            >
              <p className="font-sans text-brand-white/70 text-base italic">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-orange/30" />
                <div>
                  <p className="font-display font-bold text-brand-white text-sm">
                    {handle}
                  </p>
                  <p className="text-brand-blue text-xs">{season} holder</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="px-[10vw] py-20 flex flex-col items-center gap-6 text-center">
        <h2 className="font-heading text-[50px] text-brand-white">
          Ready to Get Your Peaches?
        </h2>
        <p className="font-sans text-brand-white/60 text-lg max-w-md">
          Season Four is live. Mint your Peach Box NFT before they&apos;re gone.
        </p>
        <Link href="/buy">
          <Button variant="brand-orange" size="lg">
            GET YOUR PEACHES
          </Button>
        </Link>
      </section>
    </div>
  );
}
