"use client";

import { useReadContract } from "wagmi";
import { ERC20_ABI, getContracts } from "@/lib/contracts";

export function usePaymentTokenAllowance(
  owner: `0x${string}` | undefined,
  spender: `0x${string}` | undefined
) {
  const { paymentERC20 } = getContracts();

  return useReadContract({
    address: paymentERC20,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: owner && spender ? [owner, spender] : undefined,
    query: { enabled: !!owner && !!spender },
  });
}

export function usePaymentTokenBalance(account: `0x${string}` | undefined) {
  const { paymentERC20 } = getContracts();

  return useReadContract({
    address: paymentERC20,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: account ? [account] : undefined,
    query: { enabled: !!account },
  });
}
