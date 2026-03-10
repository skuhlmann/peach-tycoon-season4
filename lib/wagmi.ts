import { createConfig, http } from "wagmi";
import { base, sepolia } from "wagmi/chains";
import { ALCHEMY_RPC } from "./constants";

export const wagmiConfig = createConfig({
  chains: [base, sepolia],
  transports: {
    [base.id]: http(ALCHEMY_RPC),
    [sepolia.id]: http(ALCHEMY_RPC),
  },
});
