"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useReadContract } from "wagmi";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import RedeemModal from "@/components/RedeemModal";
import GiftModal from "@/components/GiftModal";
import EmailPrompt from "@/components/EmailPrompt";
import {
  useRedemptionWindow,
  useTokenState,
} from "@/lib/hooks/useContractReads";
import { getNFTsForOwner, type AlchemyNFT } from "@/lib/alchemy";
import { Download } from "lucide-react";

type TokenStatus = "unredeemed" | "redeemed" | "ordered";

interface OrderInfo {
  ordered: boolean;
  orderedAt?: string;
  orderNumber?: string;
}

// Per-NFT card component (needs its own hook calls)
function NFTCard({
  nft,
  ownerAddress,
  redemptionWindow,
  onRefresh,
}: {
  nft: AlchemyNFT;
  ownerAddress: string;
  redemptionWindow: ReturnType<typeof useRedemptionWindow>;
  onRefresh: () => void;
}) {
  const tokenId = BigInt(nft.id.tokenId);
  const { data: tokenStateData, refetch: refetchState } =
    useTokenState(tokenId);
  const tokenStateValue =
    tokenStateData !== undefined ? Number(tokenStateData) : null;

  const [redeemOpen, setRedeemOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);

  const isRedeemed = tokenStateValue === 1;
  const status: TokenStatus = orderInfo?.ordered
    ? "ordered"
    : isRedeemed
      ? "redeemed"
      : "unredeemed";

  const statusConfig = {
    unredeemed: { label: "Unredeemed", color: "bg-brand-orange" },
    redeemed: { label: "Redeemed – Pending Order", color: "bg-brand-blue" },
    ordered: { label: "Ordered", color: "bg-brand-green" },
  }[status];

  useEffect(() => {
    if (!isRedeemed) return;
    setOrderLoading(true);
    fetch(`/api/order?tokenId=${nft.id.tokenId}&wallet=${ownerAddress}`)
      .then((r) => r.json())
      .then((data) => setOrderInfo(data))
      .catch(() => setOrderInfo(null))
      .finally(() => setOrderLoading(false));
  }, [isRedeemed, nft.id.tokenId, ownerAddress]);

  const imageUrl =
    nft.media[0]?.gateway ||
    nft.metadata?.image ||
    "/images/nft-placeholder.png";

  const mediaDownloadUrl = nft.media[0]?.gateway || null;
  const attributes = nft.metadata?.attributes ?? [];
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <div className="bg-brand-gray rounded-[20px] p-[32px_36px] w-full max-w-[420px] flex flex-col gap-5">
      {/* NFT Image */}
      <div className="relative w-full aspect-[2/3] rounded-[12px] overflow-hidden bg-brand-black">
        <Image
          src={imageUrl}
          alt={nft.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Token info */}
      <div className="flex items-center justify-between">
        <p className="font-heading text-2xl text-brand-white">{nft.title}</p>
        <span
          className={`inline-block px-3 h-[28px] leading-[2.5] ${statusConfig.color} text-black font-display font-bold uppercase text-xs rounded-full`}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Collectable Details */}
      {(attributes.length > 0 || mediaDownloadUrl) && (
        <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-xs font-display font-bold uppercase text-brand-white/50 hover:text-brand-white/80 transition-colors border-t border-dotted border-white/10 pt-3">
            Collectable Details
            <span className="text-base leading-none">
              {detailsOpen ? "−" : "+"}
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {mediaDownloadUrl && (
              <a
                href={mediaDownloadUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3"
              >
                <button className="flex gap-2 items-baseline text-brand-white/80 text-sm hover:cursor-pointer hover:opacity-70 transition-opacity font-display font-bold italic uppercase">
                  Download Your Peach Image <Download width={14} height={14} />
                </button>
              </a>
            )}

            <dl className="mt-2 flex flex-col gap-1">
              {attributes.map((attr) => (
                <div
                  key={attr.trait_type}
                  className="flex justify-between text-xs font-sans"
                >
                  <dt className="text-brand-white/50">{attr.trait_type}</dt>
                  <dd className="text-brand-white font-medium">{attr.value}</dd>
                </div>
              ))}
            </dl>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 border-t border-dotted border-white/10 pt-4">
        {/* Redeem */}
        {!isRedeemed && redemptionWindow.isOpen && (
          <Button
            variant="brand-orange"
            size="sm"
            onClick={() => setRedeemOpen(true)}
          >
            REDEEM
          </Button>
        )}

        {/* Outside redemption window message */}
        {!isRedeemed && !redemptionWindow.isOpen && (
          <p
            className={`inline-block px-5 h-[45px] leading-[2.9] bg-brand-orange text-brand-black font-display font-bold uppercase text-base rounded-full`}
          >
            {redemptionWindow.hasNotStarted
              ? "Redemption opens soon."
              : "Redemption window has closed."}
          </p>
        )}

        {/* Order Peaches */}
        {isRedeemed && !orderInfo?.ordered && !orderLoading && (
          <a
            href={`/api/order?tokenId=${nft.id.tokenId}&wallet=${ownerAddress}&redirect=true`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="brand-green" size="sm" className="w-full">
              ORDER PEACHES
            </Button>
          </a>
        )}

        {/* Order status */}
        {orderInfo?.ordered && (
          <div className="text-sm font-sans text-brand-white/70">
            <span className="text-brand-green font-bold">Ordered</span>
            {orderInfo.orderedAt && (
              <span className="ml-1">
                on {new Date(orderInfo.orderedAt).toLocaleDateString()}
              </span>
            )}
            {orderInfo.orderNumber && (
              <span className="ml-1">(#{orderInfo.orderNumber})</span>
            )}
          </div>
        )}

        {/* Sell on market (placeholder) */}
        <div className="flex gap-3 mt-3">
          <Link href="/market">
            <Button variant="brand-blue" size="xs">
              Sell at the Market
            </Button>
          </Link>

          {/* Gift */}
          {!isRedeemed && (
            <Button
              variant="brand-blue"
              size="xs"
              onClick={() => setGiftOpen(true)}
            >
              GIFT TOKEN
            </Button>
          )}
        </div>
      </div>

      {/* Modals */}
      <RedeemModal
        tokenId={tokenId}
        open={redeemOpen}
        onClose={() => setRedeemOpen(false)}
        onSuccess={() => {
          refetchState();
          onRefresh();
        }}
      />
      <GiftModal
        tokenId={tokenId}
        ownerAddress={ownerAddress}
        open={giftOpen}
        onClose={() => setGiftOpen(false)}
        onSuccess={() => onRefresh()}
      />
    </div>
  );
}

export default function PeachesPage() {
  const { ready, authenticated, user, login } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const [nfts, setNfts] = useState<AlchemyNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasEmail, setHasEmail] = useState<boolean | null>(null);
  const [emailDismissed, setEmailDismissed] = useState(false);
  const redemptionWindow = useRedemptionWindow();

  console.log("nfts", nfts);

  const fetchNFTs = async () => {
    if (!walletAddress) return;
    setLoading(true);
    setError("");
    try {
      const data = await getNFTsForOwner(walletAddress);
      setNfts(data);
    } catch {
      setError("Could not load your Tokens. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkEmail = async () => {
    if (!walletAddress) return;
    try {
      const res = await fetch(`/api/contacts?wallet=${walletAddress}`);
      const data = await res.json();
      setHasEmail(data.hasEmail);
    } catch {
      setHasEmail(true); // don't show prompt if check fails
    }
  };

  useEffect(() => {
    if (authenticated && walletAddress) {
      fetchNFTs();
      checkEmail();
    }
  }, [authenticated, walletAddress]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-brand-blue font-sans">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-6">
        <Image
          src="/images/crate.png"
          alt="Peach Crate"
          width={200}
          height={200}
          className="object-contain"
        />
        <h1 className="font-heading text-3xl text-brand-white">Your Peaches</h1>
        <p className="font-sans text-lg text-brand-white/70 max-w-md">
          Connect your wallet to see your Peach Box Tokens.
        </p>
        <Button variant="brand-orange" size="lg" onClick={() => login()}>
          SIGN UP / SIGN IN
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-[10vw] py-16">
      <h1 className="font-heading text-3xl md:text-6xl text-brand-white mb-4">
        Your Peaches!
      </h1>

      {/* Redemption window banner */}
      {redemptionWindow.isOpen && (
        <div className="mb-8">
          <span className="inline-block px-5 h-[34px] leading-[2.5] bg-brand-green text-black font-display font-bold uppercase text-sm rounded-full">
            • REDEMPTION WINDOW OPEN •
          </span>
          <p className="text-brand-white/60 font-sans text-sm mt-2">
            Redeem your Peach Box Tokens now to order real peaches!
          </p>
        </div>
      )}
      {redemptionWindow.hasEnded && (
        <div className="mb-8">
          <span className="inline-block px-5 h-[34px] leading-[2.5] bg-brand-red text-black font-display font-bold uppercase text-sm rounded-full">
            • REDEMPTION CLOSED •
          </span>
          <p className="text-brand-white/60 font-sans text-sm mt-2">
            The redemption window has ended. You can still sell or gift your
            Tokens.
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-brand-blue font-sans">Loading your peaches...</div>
      )}

      {/* Error */}
      {error && <p className="text-brand-red font-sans">{error}</p>}

      {/* Empty state */}
      {!loading && !error && nfts.length === 0 && (
        <div className="flex flex-col gap-6 items-start">
          <p className="font-sans text-brand-white/70 text-lg">
            You don&apos;t have any Peach Box Tokens yet.
          </p>
          <Link href="/buy">
            <Button variant="brand-orange" size="lg">
              GET YOUR PEACHES
            </Button>
          </Link>
        </div>
      )}

      {/* NFT grid */}
      {!loading && nfts.length > 0 && (
        <div className="flex flex-col gap-8 max-w-[520px]">
          {nfts.map((nft) => (
            <NFTCard
              key={nft.id.tokenId}
              nft={nft}
              ownerAddress={walletAddress!}
              redemptionWindow={redemptionWindow}
              onRefresh={fetchNFTs}
            />
          ))}
        </div>
      )}

      {/* Email prompt */}
      {hasEmail === false && !emailDismissed && walletAddress && (
        <div className="my-10">
          <EmailPrompt
            walletAddress={walletAddress}
            onDismiss={() => setEmailDismissed(true)}
          />
        </div>
      )}
    </div>
  );
}
