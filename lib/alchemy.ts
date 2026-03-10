import { ALCHEMY_RPC } from "./constants";
import { getContracts } from "./contracts";

export interface AlchemyNFT {
  contract: { address: string };
  id: {
    tokenId: string;
    tokenMetadata: { tokenType: string };
  };
  balance: string;
  title: string;
  description: string;
  tokenUri: { gateway: string; raw: string };
  media: Array<{ gateway: string; raw: string }>;
  metadata: {
    name?: string;
    description?: string;
    image?: string;
    external_url?: string;
    attributes?: Array<{ value: string; trait_type: string }>;
  };
  timeLastUpdated: string;
  contractMetadata: {
    name: string;
    symbol: string;
    totalSupply: string;
    tokenType: string;
    contractDeployer: string;
    deployedBlockNumber: number;
    openSea: Record<string, unknown>;
  };
  spamInfo?: { isSpam: string; classifications: string[] };
}

export interface AlchemyNFTResponse {
  ownedNfts: AlchemyNFT[];
  totalCount: number;
  pageKey?: string;
}

export async function getNFTsForOwner(
  ownerAddress: string,
): Promise<AlchemyNFT[]> {
  const { nft: contractAddress } = getContracts();
  // const baseUrl = getAlchemyBaseUrl();
  const url = `${ALCHEMY_RPC}/getNFTsForOwner?owner=${ownerAddress}&contractAddresses[]=${contractAddress}&withMetadata=true&pageSize=100`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Alchemy API error: ${res.status}`);
  }
  const data: AlchemyNFTResponse = await res.json();
  return data.ownedNfts;
}
