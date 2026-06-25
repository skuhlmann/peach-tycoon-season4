"use client";

import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { nftAbi, getContracts } from "@/lib/contracts";

export function useMintPrice(address: `0x${string}` | undefined) {
  const { nft } = getContracts();
  const enabled = !!address;

  const ethPrice = useReadContract({
    address: nft,
    abi: nftAbi,
    functionName: "getMintPrice",
    args: address ? [address, false] : undefined,
    query: { enabled },
  });

  const erc20Price = useReadContract({
    address: nft,
    abi: nftAbi,
    functionName: "getMintPrice",
    args: address ? [address, true] : undefined,
    query: { enabled },
  });

  return { ethPrice, erc20Price };
}

export function useRedemptionWindow() {
  const { nft } = getContracts();
  const [now, setNow] = useState(0);

  useEffect(() => {
    const updateNow = () => setNow(Math.floor(Date.now() / 1000));
    updateNow();

    const interval = window.setInterval(updateNow, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const { data: startTimestamp } = useReadContract({
    address: nft,
    abi: nftAbi,
    functionName: "redemptionStart",
  });

  const { data: endTimestamp } = useReadContract({
    address: nft,
    abi: nftAbi,
    functionName: "redemptionEnd",
  });

  const start = startTimestamp ? Number(startTimestamp) : 0;
  const end = endTimestamp ? Number(endTimestamp) : 0;

  const isOpen = start > 0 && end > 0 && now >= start && now < end;
  const hasEnded = end > 0 && now >= end;
  const hasNotStarted = start > 0 && now < start;

  return { isOpen, hasEnded, hasNotStarted, start, end };
}

export function useTokenState(tokenId: bigint | undefined) {
  const { nft } = getContracts();

  return useReadContract({
    address: nft,
    abi: nftAbi,
    functionName: "tokenState",
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: { enabled: tokenId !== undefined },
  });
}

export function useTotalSupply() {
  const { nft } = getContracts();
  return useReadContract({
    address: nft,
    abi: nftAbi,
    functionName: "totalSupply",
  });
}

export function useMaxSupply() {
  const { nft } = getContracts();
  return useReadContract({
    address: nft,
    abi: nftAbi,
    functionName: "maxSupply",
  });
}

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as `0x${string}`;

export function useBaseMintPrice() {
  const { nft } = getContracts();

  const ethPrice = useReadContract({
    address: nft,
    abi: nftAbi,
    functionName: "getMintPrice",
    args: [ZERO_ADDRESS, false],
  });

  const erc20Price = useReadContract({
    address: nft,
    abi: nftAbi,
    functionName: "getMintPrice",
    args: [ZERO_ADDRESS, true],
  });

  return { ethPrice, erc20Price };
}
