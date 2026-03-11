"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePrivy, useFundWallet } from "@privy-io/react-auth";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
  useConnection,
} from "wagmi";
import { formatEther } from "viem";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SaleStateBadge from "@/components/SaleStateBadge";
import CountdownTimer from "@/components/CountdownTimer";
import {
  useMintPrice,
  useTotalSupply,
  useMaxSupply,
} from "@/lib/hooks/useContractReads";
import {
  usePaymentTokenAllowance,
  usePaymentTokenBalance,
} from "@/lib/hooks/useERC20";
import { nftAbi, ERC20_ABI, getContracts } from "@/lib/contracts";
import { SALE_STATE, SALE_START, CHAIN_OBJ } from "@/lib/constants";

type PaymentMethod = "eth" | "erc20";

function formatPaymentAmount(
  raw: bigint | undefined,
  decimals: number,
  paymentMethod: string,
): string {
  const unit = paymentMethod === "eth" ? "ETH" : "USDC";
  if (raw === undefined) return "—";
  if (decimals === 18) return `${Number(formatEther(raw)).toFixed(4)} ${unit}`;
  // 6-decimal USDC
  return `$${(Number(raw) / 10 ** decimals).toFixed(2)} ${unit}`;
}

export default function BuyPage() {
  const { ready, authenticated, user, login } = usePrivy();
  const { fundWallet } = useFundWallet();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("eth");
  const [txSuccess, setTxSuccess] = useState(false);

  const walletAddress = user?.wallet?.address as `0x${string}` | undefined;
  const { nft: nftAddress, paymentERC20, paymentDecimals } = getContracts();

  const { ethPrice, erc20Price } = useMintPrice(walletAddress);
  const { data: totalSupply } = useTotalSupply();
  const { data: maxSupply } = useMaxSupply();
  const { data: allowance, refetch: refetchAllowance } =
    usePaymentTokenAllowance(walletAddress, nftAddress);
  const { data: erc20Balance } = usePaymentTokenBalance(walletAddress);

  const connection = useConnection();
  const { mutate: switchChain, isPending: isSwitching } = useSwitchChain();
  const isWrongNetwork =
    authenticated && connection ? connection.chainId !== CHAIN_OBJ.id : false;

  const {
    writeContract: writeApprove,
    data: approveTxHash,
    isPending: isApprovePending,
    error: approveError,
  } = useWriteContract();
  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed } =
    useWaitForTransactionReceipt({ hash: approveTxHash });

  const {
    writeContract: writeMint,
    data: mintTxHash,
    isPending: isMintPending,
    error: mintError,
  } = useWriteContract();
  const { isLoading: isMintConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: mintTxHash });

  // Refetch allowance after approve confirms
  if (isApproveConfirmed) void refetchAllowance();

  const ethPriceRaw = ethPrice.data as bigint | undefined;
  const erc20PriceRaw = erc20Price.data as bigint | undefined;

  const isDiscounted =
    paymentMethod === "eth"
      ? ethPriceRaw !== undefined && ethPriceRaw < 24000000000000000n
      : erc20PriceRaw !== undefined && erc20PriceRaw < 11000000000000000n;

  const needsApproval =
    paymentMethod === "erc20" &&
    erc20PriceRaw !== undefined &&
    (allowance === undefined || (allowance as bigint) < erc20PriceRaw);

  const isSoldOut =
    totalSupply != null && maxSupply != null && totalSupply >= maxSupply;

  const handleApprove = () => {
    if (!erc20PriceRaw) return;
    writeApprove({
      address: paymentERC20,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [nftAddress, erc20PriceRaw],
    });
  };

  const handleMint = () => {
    if (paymentMethod === "eth" && ethPriceRaw !== undefined) {
      writeMint({
        address: nftAddress,
        abi: nftAbi,
        functionName: "mint",
        value: ethPriceRaw,
      });
    } else if (paymentMethod === "erc20" && erc20PriceRaw !== undefined) {
      writeMint({
        address: nftAddress,
        abi: nftAbi,
        functionName: "mintERC20",
        args: [erc20PriceRaw],
      });
    }
  };

  // After confirmation, show success
  const showSuccess = isConfirmed && !needsApproval;

  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
        <Image
          src="/images/crate.png"
          alt="Peach crate"
          width={300}
          height={300}
          className="w-full max-w-[500px] md:max-w-none md:w-auto md:max-h-[520px] object-contain"
        />
        <h1 className="font-heading text-[56px] text-brand-orange">
          You got the Peach!
        </h1>
        <p className="font-sans text-lg text-brand-white max-w-md">
          Your Peach Box Token has been minted. Head to Your Peaches to redeem
          it for a real box of Palisade, CO peaches.
        </p>
        <Link href="/peaches">
          <Button variant="brand-green" size="lg">
            VIEW YOUR PEACHES
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-[10vw] py-16">
      <div className="flex flex-col gap-4 mb-10">
        <SaleStateBadge />
        <h1 className="font-heading text-[56px] md:text-[80px] text-brand-white">
          Get Your Peaches!
        </h1>
        <p className="font-sans text-lg text-brand-white/70 max-w-xl">
          Buy a Peach Box Token on Base. Redeem it for a real box of Colorado
          peaches from Palisade, CO — or trade it on the market.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-10">
        <div className="flex flex-col gap-6">
          {/* Upcoming state — show countdown */}
          {SALE_STATE === "upcoming" && SALE_START && (
            <div>
              <p className="font-display font-bold text-brand-blue mb-4">
                Sale opens in:
              </p>
              <CountdownTimer targetDate={SALE_START} />
            </div>
          )}

          {/* Closed state */}
          {(SALE_STATE === "closed" || isSoldOut) && (
            <div className="bg-brand-gray rounded-[20px] p-8 max-w-md">
              <span className="inline-block px-5 h-[34px] leading-[2.5] bg-brand-red text-black font-display font-bold uppercase text-sm rounded-full mb-4">
                • SOLD OUT •
              </span>
              <p className="font-sans text-brand-white/70">
                All {maxSupply?.toString()} Peach Boxes have been claimed for
                Season 4. Stay tuned for Season 5.
              </p>
              {SALE_STATE !== "closed" && (
                <p className="text-brand-blue text-sm mt-2">
                  {totalSupply?.toString()} / {maxSupply?.toString()} minted
                </p>
              )}
            </div>
          )}

          {/* Active mint card */}
          {SALE_STATE === "ongoing" && !isSoldOut && (
            <div className="bg-brand-gray rounded-[20px] p-[29px_36px] max-w-md flex flex-col gap-6">
              {/* Supply indicator */}
              {totalSupply != null && maxSupply != null && (
                <p className="text-brand-blue text-sm font-display font-bold">
                  {totalSupply.toString()} / {maxSupply.toString()} minted
                </p>
              )}

              {/* Discount badge */}
              {isDiscounted && (
                <span className="inline-block px-5 h-[34px] leading-[2.5] bg-brand-orange text-brand-black font-display font-bold uppercase text-sm rounded-full w-fit">
                  • 10% DISCOUNT APPLIED •
                </span>
              )}

              {/* Price display */}
              <div>
                <p className="text-brand-blue text-xs uppercase font-display font-bold mb-1">
                  Price
                </p>
                <p className="font-heading text-[40px] text-brand-white leading-none">
                  {paymentMethod === "eth"
                    ? formatPaymentAmount(ethPriceRaw, 18, paymentMethod)
                    : formatPaymentAmount(
                        erc20PriceRaw,
                        paymentDecimals,
                        paymentMethod,
                      )}
                </p>
              </div>

              {/* Payment toggle */}
              <div className="border-b border-dotted border-white/20 pb-6">
                <p className="text-brand-blue text-xs uppercase font-display font-bold mb-3">
                  Pay With
                </p>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                  className="flex gap-3"
                >
                  {(["eth", "erc20"] as const).map((method) => (
                    <label
                      key={method}
                      className={`flex gap-1 mr-3 font-display font-bold italic uppercase text-sm transition-colors cursor-pointer ${
                        paymentMethod === method
                          ? "border-brand-orange text-brand-orange"
                          : "border-white/20 text-white/40 hover:border-white/40"
                      }`}
                    >
                      <RadioGroupItem value={method} />
                      {method === "eth" ? "ETH" : "USDC"}
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {/* Not connected */}
              {!authenticated && (
                <div className="flex flex-col gap-3">
                  <p className="text-brand-white/60 text-sm font-sans">
                    Connect a wallet or sign up with email to mint.
                  </p>
                  <Button
                    variant="brand-orange"
                    size="default"
                    onClick={() => login()}
                  >
                    SIGN UP / SIGN IN
                  </Button>
                </div>
              )}

              {/* Wrong network */}
              {authenticated && walletAddress && isWrongNetwork && (
                <div className="flex flex-col gap-3">
                  <p className="text-brand-red text-sm font-sans">
                    Wrong network. Switch to {CHAIN_OBJ.name} to mint.
                  </p>
                  <Button
                    variant="brand-orange"
                    size="default"
                    onClick={() => switchChain({ chainId: CHAIN_OBJ.id })}
                    disabled={isSwitching}
                  >
                    {isSwitching
                      ? "SWITCHING..."
                      : `SWITCH TO ${CHAIN_OBJ.name.toUpperCase()}`}
                  </Button>
                </div>
              )}

              {/* Connected — show mint or approve flow */}
              {authenticated && walletAddress && !isWrongNetwork && (
                <div className="flex flex-col gap-3">
                  {/* Fund wallet button if balance likely low */}
                  {user?.wallet?.walletClientType === "privy" && (
                    <button
                      onClick={() => fundWallet({ address: walletAddress })}
                      className="text-brand-blue text-sm underline text-left hover:opacity-70 transition-opacity"
                    >
                      Need funds? Buy ETH with a card →
                    </button>
                  )}

                  {/* Approve step for ERC20 */}
                  {needsApproval && (
                    <Button
                      variant="brand-blue"
                      size="default"
                      onClick={handleApprove}
                      disabled={isApprovePending || isApproveConfirming}
                    >
                      {isApprovePending || isApproveConfirming
                        ? "APPROVING..."
                        : "APPROVE USDC"}
                    </Button>
                  )}

                  {/* Mint button */}
                  <Button
                    variant="brand-orange"
                    size="lg"
                    onClick={handleMint}
                    disabled={
                      isMintPending ||
                      isMintConfirming ||
                      (paymentMethod === "erc20" && needsApproval)
                    }
                  >
                    {isMintPending || isMintConfirming
                      ? "BUYING..."
                      : "BUY NOW"}
                  </Button>

                  {/* Error */}
                  {(approveError || mintError) && (
                    <p className="text-brand-red text-sm font-sans">
                      {(approveError ?? mintError)!.message.includes(
                        "user rejected",
                      )
                        ? "Transaction cancelled."
                        : (approveError ?? mintError)!.message.includes(
                              "incorrect payment",
                            )
                          ? "Incorrect payment amount. Please try again."
                          : "Transaction failed. Please try again."}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Crate image */}
        <div className="flex-1 flex justify-center md:justify-end">
          <Image
            src="/images/crate.png"
            alt="Peach crate"
            width={600}
            height={600}
            className="w-full max-w-[500px] md:max-w-none md:w-auto md:max-h-[520px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}
