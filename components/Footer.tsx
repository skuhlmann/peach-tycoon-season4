import Image from "next/image";
import Link from "next/link";
import { SEASON, TARGET_NETWORK } from "@/lib/constants";
import { getContracts } from "@/lib/contracts";
import { Bird, MessageCircle } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/buy", label: "Buy" },
  { href: "/peaches", label: "Your Peaches" },
  { href: "/market", label: "Market" },
  { href: "/about", label: "About" },
];

export default function Footer() {
  const { nft: contractAddress } = getContracts();
  const basescanBase =
    TARGET_NETWORK === "base"
      ? "https://basescan.org/address"
      : "https://sepolia.etherscan.io/address";
  const contractUrl = `${basescanBase}/${contractAddress}`;

  return (
    <footer className="bg-brand-orange text-brand-black px-[10vw] py-14">
      <div className="flex flex-col lg:flex-row justify-between gap-10 mb-10">
        {/* Section 1 — Logo */}
        <div className="flex-shrink-0">
          <Image
            src="/images/footer-logo.png"
            alt="Peach Tycoon"
            width={180}
            height={80}
            className="object-contain"
          />
        </div>

        {/* Section 2 — Nav */}
        <nav>
          <ul className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-heading text-xl hover:opacity-60 transition-opacity"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Section 3 — Socials */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <a
              href="https://twitter.com/PeachDropNFT"
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading text-xl hover:opacity-60 transition-opacity"
            >
              <Bird />
            </a>
            <a
              href="https://t.me/PeachDropNFT"
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading text-xl hover:opacity-60 transition-opacity flex items-center gap-1"
            >
              <MessageCircle />{" "}
              <span className="font-sans text-[9px]">
                (contact us on telegram)
              </span>
            </a>
          </div>
          <a
            href={contractUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading text-sm hover:opacity-60 transition-opacity"
          >
            Token Contract ↗
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-black/20 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm font-sans opacity-60">
        <span>
          © {new Date().getFullYear()} Peach Tycoon Season {SEASON}
        </span>
        <span>
          Made with ❤️ by{" "}
          <a
            href="https://www.metacartel.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            🌶️
          </a>
        </span>
      </div>
    </footer>
  );
}
