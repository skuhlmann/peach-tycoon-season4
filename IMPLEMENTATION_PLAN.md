# Peach Tycoon S4 — Implementation Plan

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS + shadcn/ui** _(style guide specifies this; supersedes Chakra UI mention in spec)_
- **Privy** — auth + embedded wallets + Coinbase onramp
- **Viem + Wagmi** — contract reads/writes
- **Alchemy NFT API** — enumerate tokens by owner (contract does not implement ERC721Enumerable)
- **Base mainnet + Sepolia testnet**

---

## Project Structure

```
pt-dapp/
├── app/
│   ├── layout.tsx              # Root layout: fonts, NavBar, Footer, Privy + Wagmi providers
│   ├── globals.css             # CSS vars, @font-face (Helsinki), Typekit import, body styles
│   ├── page.tsx                # Homepage /
│   ├── buy/
│   │   └── page.tsx            # Mint page /buy
│   ├── peaches/
│   │   └── page.tsx            # User's NFTs /peaches
│   ├── market/
│   │   └── page.tsx            # Placeholder market /market
│   ├── about/
│   │   └── page.tsx            # About /about
│   ├── faq/
│   │   └── page.tsx            # FAQ /faq
│   ├── account/
│   │   └── page.tsx            # Account /account
│   └── api/
│       ├── order/
│       │   └── route.ts        # GET /api/order (Shopify stub → full integration)
│       └── contacts/
│           └── route.ts        # GET + POST /api/contacts (Airtable)
├── components/
│   ├── ui/                     # shadcn/ui primitives (Button, Card, Dialog, Input, etc.)
│   ├── NavBar.tsx              # Fixed nav, auth state, hamburger menu
│   ├── Footer.tsx              # Orange footer, nav links, social icons
│   ├── NFTCard.tsx             # NFT display card with status badge + action buttons
│   ├── MintCard.tsx            # Mint price + payment selection + mint button
│   ├── SaleStateBadge.tsx      # • UPCOMING • / • SALE OPEN • / • SOLD OUT •
│   ├── RedeemModal.tsx         # Confirmation dialog before redeem tx
│   ├── GiftModal.tsx           # Enter address + send NFT
│   ├── CountdownTimer.tsx      # For "upcoming" sale state
│   ├── EmailPrompt.tsx         # Email capture shown in /peaches
│   └── ProofOfPeachGallery.tsx # Photo + testimonial grid (Homepage)
├── lib/
│   ├── contracts.ts            # ABIs, contract addresses, read/write helpers
│   ├── constants.ts            # Sale state, redemption window dates, prices, chain config
│   ├── airtable.ts             # Airtable client helpers
│   └── shopify.ts              # Shopify API helpers (stub + full)
├── public/
│   ├── fonts/
│   │   ├── helsinki-webfont.woff2
│   │   └── helsinki-webfont.woff
│   └── images/
│       ├── logo/               # Avatar, wordmarks (desktop + mobile + footer)
│       ├── proof-of-peach/     # S1–S3 delivery/farm photos
│       └── nft/                # NFT artwork placeholder
├── tailwind.config.ts
└── .env.local                  # All secrets (see missing info doc)
```

---

## Implementation Phases

### Phase 1 — Scaffolding & Design System

1. Init Next.js 14 project with TypeScript and App Router
2. Install and configure Tailwind CSS
3. Init shadcn/ui (`npx shadcn@latest init`) — Default style, Neutral base, CSS vars on
4. Apply brand CSS variables and `globals.css` from style guide
5. Configure `tailwind.config.ts` with full brand color palette and font families
6. Add Helsinki WOFF/WOFF2 fonts to `public/fonts/`, register with `@font-face`
7. Add Adobe Typekit import (`rao1ahi`) in `globals.css`
8. Add Work Sans via `next/font/google` in `app/layout.tsx`
9. Add custom shadcn Button variants: `brand-orange`, `brand-green`, `brand-blue` with pill sizes
10. Build `NavBar` and `Footer` shell components with placeholder links/logos

### Phase 2 — Auth & Wallet Integration

11. Install Privy SDK (`@privy-io/react-auth`)
12. Install Viem + Wagmi
13. Configure Privy provider in root layout: Base mainnet default, Sepolia support, embedded wallets for email login
14. Wrap app with `WagmiProvider` + `QueryClientProvider`
15. Build auth UI in NavBar: "Connect" button → Privy modal, wallet address display, account link
16. Implement `Fund Wallet` button using Privy Coinbase onramp
17. Add `Account` page: wallet address, ENS resolution, email display, logout, Basescan link

### Phase 3 — Contract Integration

18. Add contract ABI from `reference/nft.json` and all addresses to `lib/contracts.ts`:
    - Sepolia NFT: `0x82Db219d098b4EC1885161A9109A742660b480B2`
    - Sepolia discount ERC20: `0xaf14FBD014dD12368104D293D6efb913cD5355a6`
    - Sepolia payment ERC20 (18-decimal test token): `0x53c8156592A64E949A4736c6D3309002fa0b2Aba`
    - Mainnet discount ERC20: `0x6D83138a5fF65E0F32076602d3210fa3ea955E8E`
    - Mainnet USDC: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
    - Mainnet NFT: TBD (env var)
19. Implement `constants.ts`: sale state enum, sale open/close dates (managed here since `mintOpen` is private on-chain)
20. Build read hooks using Wagmi `useReadContract`:
    - `useMintPrice(address)` → calls `getMintPrice(address, isErc20)`
    - `useTokenState(tokenId)` → reads public mapping `tokenState(tokenId)` (returns 0 or 1)
    - `useRedemptionWindow()` → reads `redemptionStart` and `redemptionEnd` public timestamps
    - `useTotalSupply()` → calls `totalSupply()`
    - `useTokenOwner(tokenId)` → calls `ownerOf(tokenId)`
21. Build NFT enumeration via **Alchemy NFT API** (`getNFTsForOwner`) — contract does not implement ERC721Enumerable so on-chain enumeration is not possible
22. Build write hooks using Wagmi `useWriteContract`:
    - `useMint()` → calls `mint()` with exact ETH value
    - `useMintERC20(amount)` → calls `mintERC20(amount)` (requires prior USDC `approve()`)
    - `useRedeem(tokenId)` → calls `redeem(tokenId)`
    - `useTransfer(tokenId, to)` → calls `transferFrom(from, to, tokenId)` (NFT gift)

### Phase 4 — Buy Page `/buy`

23. Fetch and display current ETH and USDC mint prices via `getMintPrice(address, isErc20)`
24. Show discount badge (10% off) when discounted price is returned
25. Implement sale state logic from `constants.ts`: `upcoming` (countdown), `ongoing` (mint active), `closed` (sold out or `totalSupply >= maxSupply`)
26. Build payment toggle: ETH / USDC selection
27. For USDC mint: check existing allowance; if insufficient, show "Approve USDC" step before mint button
28. Wallet-not-connected prompt with Privy login CTA
29. Low-balance detection + "Fund Wallet" button (Privy onramp)
30. Mint button: execute `mint()` with exact ETH value, or `mintERC20(amount)` after approval; show loading state, handle contract revert messages
31. Success state: confirmation message + link to `/peaches`

### Phase 5 — Your Peaches `/peaches`

32. Fetch user's NFTs via **Alchemy NFT API** `getNFTsForOwner` filtered to contract address
33. For each token, read `tokenState(tokenId)` on-chain (0 = unredeemed, 1 = redeemed)
34. Build `NFTCard` component: token image (from IPFS metadata), token ID, status badge
35. Token image: unredeemed tokens use `_baseURIUnredeemed/{id}.json`, redeemed use `_baseURIRedeemed/{id}.json` — both IPFS-hosted
36. Status badge logic: `Unredeemed` / `Redeemed (Pending Order)` / `Ordered`
37. Conditional action buttons per NFT:
    - **Redeem**: shown during redemption window + `tokenState == 0`
    - **Order Peaches**: shown when `tokenState == 1` + no order on file
    - **Order Status**: shown when order exists (date from `/api/order`)
    - **Sell on Market**: placeholder link (market not yet live)
    - **Gift NFT**: opens `GiftModal` — NFT transfer only, unredeemed tokens
38. `RedeemModal`: confirmation text → execute `redeem(tokenId)` tx → success state
39. `GiftModal`: address/ENS input → execute `safeTransferFrom` → success state
40. Redemption window: read `redemptionStart` + `redemptionEnd` from contract, compare to `Date.now()` for button visibility
41. `EmailPrompt`: shown if no email on file (checked via `GET /api/contacts?wallet=...`); calls `POST /api/contacts` on submit
42. Empty state: CTA to `/buy`

### Phase 6 — API Routes

43. `GET /api/order`:
    - Verify on-chain: call `tokenState(tokenId)` → must equal 1
    - Verify ownership: call `ownerOf(tokenId)` → must match `wallet` param
    - Query Shopify for existing order with tokenId in metadata
    - If ordered: return `{ ordered: true, orderedAt, orderNumber }`
    - If not ordered: return Shopify checkout URL with tokenId embedded
    - **Stub**: return mock checkout URL + read/write order state in Airtable until Shopify credentials provided
44. `POST /api/contacts`: create/update Airtable contact record `{ wallet, email }`
45. `GET /api/contacts`: return `{ hasEmail: boolean }` for wallet address

### Phase 7 — Homepage `/`

46. **Hero**: Project name (Helsinki), tagline, large "GET YOUR PEACHES" CTA button
47. **How It Works**: 4-step guide with icons/illustrations
48. **Proof of Peach**: photo gallery + testimonial cards from S1–S3 (placeholder grid until assets provided)
49. **Footer CTA**: link to `/buy`

### Phase 8 — Supporting Pages

50. **About** `/about`: Sections for The Peaches, The Farmers, The Artist, The Project — placeholder copy with content structure in place; swap in real copy when provided
51. **FAQ** `/faq`: Accordion component with all 12 topic slots; placeholder text; note that gift FAQ answer covers both NFT transfer AND shipping-address gift method
52. **Market** `/market`: Placeholder page — Rarible protocol planned separately; link to OpenSea collection once URL is available

### Phase 9 — Polish & QA

53. Mobile responsiveness: hamburger menu, responsive card grids, touch-friendly buttons
54. Loading and error states throughout
55. ENS resolution for wallet display (account page + gift modal)
56. Testnet / mainnet environment toggle via `NEXT_PUBLIC_NETWORK` env var (switches contract addresses + payment token decimals: 18 on testnet, 6 on mainnet USDC)
57. Meta tags, favicon (Peach Avatar), `theme-color: #e46c1e` meta
58. Accessibility: focus states, aria labels on icon buttons

---

## Key `constants.ts` Values

```ts
// Sale state — managed here since mintOpen is private on-chain
export const SALE_STATE: "upcoming" | "ongoing" | "closed" = "ongoing";
export const SALE_START = new Date("TBD");
export const SALE_END = new Date("TBD");

// Redemption window is read from contract (redemptionStart / redemptionEnd public timestamps)
// No need to duplicate here

// Contract addresses — toggled by NEXT_PUBLIC_NETWORK env var
export const CONTRACTS = {
  testnet: {
    nft: "0x82Db219d098b4EC1885161A9109A742660b480B2",
    discountERC20: "0xaf14FBD014dD12368104D293D6efb913cD5355a6",
    paymentERC20: "0x53c8156592A64E949A4736c6D3309002fa0b2Aba", // 18 decimals
  },
  mainnet: {
    nft: process.env.NEXT_PUBLIC_NFT_CONTRACT_MAINNET!,
    discountERC20: "0x6D83138a5fF65E0F32076602d3210fa3ea955E8E",
    paymentERC20: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC, 6 decimals
  },
};

// Payment token decimal places differ between networks
export const PAYMENT_TOKEN_DECIMALS = {
  testnet: 18,
  mainnet: 6,
};
```

---

## Environment Variables

```
NEXT_PUBLIC_PRIVY_APP_ID=           # From Privy dashboard
NEXT_PUBLIC_NETWORK=testnet         # "testnet" | "mainnet"
NEXT_PUBLIC_NFT_CONTRACT_MAINNET=   # Set after mainnet deployment
NEXT_PUBLIC_ALCHEMY_API_KEY=        # For NFT enumeration API
AIRTABLE_API_KEY=                   # Personal access token
AIRTABLE_BASE_ID=
AIRTABLE_TABLE_NAME=
SHOPIFY_STORE_URL=                  # e.g. peachtycoon.myshopify.com
SHOPIFY_ACCESS_TOKEN=               # Admin API token
SHOPIFY_PRODUCT_VARIANT_ID=         # Peach Box variant
```

---

## Notes

- **Chakra UI vs Tailwind**: The functional spec references Chakra UI (inherited from Forgotten Fruit), but the style guide is explicitly built for Tailwind + shadcn/ui. This build uses Tailwind + shadcn/ui.
- **ERC721Enumerable not implemented**: The contract does not inherit ERC721Enumerable. The "Your Peaches" page must use Alchemy's `getNFTsForOwner` API to list a user's tokens.
- **Token IDs start at 1**: The counter starts at 0 but mints `tokenId + 1`, so the first token is #1.
- **USDC decimals differ by network**: Testnet payment ERC20 has 18 decimals; mainnet USDC has 6. Format all amounts accordingly.
- **`mintOpen` is private**: Sale state cannot be read from the contract. Manage via `SALE_STATE` in `constants.ts`.
- **Redemption window on-chain**: `redemptionStart` and `redemptionEnd` are public timestamps — read directly from contract, no duplication in constants needed.
- **Gift flow — two methods**: (1) NFT wallet transfer via `safeTransferFrom`. (2) During the order step, user enters a different shipping address — the physical peaches ship there without any token transfer.
- **International shipping**: Accepted; fulfillment team handles it. Order flow is the same — no special gating needed.
- **Shopify integration**: `/api/order` stubbed initially (mock URL + Airtable state). Swap in real Shopify logic when credentials arrive.
- **Marketplace**: `/market` is a placeholder — Rarible integration is a separate phase.
- **Discount ERC20 distribution**: Snapshot-based, handled outside this app. Frontend logic is already correct — reads discount from `getMintPrice` response.
