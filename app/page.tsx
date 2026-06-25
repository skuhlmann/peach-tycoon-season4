import Image from "next/image";
import { MoveRight, CheckCircle2, MapPin, Minus } from "lucide-react";

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Seasonal Sale Opens",
    description:
      "Each drop releases a limited number of Peach Tokens, each representing one harvest box.",
  },
  {
    step: "2",
    title: "Peaches Ripen in Palisade",
    description:
      "Peaches are picked when sugar levels peak. We coordinate directly with Palisade farms each season.",
  },
  {
    step: "3",
    title: "Token Holders Redeem",
    description:
      "During the redemption window, Peach Tokens are exchanged for real harvest boxes.",
  },
  {
    step: "4",
    title: "Boxes Ship From the Orchard",
    description:
      "Boxes are packed and shipped directly from Palisade during the harvest window.",
  },
];

const WHY_PALISADE = [
  "High elevation sunshine",
  "Cool mountain nights",
  "Mineral rich soil",
  "Perfect sugar development",
];

const WHAT_YOU_GET = [
  "13 tree-ripened peaches",
  "Protective orchard packaging",
  "Harvest information card",
  "Redemption tracking via Peach Token",
];

const WHY_TOKENS = [
  {
    icon: "🌱",
    title: "Reserve harvest early",
    description: "Lock in your box before the season begins.",
  },
  {
    icon: "🤝",
    title: "Fund farmers before picking",
    description: "Farmers get paid upfront so they can focus on the crop.",
  },
  {
    icon: "📦",
    title: "Predict shipping volume",
    description: "Tokens let us plan exactly how many boxes to prepare.",
  },
  {
    icon: "✓",
    title: "Track redemption clearly",
    description: "Each token shows whether its harvest box has been redeemed.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex flex-col lg:flex-row items-center justify-around px-[8vw] pt-16 pb-24 gap-12 overflow-hidden">
        {/* Background farm image with dark overlay */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/about-farms.jpg"
            alt=""
            fill
            className="object-cover object-center opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/90 to-brand-black/60" />
        </div>

        {/* Left — Text */}
        <div className="flex flex-col gap-6 max-w-lg flex-none z-10">
          <span className="inline-flex items-center gap-2 px-5 h-[34px] bg-brand-green text-black font-display font-bold uppercase text-sm rounded-full w-fit">
            • SEASON 4 SOLD OUT •
          </span>

          <h1 className="font-heading text-[52px] md:text-[72px] lg:text-[80px] text-brand-white leading-[1] tracking-tight">
            The Best Peaches in America
            <span className="text-brand-orange">
              <Minus />
            </span>
            Delivered to Your Door.
          </h1>

          <p className="font-sans text-lg text-brand-white/70 max-w-md leading-relaxed">
            Tree-ripened Palisade peaches picked at peak sweetness and shipped
            directly from the orchard.
          </p>
          <p className="font-sans text-lg text-brand-white/70 max-w-md leading-relaxed">
            Season 4{" "}
            <span className="text-brand-white font-semibold">
              Farmer&apos;s Dozen boxes
            </span>{" "}
            are sold out. Come back next season for the next harvest drop.
          </p>

          <span className="inline-flex items-center justify-center px-6 py-4 bg-brand-orange text-brand-black font-display font-bold uppercase text-base rounded-full w-fit mt-2">
            Come Back Next Season
          </span>
        </div>

        {/* Right — Visuals */}
        <div className="flex-1 z-10 max-w-[720px] w-full">
          {/* Bordered card containing both the hero image and token pair */}
          <div className="relative w-full rounded-[28px] overflow-hidden border border-white/10 bg-brand-gray/40 backdrop-blur-sm">
            {/* Orange glow behind card */}
            <div className="absolute inset-0 bg-brand-orange/10 blur-3xl" />

            {/* Hero peach image — tall */}
            <div className="relative w-full aspect-[4/3]">
              <Image
                src="/images/proof-of-peach/peach-hero-1.jpg"
                alt="Fresh Palisade peaches on the tree"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-black/80" />
            </div>

            {/* Token pair — inside card, overlapping the image bottom */}
            <div className="relative flex items-center justify-center gap-4 px-6 py-5 bg-brand-black/60 backdrop-blur-sm border-t border-white/10">
              <div className="relative w-[100px] md:w-[120px] aspect-square flex-shrink-0">
                <Image
                  src="/images/peach-unredeemed.png"
                  alt="Unredeemed Peach Box Token"
                  fill
                  className="object-contain"
                />
              </div>
              <MoveRight className="text-brand-orange/60 w-6 h-6 flex-shrink-0" />
              <div className="relative w-[100px] md:w-[120px] aspect-square flex-shrink-0">
                <Image
                  src="/images/peach-redeemed.png"
                  alt="Redeemed Peach Box Token"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-[8vw] py-24 bg-brand-gray">
        <div className="mb-14">
          <p className="font-display font-bold uppercase text-brand-orange text-sm mb-3 tracking-widest">
            How It Works
          </p>
          <h2 className="font-heading text-[46px] md:text-[58px] text-brand-white leading-tight">
            Seasonal Tokens.
            <br />
            Real Harvests.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOW_IT_WORKS.map(({ step, title, description }) => (
            <div
              key={step}
              className="bg-brand-black rounded-[20px] p-7 flex flex-col gap-4 border border-white/5 hover:border-brand-orange/30 transition-colors"
            >
              <span className="font-heading text-[48px] text-brand-orange leading-none">
                {step}
              </span>
              <h3 className="font-display font-bold uppercase text-brand-white text-base leading-snug">
                {title}
              </h3>
              <p className="font-sans text-brand-white/55 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 font-sans text-brand-blue text-sm text-center italic">
          Season 4 is sold out. The next drop will open with a new seasonal
          allocation.
        </p>
      </section>

      {/* ── Proof of Peach ── */}
      <section className="px-[8vw] py-24">
        <div className="mb-12">
          <p className="font-display font-bold uppercase text-brand-orange text-sm mb-3 tracking-widest">
            Proof of Peach
          </p>
          <h2 className="font-heading text-[46px] md:text-[58px] text-brand-white leading-tight">
            Real Peaches.
            <br />
            Real People.
          </h2>
          <p className="font-sans text-brand-white/60 text-lg mt-4">
            Over{" "}
            <span className="text-brand-white font-semibold">3 seasons</span> of
            peach boxes delivered nationwide.
          </p>

          {/* Bullet proof points */}
          <ul className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-8">
            {[
              "Direct from Palisade farms",
              "Picked within 24 hours of shipping",
              "No cold storage warehouses",
            ].map((point) => (
              <li key={point} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span className="font-sans text-brand-white/70 text-sm">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Image grid — 2×3 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-14">
          {[
            {
              src: "/images/proof-of-peach/peach-box-11.png",
              alt: "Peach box",
            },
            {
              src: "/images/proof-of-peach/box-2.jpg",
              alt: "Peach box season 1",
            },
            {
              src: "/images/proof-of-peach/freeze-dried.jpg",
              alt: "Freeze dried peaches",
            },
            {
              src: "/images/proof-of-peach/box-1.jpg",
              alt: "Peach box delivery",
            },
            {
              src: "/images/proof-of-peach/peach-box-12.png",
              alt: "Peach box season 2",
            },
            {
              src: "/images/proof-of-peach/box-3.jpg",
              alt: "Happy peach holder",
            },
          ].map(({ src, alt }) => (
            <div
              key={src}
              className="aspect-square relative rounded-[16px] overflow-hidden bg-brand-gray"
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        {/* Testimonials 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROOF_OF_PEACH_PLACEHOLDERS.map(({ season, quote, handle }) => (
            <div
              key={season}
              className="bg-brand-gray rounded-[20px] p-7 flex flex-col gap-4 border border-white/5"
            >
              <p className="font-serif text-brand-white/70 text-base italic leading-relaxed">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-9 h-9 rounded-full bg-brand-orange/20 border border-brand-orange/30 flex-shrink-0" />
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
        */}
      </section>

      {/* ── Why Palisade ── */}
      <section className="px-[8vw] py-24 bg-brand-gray overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left — Text */}
          <div className="flex-1 max-w-lg">
            <p className="font-display font-bold uppercase text-brand-orange text-sm mb-3 tracking-widest">
              Origin
            </p>
            <h2 className="font-heading text-[46px] md:text-[58px] text-brand-white leading-tight mb-6">
              Why Palisade Peaches Are Different
            </h2>
            <p className="font-sans text-brand-white/60 text-lg leading-relaxed mb-8">
              Palisade sits on the western slope of the Rocky Mountains. The
              unique conditions create one of the best peach-growing climates in
              the world.
            </p>

            <ul className="flex flex-col gap-4 mb-8">
              {WHY_PALISADE.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-orange flex-shrink-0" />
                  <span className="font-sans text-brand-white/80 text-base">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            <p className="font-serif text-brand-white/50 text-base italic border-l-2 border-brand-orange/50 pl-4">
              When fully ripe, a Palisade peach is so juicy it runs down your
              arm.
            </p>
          </div>

          {/* Right — Image + location chip */}
          <div className="flex-1 max-w-[520px] w-full relative">
            {/* Placeholder for map/location visual */}
            <div className="absolute -top-4 -right-4 z-10 bg-brand-black border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-xl">
              <MapPin className="w-4 h-4 text-brand-orange" />
              <div>
                <p className="font-display font-bold text-brand-white text-xs uppercase tracking-wider">
                  Palisade, CO
                </p>
                <p className="font-sans text-brand-blue text-xs">
                  Western Slope · 4,700 ft elevation
                </p>
              </div>
            </div>

            <div className="relative w-full aspect-[4/5] rounded-[28px] overflow-hidden border border-white/10">
              <Image
                src="/images/about-palisade.jpeg"
                alt="Palisade, Colorado peach orchards"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent" />
              {/* Simple Colorado map placeholder */}
              <div className="absolute bottom-6 left-6 right-6 bg-brand-black/70 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/10">
                <p className="font-display font-bold uppercase text-brand-orange text-xs tracking-widest mb-1">
                  Colorado
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                  <span className="font-sans text-brand-white text-sm">
                    Palisade — Grand Junction area
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What You Get ── */}
      <section className="px-[8vw] py-24">
        <div className="bg-brand-gray rounded-[32px] overflow-hidden border border-white/5">
          <div className="flex flex-col lg:flex-row items-center gap-0">
            {/* Left — Crate image */}
            <div className="relative flex-1 w-full min-h-[340px] lg:min-h-[480px] bg-brand-black/40">
              <div className="absolute inset-0 bg-brand-orange/10 blur-3xl scale-75" />
              <Image
                src="/images/crate.png"
                alt="Farmer's Dozen Peach Box"
                fill
                className="object-contain p-10"
              />
            </div>

            {/* Right — Details */}
            <div className="flex-1 p-10 lg:p-14 flex flex-col gap-6">
              <div>
                <p className="font-display font-bold uppercase text-brand-orange text-sm mb-3 tracking-widest">
                  What You Get
                </p>
                <h2 className="font-heading text-[40px] md:text-[52px] text-brand-white leading-tight">
                  Farmer&apos;s Dozen Peach Box
                </h2>
              </div>

              <p className="font-sans text-brand-white/60 text-lg leading-relaxed">
                13 premium Palisade peaches. Harvested at peak ripeness and
                shipped straight from the orchard.
              </p>

              <div>
                <p className="font-display font-bold uppercase text-brand-white/40 text-xs tracking-widest mb-4">
                  Includes
                </p>
                <ul className="flex flex-col gap-3">
                  {WHAT_YOU_GET.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0" />
                      <span className="font-sans text-brand-white/80 text-base">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="font-sans text-brand-blue text-sm">
                Ships during each season&apos;s{" "}
                <span className="text-brand-white font-semibold">
                  peak harvest window.
                </span>
              </p>

              <span className="inline-flex items-center justify-center px-6 py-4 bg-brand-orange/15 border border-brand-orange/30 text-brand-orange font-display font-bold uppercase text-sm rounded-full w-fit mt-2">
                Season 4 Sold Out
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Tokens ── */}
      <section className="px-[8vw] py-24 bg-brand-gray">
        <div className="max-w-3xl mb-14">
          <p className="font-display font-bold uppercase text-brand-orange text-sm mb-3 tracking-widest">
            The Token Model
          </p>
          <h2 className="font-heading text-[46px] md:text-[58px] text-brand-white leading-tight mb-6">
            Why We Use Peach Tokens
          </h2>
          <p className="font-sans text-brand-white/60 text-lg leading-relaxed">
            Peach harvests are seasonal and unpredictable. Tokens let us
            coordinate directly with farmers — and give you flexibility.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {WHY_TOKENS.map(({ icon, title, description }) => (
            <div
              key={title}
              className="bg-brand-black rounded-[20px] p-7 flex gap-5 items-start border border-white/5 hover:border-brand-orange/20 transition-colors"
            >
              <span className="text-3xl flex-shrink-0 mt-0.5">{icon}</span>
              <div>
                <h3 className="font-display font-bold uppercase text-brand-white text-sm mb-2 tracking-wide">
                  {title}
                </h3>
                <p className="font-sans text-brand-white/55 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-[20px] px-8 py-6 max-w-xl">
          <p className="font-serif text-brand-white text-lg italic leading-relaxed">
            Think of it like{" "}
            <span className="text-brand-orange not-italic font-semibold">
              a tradable reservation for summer peaches.
            </span>
          </p>
        </div>
      </section>

      {/* ── Final CTA — Sold Out ── */}
      <section className="relative px-[8vw] py-32 flex flex-col items-center gap-8 text-center overflow-hidden">
        {/* Background image with warm overlay */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/about-waxbones.jpg"
            alt=""
            fill
            className="object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-brand-black/70 to-brand-black" />
          <div className="absolute inset-0 bg-brand-orange/10" />
        </div>

        <span className="inline-flex items-center gap-2 px-5 h-[34px] bg-brand-orange/20 border border-brand-orange/30 text-brand-orange font-display font-bold uppercase text-sm rounded-full">
          Season 4 Is Sold Out
        </span>

        <h2 className="font-heading text-[52px] md:text-[72px] lg:text-[88px] text-brand-white leading-[1] tracking-tight max-w-3xl">
          Come Back Next Season.
        </h2>

        <p className="font-sans text-brand-white/60 text-lg md:text-xl max-w-md leading-relaxed">
          Peach season only lasts a few weeks, and this year&apos;s allocation
          has been claimed.
          <br />
          We&apos;ll reopen for the next Palisade harvest.
        </p>
      </section>
    </div>
  );
}
