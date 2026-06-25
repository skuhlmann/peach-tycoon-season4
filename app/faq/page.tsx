"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    q: "What is Peach Tycoon?",
    a: "Peach Tycoon is a seasonal project that connects Peach Tokens to real boxes of Palisade, Colorado peaches. Each season has a limited harvest allocation.",
  },
  {
    q: "Is Season 4 available?",
    a: "No. Season 4 is sold out. This year's allocation has been claimed, and the sale will reopen with a future seasonal drop.",
  },
  {
    q: "What is a Peach Token?",
    a: "A Peach Token is a blockchain reservation for one seasonal harvest box. During the redemption window, the token connects the digital reservation to a real box of peaches.",
  },
  {
    q: "How does the seasonal flow work?",
    a: "A limited sale opens for the season, Peach Tokens are claimed, Palisade farmers harvest at peak ripeness, token holders redeem during the redemption window, and boxes ship from the orchard.",
  },
  {
    q: "Why do you use tokens?",
    a: "Tokens make the harvest allocation visible and verifiable. They help the project coordinate a limited seasonal crop before peaches are picked, packed, and shipped.",
  },
  {
    q: "Why Palisade peaches?",
    a: "Palisade's sunny days, cool nights, high elevation, and mineral-rich soil create peaches with deep sweetness, strong aroma, and the kind of juice people wait all year for.",
  },
  {
    q: "When is the next season?",
    a: "The next drop will be announced when the next harvest allocation is ready. Come back next season for the next Palisade peach release.",
  },
  {
    q: "Which blockchain is this on?",
    a: "Season 4 uses Base, an Ethereum Layer 2 built for fast, low-cost transactions.",
  },
  {
    q: "What happened to previous seasons?",
    a: "Each season is tied to its own harvest allocation. Season 4 is its own drop, and future seasons will have their own details when they open.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen px-[10vw] py-16">
      <div className="mb-12">
        <p className="font-display font-bold uppercase text-brand-orange text-sm mb-3">
          FAQ
        </p>
        <h1 className="font-heading text-[56px] md:text-[80px] text-brand-white">
          Got Questions?
        </h1>
      </div>

      <div className="max-w-3xl">
        <Accordion multiple={false} className="flex flex-col gap-2">
          {FAQ_ITEMS.map(({ q, a }, i) => (
            <AccordionItem
              key={i}
              value={i}
              className="bg-brand-gray rounded-[20px] px-6 border-none"
            >
              <AccordionTrigger className="font-display font-bold text-brand-white text-left text-base md:text-lg py-5 hover:no-underline hover:text-brand-orange transition-colors">
                {q}
              </AccordionTrigger>
              <AccordionContent className="font-sans text-brand-white/70 text-base pb-5 leading-relaxed">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Shipping note */}
      <div className="mt-16 bg-brand-gray rounded-[20px] p-[26px_29px] max-w-2xl">
        <p className="font-display font-bold text-brand-orange text-lg mb-2">
          Shipping Info
        </p>
        <p className="font-sans text-brand-white/70 text-base">
          Peach boxes ship during the seasonal Palisade harvest window after
          tokens are redeemed. Season 4 is sold out.
        </p>
      </div>
    </div>
  );
}
