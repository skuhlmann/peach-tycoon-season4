"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { isAddress } from "viem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { nftAbi, getContracts } from "@/lib/contracts";

interface Props {
  tokenId: bigint;
  ownerAddress: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GiftModal({ tokenId, ownerAddress, open, onClose, onSuccess }: Props) {
  const [recipientAddress, setRecipientAddress] = useState("");
  const { nft: nftAddress } = getContracts();
  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  const isValidAddress = isAddress(recipientAddress);

  const handleGift = () => {
    if (!isValidAddress) return;
    writeContract({
      address: nftAddress,
      abi: nftAbi,
      functionName: "safeTransferFrom",
      args: [ownerAddress as `0x${string}`, recipientAddress as `0x${string}`, tokenId],
    });
  };

  if (isConfirmed) {
    onSuccess();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f1418] text-white rounded-[20px] flex flex-col items-center gap-4 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-brand-green font-display text-2xl">
            Gift Peach #{tokenId.toString()}
          </DialogTitle>
          <DialogDescription className="text-brand-white/70 font-sans text-center text-base pt-2">
            Transfer this Peach Box NFT to another wallet. The recipient will
            be able to redeem it for real peaches.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full flex flex-col gap-3">
          <Input
            placeholder="0x... recipient address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="border-brand-orange focus:ring-brand-orange focus:border-brand-orange bg-brand-gray text-white"
          />
          {recipientAddress && !isValidAddress && (
            <p className="text-brand-red text-xs font-sans">
              Please enter a valid Ethereum address.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 w-full items-center">
          <Button
            variant="brand-green"
            size="md"
            onClick={handleGift}
            disabled={!isValidAddress || isPending || isConfirming}
          >
            {isPending || isConfirming ? "SENDING..." : "GIFT NFT"}
          </Button>
          <button
            onClick={onClose}
            className="text-brand-blue text-sm hover:opacity-70 transition-opacity"
          >
            Cancel
          </button>
        </div>

        {error && (
          <p className="text-brand-red text-sm font-sans text-center">
            {error.message.includes("user rejected")
              ? "Transaction cancelled."
              : "Transfer failed. Please try again."}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
