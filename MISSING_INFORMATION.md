# Peach Tycoon S4 — Missing Information

This document tracks all content, credentials, and decisions needed to complete the implementation. Items are grouped by category and priority. ✅ = resolved.

---

## 🔴 Blockers — Required Before Launch

### Smart Contracts

| Item                                       | Status                                          | Notes                            |
| ------------------------------------------ | ----------------------------------------------- | -------------------------------- |
| NFT contract address (Sepolia testnet)     | ✅ `0x82Db219d098b4EC1885161A9109A742660b480B2` | Starting here                    |
| NFT contract address (Base mainnet)        | ⏳ Pending                                      | Deployed internally when ready   |
| Full contract ABI                          | ✅ `reference/nft.json`                         |                                  |
| Discount ERC20 address (Sepolia)           | ✅ `0xaf14FBD014dD12368104D293D6efb913cD5355a6` |                                  |
| Discount ERC20 address (Base mainnet)      | ✅ `0x6D83138a5fF65E0F32076602d3210fa3ea955E8E` | From contract source             |
| Payment ERC20 address (Sepolia test token) | ✅ `0x53c8156592A64E949A4736c6D3309002fa0b2Aba` | 18-decimal test token            |
| Payment ERC20 address (Base mainnet USDC)  | ✅ `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |                                  |
| How does `redeem()` work?                  | ✅ Updates `tokenState` mapping: 0 → 1          | Public mapping, readable as view |
| Who deploys the contract?                  | ✅ Internal deployment                          |                                  |

**Key contract facts derived from source:**

- Max supply: **400 NFTs**
- ETH mint price: **0.024 ETH** (`24000000000000000` wei)
- ERC20 mint price: **50 USDC** on mainnet (`50000000`, 6 decimals); testnet uses 18-decimal test token (`11000000000000000`)
- Discount: **10% off** (applied automatically if wallet holds discount ERC20)
- Redemption window: stored as unix timestamps on-chain (`redemptionStart`, `redemptionEnd`) — readable from contract
- Token IDs start at **1** (not 0)
- `mintOpen` is **private** — sale state must be managed in `constants.ts` (cannot be read from contract)
- Contract does **not** implement ERC721Enumerable — a third-party NFT API (e.g. Alchemy) is needed to enumerate tokens by owner

### Auth & Services

| Item                                      | Status    | Notes                                                      |
| ----------------------------------------- | --------- | ---------------------------------------------------------- |
| Privy App ID (`NEXT_PUBLIC_PRIVY_APP_ID`) | ⏳ Needed | From Privy dashboard                                       |
| Airtable API key                          | ⏳ Needed | Personal access token                                      |
| Airtable Base ID                          | ⏳ Needed |                                                            |
| Airtable table name(s)                    | ⏳ Needed | e.g., "Contacts"                                           |
| Shopify store URL                         | ⏳ Needed | e.g., `peachtycoon.myshopify.com`                          |
| Shopify Admin API access token            | ⏳ Needed | For order creation/lookup                                  |
| Shopify product variant ID                | ⏳ Needed | The specific variant to add to checkout                    |
| Shopify order metadata schema             | ⏳ Needed | How tokenId is embedded in order (e.g., `note_attributes`) |

_Note: Shopify integration will be stubbed initially — `/api/order` returns mock data until credentials are provided._

### Sale Configuration

| Item                    | Status                                                    | Notes                                                                 |
| ----------------------- | --------------------------------------------------------- | --------------------------------------------------------------------- |
| ETH mint price          | ✅ `0.024 ETH`                                            | From contract; also readable via `mintPrice()`                        |
| ERC20 mint price        | ✅ `50 USDC` mainnet / testnet uses 18-decimal equivalent | From contract; also readable via `erc20MintPrice()`                   |
| Total NFT supply        | ✅ 400                                                    | From contract; also readable via `maxSupply()`                        |
| Redemption window dates | ✅ Readable from contract                                 | `redemptionStart` + `redemptionEnd` are public uint256 timestamps     |
| Sale start date         | ⏳ Needed                                                 | Not stored on-chain; manage via `constants.ts`                        |
| Sale end date           | ⏳ Needed                                                 | Not stored on-chain; `mintOpen` is private; manage via `constants.ts` |

---

## 🟡 Required Before Go-Live — Content & Assets

### Logo & Brand Assets

| Asset                          | Status    | Notes                                      |
| ------------------------------ | --------- | ------------------------------------------ |
| Peach Avatar image             | ⏳ Needed | 56px desktop / 36px mobile — favicon + nav |
| Peach Wordmark                 | ⏳ Needed | 97px wide, desktop nav                     |
| Tycoon Wordmark                | ⏳ Needed | 210px wide, desktop nav                    |
| Mobile logo (combined compact) | ⏳ Needed | For hamburger nav                          |
| Footer logo variant            | ⏳ Needed |                                            |
| Favicon (`.ico` or SVG)        | ⏳ Needed | Should use Peach Avatar                    |

### NFT Artwork

| Asset                            | Status    | Notes                                          |
| -------------------------------- | --------- | ---------------------------------------------- |
| Peach Box NFT artwork            | ⏳ Needed | From artist — used for NFT cards, hero imagery |
| Placeholder/unrevealed NFT image | ⏳ Needed | If metadata is hidden before reveal            |
| Artist name + bio                | ⏳ Needed | For About page                                 |
| Artist portfolio URL             | ⏳ Needed | For About page external link                   |

### Proof of Peach (Homepage Gallery)

| Asset                           | Status    | Notes                                              |
| ------------------------------- | --------- | -------------------------------------------------- |
| Photos from Season 1 deliveries | ⏳ Needed | Real photos of physical peach boxes delivered      |
| Photos from Season 2 deliveries | ⏳ Needed |                                                    |
| Photos from Season 3 deliveries | ⏳ Needed |                                                    |
| Farm photos (Palisade, CO)      | ⏳ Needed | Field/harvest photos                               |
| Testimonials from past holders  | ⏳ Needed | Text quotes with attribution (handle/ENS optional) |
| How many gallery items?         | ⏳ TBD    | Layout adapts to quantity                          |

### About Page Content

| Item                               | Status    | Notes                                             |
| ---------------------------------- | --------- | ------------------------------------------------- |
| Partner farm name(s)               | ⏳ Needed |                                                   |
| Farmer bio(s)                      | ⏳ Needed | Short paragraph + photo                           |
| Farmer photo(s)                    | ⏳ Needed |                                                   |
| Farm website URL                   | ⏳ Needed |                                                   |
| Palisade CO / peach region copy    | ⏳ Needed | Elevation, flavor profile, harvest season blurb   |
| Project history copy               | ⏳ Needed | Seasons 1–3 brief history, MetaCartel involvement |
| MetaCartel logo / attribution link | ⏳ Needed |                                                   |

### FAQ Content

All 12 FAQ items need final answers written:

1. What is a Peach Box NFT?
2. How do I buy one?
3. What wallet do I need / what if I don't have one?
4. How do I pay?
5. What is the redemption window and how does it work?
6. Can I get peaches shipped internationally? _(International orders accepted; fulfillment team handles them)_
7. Can I sell my NFT?
8. Can I gift my NFT to someone? _(Two gift methods: NFT transfer OR entering a different shipping address at order time)_
9. What happens if I miss the redemption window?
10. Which blockchain is this on and why?
11. What are the fees?
12. Previous seasons — what happened to those tokens?

### Homepage & General Copy

| Item                            | Status    | Notes                                  |
| ------------------------------- | --------- | -------------------------------------- |
| Hero tagline                    | ⏳ Needed | Short punchy line under "Peach Tycoon" |
| Hero subheading / descriptor    | ⏳ Needed | 1–2 sentence description               |
| How It Works section intro      | ⏳ Needed | Brief framing text                     |
| About + Market placeholder copy | ⏳ Needed | Section body text                      |

---

## 🟢 Decisions Needed — Architecture & Product

| Question                           | Status                        | Decision                                                                                                                                                              |
| ---------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **International shipping (S4)?**   | ✅ Resolved                   | Supported — fulfillment team handles international orders. Same order flow, messaging adjusted.                                                                       |
| **Discount ERC20 distribution**    | ✅ Resolved                   | Snapshot-based, handled outside this app. QR claim campaign (like Forgotten Fruit) may be reused — TBD, does not block build.                                         |
| **Marketplace protocol**           | ✅ Resolved                   | Likely Rarible; planned separately. `/market` is a placeholder.                                                                                                       |
| **Gift flow**                      | ✅ Resolved                   | Two flows: (1) NFT transfer via `transferFrom` to another wallet. (2) At order time, user enters a different shipping address — peaches ship to that address instead. |
| **Redemption verification method** | ✅ Resolved                   | API route calls `tokenState(tokenId)` on-chain (public mapping getter). Verifies value == 1 and caller is token owner via `ownerOf(tokenId)`.                         |
| **Domain**                         | ✅ `https://peachtycoon.com/` |                                                                                                                                                                       |
| **Deployment**                     | ✅ Vercel                     |                                                                                                                                                                       |
| **Testnet**                        | ✅ Sepolia                    |                                                                                                                                                                       |
| **Market launch date**             | ⏳ Unknown                    | Show "Coming Soon" on placeholder page for now                                                                                                                        |
| **OpenSea collection URL**         | ⏳ Pending                    | Available after mainnet deployment                                                                                                                                    |

---

## 🔵 Social & External Links

| Item                             | Status                  | Notes                       |
| -------------------------------- | ----------------------- | --------------------------- |
| Twitter/X handle or URL          | ⏳ Needed               | For footer                  |
| Farcaster channel or profile URL | ⏳ Needed               | For footer                  |
| Telegram group URL               | ⏳ Needed               | For footer                  |
| Basescan contract URL            | ⏳ After mainnet deploy |                             |
| OpenSea collection URL           | ⏳ After mainnet deploy | For market placeholder page |

---

## Summary

| Category               | Resolved | Still Needed                                            |
| ---------------------- | -------- | ------------------------------------------------------- |
| Smart Contracts        | 7/9      | Mainnet NFT address, Privy/Airtable/Shopify credentials |
| Sale Config            | 4/6      | Sale open/close dates                                   |
| Logos / Fonts          | 0/7      | All logo and font assets                                |
| NFT Art                | 0/4      | All art and artist info                                 |
| Proof of Peach         | 0/6      | All photos and testimonials                             |
| About Content          | 0/7      | All farm/farmer/project copy                            |
| FAQ Copy               | 0/12     | All Q&A text                                            |
| General Copy           | 0/4      | All hero/section copy                                   |
| Architecture / Product | 8/10     | Market date, OpenSea URL                                |
| Social Links           | 0/5      | All social URLs                                         |

---

_Last updated: 2026-03-09_
