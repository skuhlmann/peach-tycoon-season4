"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// All answers marked [PLACEHOLDER] need final copy from the team
const FAQ_ITEMS = [
  {
    q: "What is a Peach Box NFT?",
    a: "[PLACEHOLDER] A Peach Box NFT is a token on the Base blockchain that represents the right to receive a real, physical box of Colorado peaches from Palisade, CO. Each NFT is unique, tradeable, and redeemable during the harvest season redemption window.",
  },
  {
    q: "How do I buy one?",
    a: "[PLACEHOLDER] Head to the Buy page, connect your wallet (or sign up with email), and mint a Peach Box NFT for 0.024 ETH or 50 USDC. If you hold the discount ERC20 token, you'll automatically receive 10% off.",
  },
  {
    q: "What wallet do I need? What if I don't have one?",
    a: "[PLACEHOLDER] You can use any browser wallet like MetaMask or Coinbase Wallet. If you don't have a wallet, just sign up with your email — we'll create a secure embedded wallet for you automatically using Privy.",
  },
  {
    q: "How do I pay?",
    a: "[PLACEHOLDER] You can pay with ETH (Base) or USDC. If you don't have crypto yet, tap the 'Fund Wallet' button after connecting to buy ETH directly with a debit card through Coinbase.",
  },
  {
    q: "What is the redemption window and how does it work?",
    a: "[PLACEHOLDER] The redemption window is the time period when you can exchange your NFT for real peaches. It typically aligns with the Colorado peach harvest (late July – September). During this window, you'll see a 'Redeem' button on your NFT. After redeeming on-chain, you'll be sent to complete your shipping address and order.",
  },
  {
    q: "Can I get peaches shipped internationally?",
    a: "[PLACEHOLDER] Yes! International orders are accepted. Fresh peaches ship domestically; international orders are handled by our fulfillment team. Please note that customs fees and import duties are the responsibility of the recipient.",
  },
  {
    q: "Can I sell my NFT?",
    a: "[PLACEHOLDER] Yes — unredeemed Peach Box NFTs can be bought and sold on the Peach Market (coming soon) or on OpenSea. Only unredeemed NFTs can be listed; once redeemed, the NFT is marked on-chain.",
  },
  {
    q: "Can I gift my NFT to someone?",
    a: "[PLACEHOLDER] Two ways to gift: (1) Transfer the NFT directly to another wallet from Your Peaches page using the 'Gift NFT' button. (2) When redeeming and placing your order, simply enter a different shipping address — the peaches will ship to that person instead. This is a great option if you want to send peaches as a gift without transferring the NFT.",
  },
  {
    q: "What happens if I miss the redemption window?",
    a: "[PLACEHOLDER] If you don't redeem your NFT during the window, you'll miss that season's peaches. However, you can still sell or gift the NFT. Future season details TBD.",
  },
  {
    q: "Which blockchain is this on and why?",
    a: "[PLACEHOLDER] Peach Tycoon Season 4 is on Base — an Ethereum Layer 2 built by Coinbase. Base offers fast, cheap transactions and great onboarding tools, making it easy for anyone to participate even without prior crypto experience.",
  },
  {
    q: "What are the fees?",
    a: "[PLACEHOLDER] The mint price is 0.024 ETH or 50 USDC. Gas fees on Base are typically very low (a few cents per transaction). There are no additional platform fees for minting or redeeming.",
  },
  {
    q: "What happened to previous season tokens?",
    a: "[PLACEHOLDER] Seasons 1–3 tokens were separate contracts. Each season is a fresh collection. Previous season tokens cannot be redeemed for Season 4 peaches. [Additional details about past seasons to be provided.]",
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
          {/* PLACEHOLDER — replace with final shipping availability for Season 4 */}
          [Season 4 shipping details — domestic and international availability,
          timing, any restrictions. To be provided.]
        </p>
      </div>
    </div>
  );
}
