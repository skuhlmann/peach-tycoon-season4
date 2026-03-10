"use client";

import { usePrivy, useFundWallet } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getContracts } from "@/lib/contracts";
import { TARGET_NETWORK } from "@/lib/constants";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function AccountPage() {
  const { ready, authenticated, user, logout } = usePrivy();
  const { fundWallet } = useFundWallet();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-brand-blue font-sans">Loading...</div>
      </div>
    );
  }

  const walletAddress = user.wallet?.address || "";
  const email = user.email?.address || "";
  const network = TARGET_NETWORK;
  const { nft: contractAddress } = getContracts();

  const basescanWalletUrl =
    network === "mainnet"
      ? `https://basescan.org/address/${walletAddress}`
      : `https://sepolia.etherscan.io/address/${walletAddress}`;

  return (
    <div className="min-h-screen px-[10vw] py-16">
      <h1 className="font-heading text-[56px] md:text-[80px] text-brand-white mb-10">
        My Account
      </h1>

      <div className="flex flex-col gap-6 max-w-md">
        {/* Wallet */}
        <div className="bg-brand-gray rounded-[20px] p-[26px_29px]">
          <p className="text-brand-blue text-xs uppercase font-display font-bold mb-2">
            Wallet Address
          </p>
          <p className="text-brand-white font-sans text-lg break-all">
            {walletAddress || "—"}
          </p>
          {walletAddress && (
            <a
              href={basescanWalletUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-orange text-sm hover:opacity-70 transition-opacity mt-2 inline-block"
            >
              View on Explorer ↗
            </a>
          )}
        </div>

        {/* Email */}
        <div className="bg-brand-gray rounded-[20px] p-[26px_29px]">
          <p className="text-brand-blue text-xs uppercase font-display font-bold mb-2">
            Email
          </p>
          <p className="text-brand-white font-sans text-lg">
            {email || "No email on file"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 mt-4">
          {user.wallet?.walletClientType === "privy" && (
            <Button
              variant="brand-green"
              size="default"
              onClick={() => fundWallet({ address: walletAddress })}
            >
              FUND WALLET
            </Button>
          )}
          <Button
            variant="brand-orange"
            size="default"
            onClick={() => logout()}
          >
            LOG OUT
          </Button>
        </div>
      </div>
    </div>
  );
}
