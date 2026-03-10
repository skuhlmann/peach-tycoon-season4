import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SOCIAL_LINKS } from "@/lib/constants";

export default function MarketPage() {
  return (
    <div className="min-h-screen px-[10vw] py-16">
      <div className="mb-10">
        <span className="inline-block px-5 h-[34px] leading-[2.5] bg-brand-blue text-brand-black font-display font-bold uppercase text-sm rounded-full mb-6">
          • COMING SOON •
        </span>
        <h1 className="font-heading text-[56px] md:text-[80px] text-brand-white mb-6">
          Peach Market
        </h1>
        <p className="font-sans text-xl text-brand-white/70 max-w-xl">
          Buy and sell unredeemed Peach Box NFTs peer-to-peer. Set your price,
          list your box, and trade freely — all on-chain.
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-xl">
        <div className="bg-brand-gray rounded-[20px] p-[26px_29px]">
          <h2 className="font-display font-bold uppercase text-brand-orange text-xl mb-4">
            How It Will Work
          </h2>
          <ul className="font-sans text-brand-white/70 text-base space-y-3">
            <li className="flex gap-3">
              <span className="text-brand-orange font-bold shrink-0">→</span>
              List your unredeemed Peach Box NFT at any price
            </li>
            <li className="flex gap-3">
              <span className="text-brand-orange font-bold shrink-0">→</span>
              Browse active listings from other holders
            </li>
            <li className="flex gap-3">
              <span className="text-brand-orange font-bold shrink-0">→</span>
              Buy in one transaction — no wrapping required
            </li>
            <li className="flex gap-3">
              <span className="text-brand-orange font-bold shrink-0">→</span>
              Only unredeemed NFTs can be listed
            </li>
          </ul>
        </div>

        {/* Interim: OpenSea link */}
        <div className="bg-brand-gray rounded-[20px] p-[26px_29px]">
          <p className="font-display font-bold uppercase text-brand-blue text-sm mb-2">
            In the Meantime
          </p>
          <p className="font-sans text-brand-white/70 text-base mb-4">
            You can trade Peach Box NFTs on OpenSea right now while the native
            market is being built.
          </p>
          {SOCIAL_LINKS.opensea ? (
            <a
              href={SOCIAL_LINKS.opensea}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="brand-blue" size="default">
                VIEW ON OPENSEA
              </Button>
            </a>
          ) : (
            <p className="text-brand-white/30 text-sm font-sans italic">
              OpenSea collection link available after mainnet launch.
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <Link href="/peaches">
            <Button variant="brand-orange" size="default">
              YOUR PEACHES
            </Button>
          </Link>
          <Link href="/buy">
            <Button variant="brand-green" size="default">
              BUY NOW
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
