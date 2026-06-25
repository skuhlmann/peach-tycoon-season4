"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { nftAbi, getContracts } from "@/lib/contracts";

interface Props {
  tokenId: bigint;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RedeemModal({
  tokenId,
  open,
  onClose,
  onSuccess,
}: Props) {
  const { nft: nftAddress } = getContracts();
  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const handleRedeem = () => {
    writeContract({
      address: nftAddress,
      abi: nftAbi,
      functionName: "redeem",
      args: [tokenId],
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
          <DialogTitle className="text-brand-orange font-display text-2xl">
            Redeem Peach #{tokenId.toString()}
          </DialogTitle>
          <DialogDescription className="text-brand-white/70 font-sans text-center text-base pt-2">
            Redeeming this Token marks it as used on-chain. You&apos;ll then be
            able to place your order for a real box of Palisade, CO peaches.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 w-full items-center">
          <Button
            variant="brand-orange"
            size="md"
            onClick={handleRedeem}
            disabled={isPending || isConfirming}
          >
            {isPending || isConfirming ? "REDEEMING..." : "REDEEM"}
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
              : "Redemption failed. Please try again."}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
