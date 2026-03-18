import nftAbi from "@/lib/abis/nft.json";
import { TARGET_NETWORK } from "./constants";

export { nftAbi };

export const ERC20_ABI = [
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export type Network = "sepolia" | "base";

export const CONTRACTS = {
  sepolia: {
    nft: "0x82Db219d098b4EC1885161A9109A742660b480B2" as `0x${string}`,
    discountERC20:
      "0xaf14FBD014dD12368104D293D6efb913cD5355a6" as `0x${string}`,
    paymentERC20: "0x53c8156592A64E949A4736c6D3309002fa0b2Aba" as `0x${string}`,
    paymentDecimals: 18,
  },
  base: {
    nft: (process.env.NEXT_PUBLIC_NFT_CONTRACT_MAINNET ||
      "0x625185ccDD81B3c0C3E015C7FC616A9Bf75e2F2f") as `0x${string}`,
    discountERC20:
      "0x6D83138a5fF65E0F32076602d3210fa3ea955E8E" as `0x${string}`,
    paymentERC20: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`,
    paymentDecimals: 6,
  },
} as const;

export function getContracts() {
  return CONTRACTS[TARGET_NETWORK as Network];
}
