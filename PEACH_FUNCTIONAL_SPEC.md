# Peach Tycoon Season Four — Functional Specification

## Overview

Peach Tycoon Season Four is a Web3 DApp on the Base blockchain that allows users to purchase Peach Box NFTs, which can be redeemed for a physical box of Colorado peaches (Palisade, CO), gifted/sold to others via a marketplace, or traded freely. This is the fourth season of the Peach Drop NFT project.

**Tech Stack (inherited from Forgotten Fruit)**

- Next.js 14+ (App Router)
- TypeScript
- Chakra UI
- Privy (authentication + embedded wallets)
- Viem + Wagmi (contract interactions)
- Base mainnet + Sepolia testnet

---

## Pages & Routes

### 1. Homepage `/`

**Purpose**: Introduce the project and guide new users through how it works.

**Sections**:

- **Hero**: Project name, tagline, primary CTA ("Get Your Peaches")
- **How It Works**: Step-by-step guide:
  1. Connect a wallet or sign up with email (Privy creates one)
  2. Fund your wallet with a debit card (Coinbase onramp via Privy)
  3. Buy a Peach Box NFT
  4. Redeem for real peaches, sell on the market, or gift to a friend
- **Proof of Peach**: Gallery section showcasing photos and testimonials from previous seasons (Season 1–3). Images sourced from project assets.
- **Footer CTA**: Link to buy page

---

### 2. Buy Page `/buy`

**Purpose**: Mint a Peach Box NFT.

**Features**:

- Display current mint price (fetched from contract)
- Display discounted price if wallet holds the discount ERC20 token
- Payment options:
  - Native ETH/Base ETH
  - USDC (ERC20)
- Wallet connection prompt if not authenticated
- "Fund Wallet" button linking to Privy Coinbase onramp if balance insufficient
- Mint button → executes contract `mint()` call
- Success state: confirmation message + link to "Your Peaches" page
- Sale states: `upcoming` (countdown), `ongoing` (active mint), `closed` (sold out / ended)

**Discount Logic**:

- Contract method `getMintPrice(address, isErc20)` returns user-specific price
- If wallet holds the discount ERC20 token, a reduced price is returned automatically
- Discount badge shown when applicable

---

### 3. Your Peaches `/peaches`

**Purpose**: Display the authenticated user's Peach Box NFTs and available actions.

**Features**:

- Grid of NFT cards showing token image, token ID, and status
- NFT status badge: `Unredeemed` / `Redeemed (Pending Order)` / `Ordered`
- Per-NFT actions (conditional on redemption window state and NFT status):
  - **Redeem**: Calls `redeem(tokenId)` on contract — only shown during redemption window
  - **Order Peaches**: Shown after redemption, before order placed — links to order flow
  - **Order Status**: Shows date ordered when already fulfilled
  - **Sell on Market**: Link to marketplace listing flow (when market is live)
  - **Gift**: Send NFT to another wallet address
- Email signup prompt (if user has no email on file — stored in Airtable)
- Empty state: CTA to buy page if no NFTs

**Redemption Window**:

- Controlled by a configured date range (start + end dates in constants)
- Shown/hidden based on current date

---

### 4. Redeem & Order Flow

**Two-step process**:

**Step 1 — Redeem (On-Chain)**

- User clicks "Redeem" on a peach NFT card
- Confirmation modal explaining what happens
- Calls `redeem(tokenId)` on the Peach Box NFT contract
- Transaction confirmation with loading state
- On success: NFT updates to "Redeemed" status, "Order Peaches" button appears

**Step 2 — Order Peaches (Off-Chain / Shopify)**

- User clicks "Order Peaches"
- Calls `/api/order?tokenId=X&wallet=0x...`
- API route logic:
  - Verify on-chain that tokenId has been redeemed by this wallet
  - Check Shopify order status for this tokenId
  - If not yet ordered: Return a Shopify checkout URL
  - If already ordered: Return order date and confirmation details
- User is redirected to Shopify checkout to enter shipping address and complete order
- On return: Show order confirmation state

**API Route `/api/order`** (placeholder implementation):

- Verify redemption status on-chain
- Query Shopify Orders API for `note_attributes` containing tokenId
- If no order found: Create/return Shopify checkout link with tokenId embedded
- If order found: Return `{ ordered: true, orderedAt: "ISO date" }`
- Full Shopify integration to be planned separately; stub returns a mock checkout URL in development

---

### 5. Peach Market `/market`

**Purpose**: Buy and sell unredeemed Peach Box NFTs peer-to-peer.

**Current Status**: Placeholder page

**Placeholder Content**:

- Description of how the market works
- "Coming Soon" / launch date if known
- Link to OpenSea or Rarible collection in the interim

**Future Implementation** (planned separately):

- Listing flow: User selects NFT, sets price, approves + lists via marketplace protocol (Rarible SDK or similar)
- Browse listings: Grid of active listings with price, token image, seller
- Buy flow: Purchase listed NFT in one transaction
- Only unredeemed NFTs can be listed (enforced in UI; contract may enforce too)

---

### 6. About `/about`

**Purpose**: Background on the project, peach farmers, the Palisade CO region, and the NFT artist.

**Sections**:

- **The Peaches**: Info about Palisade, CO peaches — region, elevation, flavor profile, harvest season
- **The Farmers**: Bio and photo of the partner peach farm(s)
- **The Artist**: Bio of the NFT artist who created the Peach Box artwork
- **The Project**: Brief history of Peach Drop NFT (Seasons 1–3), MetaCartel involvement
- External links to farm website, artist portfolio

---

### 7. FAQ `/faq`

**Purpose**: Answer common questions.

**Topics** (to be written):

- What is a Peach Box NFT?
- How do I buy one?
- What wallet do I need / what if I don't have one?
- How do I pay?
- What is the redemption window and how does it work?
- Can I get peaches shipped internationally?
- Can I sell my NFT?
- Can I gift my NFT to someone?
- What happens if I miss the redemption window?
- Which blockchain is this on and why?
- What are the fees?
- Previous seasons — what happened to those tokens?

**Components**:

- Accordion-style Q&A
- Shipping availability section (static copy or widget for Season 4)

---

### 8. Account `/account`

**Purpose**: User profile and wallet management.

**Features**:

- Display connected wallet address (ENS resolved if available)
- Display email (from Privy or Airtable)
- "Fund Wallet" button — opens Privy Coinbase onramp
- Logout button
- Link to Basescan for wallet address

---

## Authentication & Wallet (Privy)

**Login Methods**:

- Email (creates embedded wallet automatically)
- Browser wallet (MetaMask, Coinbase Wallet, etc.)

**Configuration**:

- Default chain: Base mainnet
- Supported chains: Base mainnet + Sepolia testnet
- Embedded wallet auto-creation enabled for email logins
- Coinbase onramp widget available for wallet funding

**Session Management**:

- Privy JWT used for server-side session validation where needed
- Wallet address used as primary user identifier across Airtable, contract calls

---

## Smart Contracts

### Peach Box NFT Contract (ERC-721)

**Functions used**:

- `mint()` — mint with native ETH
- `mintErc20()` — mint with USDC
- `redeem(tokenId)` — mark token as redeemed (burns or updates metadata)
- `getMintPrice(address, isErc20)` — returns user-specific price (discounted if eligible)
- `mintPrice()` — baseline ETH price
- `erc20MintPrice()` — baseline USDC price
- `tokenStatus(tokenId)` — returns 0 (unredeemed) or 1 (redeemed)

### Discount ERC-20 Token

- Held by eligible wallets to unlock discounted mint price
- Contract checks balance during `getMintPrice` call
- Distribution mechanism TBD (QR claim campaign, allow list, etc.)

### Payment Token

- USDC on Base (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`)

---

## API Routes

### `GET /api/order`

**Params**: `tokenId`, `wallet`
**Logic**:

1. Verify on-chain: `tokenStatus(tokenId) === 1` (redeemed) and owner/redeemer matches wallet
2. Query Shopify for existing order with this tokenId in metadata
3. If no order: Return Shopify checkout URL with tokenId embedded
4. If ordered: Return `{ ordered: true, orderedAt: "ISO date", orderNumber: "..." }`

**Stub behavior (pre-Shopify integration)**:

- Return a mock checkout URL
- Read/write order state from a local JSON file or Airtable for development

### `POST /api/contacts`

**Body**: `{ wallet, email }`

- Create or update contact record in Airtable

### `GET /api/contacts`

**Params**: `wallet`

- Return `{ hasEmail: boolean }`

---

## Email / CRM

- Airtable used as lightweight CRM
- Email captured post-login and stored against wallet address
- Used for: order notifications, season updates, marketing (opt-in)
- Prompt shown in "Your Peaches" page if no email on file

---

## Header & Footer

### Header (NavBar)

- Fixed top position
- Logo + "PEACH TYCOON" wordmark
- Navigation links: Home, Buy, Your Peaches, Market, About, FAQ
- Mobile: Hamburger menu
- Auth state: Show wallet address or "Connect" button
- Account link when authenticated

### Footer

- Navigation links (same as header)
- Social links: Twitter/X, Farcaster, Telegram
- Contract link: Basescan
- Attribution: MetaCartel
- Copyright / season info

---

## Design & Branding

- Color palette: Peach/orange tones, warm whites, earthy greens — distinct from Forgotten Fruit purple
- Typography: Clean, readable; seasonal/farm market aesthetic
- NFT artwork: To be provided by artist (peach box theme)
- Imagery: Real photos from Palisade CO farm + previous season deliveries (Proof of Peach)
- Responsive: Mobile-first, full desktop support

---

## Sale States

Controlled via a constant in `constants.ts`:

| State      | Behavior                                 |
| ---------- | ---------------------------------------- |
| `upcoming` | Show countdown timer, no mint button     |
| `ongoing`  | Active mint, price displayed             |
| `closed`   | Show "Sold Out" or season closed message |

---

## Redemption Window

Controlled via start/end date constants:

- Outside window: Redeem button hidden, informational message shown
- Inside window: Redeem button active
- After window closes: "Redemption has closed" message; NFTs can still be sold/gifted

---

## Key Functional Differences from Forgotten Fruit (Season 3)

| Feature            | Forgotten Fruit               | Peach Tycoon S4                      |
| ------------------ | ----------------------------- | ------------------------------------ |
| Product            | Wine bottles                  | Peach boxes                          |
| Checkout backend   | AWS Lambda (VinoShipper)      | Shopify (in-house Next.js API route) |
| Region             | Grand Valley, CO (wine)       | Palisade, CO (peaches)               |
| Discount mechanism | DAO loot tokens (QR campaign) | Discount ERC20 (TBD distribution)    |
| NFT art theme      | Skele-grapes                  | Peach boxes                          |

---

## Open Questions / To Be Planned

1. **Shopify Integration Details**: Exact product/variant IDs, order metadata schema, webhook for order confirmation
2. **Discount Distribution**: QR campaign, allow list, public claim, or existing holder snapshot?
3. **Marketplace Protocol**: Rarible SDK (as in S3) or OpenSea Seaport or simple custom escrow?
4. **NFT Contract**: New deployment or extension of existing contract? Who deploys?
5. **Redemption Verification**: Does contract emit a `Redeemed` event or update token metadata? How does Shopify API route verify?
6. **International Shipping**: Will Season 4 support international orders (freeze-dried peaches)?
7. **Proof of Peach Assets**: Which images from S1–S3 are available and approved for use?
8. **Domain / Deployment**: New domain (`peachtycoon.xyz`?), Vercel deployment
9. **Testnet**: Same Sepolia testnet setup or different?
10. **Gift Flow**: Simple wallet-to-wallet transfer via contract `transferFrom`, or guided UI flow?
