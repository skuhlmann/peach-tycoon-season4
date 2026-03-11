"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/buy", label: "Buy" },
  { href: "/peaches", label: "Your Peaches" },
  { href: "/market", label: "Market" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function NavBar() {
  const pathname = usePathname();
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [menuOpen, setMenuOpen] = useState(false);

  const walletAddress = user?.wallet?.address;

  return (
    <nav className="fixed top-0 w-full z-50 bg-brand-black py-5 px-4 md:px-10">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          {/* Desktop logo */}
          <div className="hidden md:flex items-center gap-2">
            <Image
              src="/images/peach-logo.png"
              alt="Peach"
              width={56}
              height={56}
              className="w-[56px]"
            />
            <Image
              src="/images/wordmark-peach.png"
              alt="Peach"
              width={97}
              height={56}
              className="w-[97px] mt-[10px]"
            />
            <Image
              src="/images/wordmark-tycoon.png"
              alt="Tycoon"
              width={210}
              height={56}
              className="w-[210px] mt-[10px]"
            />
          </div>
          {/* Mobile logos */}
          <div className="flex md:hidden items-center gap-2">
            <Image
              src="/images/peach-logo.png"
              alt="Peach"
              width={36}
              height={36}
              className="w-[36px]"
            />
            <Image
              src="/images/mobile-header-logo.png"
              alt="Peach Tycoon"
              width={60}
              height={60}
              className="w-[60px] mt-[5px]"
            />
          </div>
        </Link>

        {/* Hamburger (all screen sizes) */}
        <button
          className="text-brand-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Full-screen menu */}
      {menuOpen && (
        <div className="border-t-3 border-brand-orange fixed inset-0 top-[100px] z-[12] bg-brand-black flex flex-col px-6 pt-8 gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`font-heading text-3xl transition-colors hover:text-brand-orange ${
                pathname === link.href
                  ? "text-brand-orange"
                  : "text-brand-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4">
            {ready && (
              <>
                {authenticated && walletAddress ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/account"
                      onClick={() => setMenuOpen(false)}
                      className="font-display font-bold italic text-brand-blue text-xl"
                    >
                      {shortenAddress(walletAddress)}
                    </Link>
                    <Button
                      variant="brand-orange"
                      size="default"
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                    >
                      LOG OUT
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="brand-orange"
                    size="default"
                    onClick={() => {
                      login();
                      setMenuOpen(false);
                    }}
                  >
                    CONNECT
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
