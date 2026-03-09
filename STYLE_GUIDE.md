# Peach Tycoon Style Guide

A comprehensive style reference for building new apps that match the look, feel, and brand of Peach Tycoon. Designed for use with **Next.js + Tailwind CSS + shadcn/ui**.

---

## 1. Color Palette

### Brand Colors

| Token | Name | Hex |
|---|---|---|
| `brand-orange` | Primary / CTA | `#E46C1E` |
| `brand-black` | Background | `#0E1418` |
| `brand-gray` | Card Background | `#1F1F1F` |
| `brand-white` | Text | `#FFFFFF` |
| `brand-red` | Alerts / Status | `#F5253D` |
| `brand-green` | Success / Secondary | `#419361` |
| `brand-blue` | Info / Alternative | `#9EB4C7` |
| `brand-orange-overlay` | Semi-transparent Orange | `rgba(228, 108, 30, 0.3)` |

### Tailwind CSS Theme Configuration

Add to your `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#E46C1E",
          black: "#0E1418",
          gray: "#1F1F1F",
          white: "#FFFFFF",
          red: "#F5253D",
          green: "#419361",
          blue: "#9EB4C7",
          "orange-overlay": "rgba(228, 108, 30, 0.3)",
        },
      },
    },
  },
};

export default config;
```

### shadcn/ui CSS Variables (`globals.css`)

```css
:root {
  --background: 210 16% 8%;          /* #0E1418 */
  --foreground: 0 0% 100%;           /* #FFFFFF */
  --card: 0 0% 12%;                  /* #1F1F1F */
  --card-foreground: 0 0% 100%;
  --popover: 210 16% 8%;
  --popover-foreground: 0 0% 100%;
  --primary: 24 76% 50%;             /* #E46C1E */
  --primary-foreground: 0 0% 100%;
  --secondary: 140 38% 37%;          /* #419361 */
  --secondary-foreground: 0 0% 100%;
  --muted: 0 0% 12%;
  --muted-foreground: 210 20% 68%;   /* #9EB4C7 */
  --accent: 24 76% 50%;
  --accent-foreground: 0 0% 100%;
  --destructive: 350 90% 56%;        /* #F5253D */
  --destructive-foreground: 0 0% 100%;
  --border: 0 0% 20%;
  --input: 0 0% 20%;
  --ring: 24 76% 50%;
  --radius: 1.25rem;                 /* 20px card radius */
}
```

---

## 2. Typography

### Font Families

| Role | Font | Source |
|---|---|---|
| **Body** | Work Sans | Google Fonts |
| **Headings / Display** | Helsinki | Custom web font (WOFF/WOFF2) |
| **Decorative / Subheadings** | Auster | Adobe Typekit (`rao1ahi`) |
| **Serif Display** | Alda | Adobe Typekit (`rao1ahi`) |

### Font Setup (`app/layout.tsx`)

```tsx
import { Work_Sans } from "next/font/google";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["100", "300", "400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});
```

### Custom Fonts (`globals.css`)

```css
@font-face {
  font-family: "Helsinki";
  src: url("/fonts/helsinki-webfont.woff2") format("woff2"),
       url("/fonts/helsinki-webfont.woff") format("woff");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* Adobe Typekit (Auster + Alda) */
@import url("https://use.typekit.net/rao1ahi.css");
```

### Tailwind Font Config

```ts
fontFamily: {
  sans: ["var(--font-work-sans)", "sans-serif"],
  heading: ["Helsinki", "sans-serif"],
  display: ["auster", "sans-serif"],
  serif: ["alda", "serif"],
},
```

### Type Scale

| Usage | Class | Size |
|---|---|---|
| Hero heading (mobile) | `text-[56px]` | 56px |
| Hero heading (desktop) | `xl:text-[80px]` | 80px |
| Display / Proof-of-peach | `text-[50px]` | 50px |
| Body default | `text-lg` | 18px |
| Large body / button | `text-2xl` | 24px |
| Small labels | `text-xs` | 12px |

### Font Styles

- **Headings**: Helsinki, `font-weight: 100` (light)
- **Auster headings**: Bold (`font-bold`), uppercase often applied
- **Button labels**: Italic (`italic`), all caps, `font-bold`
- **Badge labels**: Uppercase (`uppercase`), `line-height: 1.75`
- **Body**: Work Sans, regular weight, `antialiased`

---

## 3. Component Styles

### Buttons

Buttons use a **pill outline** style as the primary pattern.

```tsx
// Primary (orange outline)
<Button className="
  h-[60px] w-[220px] rounded-[200px]
  border border-brand-orange
  bg-transparent text-brand-orange
  font-display font-bold italic text-xl uppercase
  transition-transform hover:-translate-y-2 hover:text-brand-orange
  focus:translate-y-0 focus:bg-brand-black
" />

// Secondary / Farm action (green outline)
<Button className="
  h-[60px] w-[220px] rounded-[200px]
  border border-brand-green
  bg-transparent text-brand-green
  font-display font-bold italic text-xl uppercase
  hover:-translate-y-2
" />

// Info action (blue outline)
<Button className="
  h-[60px] w-[220px] rounded-[200px]
  border border-brand-blue
  bg-transparent text-brand-blue
  font-display font-bold italic text-xl uppercase
  hover:-translate-y-2
" />

// Large CTA
<Button className="h-[72px] w-[320px] rounded-[200px] ..." />
```

**Button sizes:**
- Standard: `h-[60px] w-[220px]`
- Modal / Form: `h-[60px] w-[260px]`
- Large CTA: `h-[72px] w-[320px]`
- Border radius always: `rounded-[200px]` (full pill)

**Common button labels (all caps):**
`MINT`, `BUY TREE`, `WATER`, `PRUNE`, `FERTILIZE`, `BUY`, `LIST FOR SALE`, `UNBOX`

### Cards

```tsx
<div className="
  bg-brand-gray rounded-[20px]
  p-[26px_29px]
  w-[320px]
">
  {/* Card content */}
</div>
```

Card variants:
- **Standard**: `p-[26px_29px]`
- **Tree card**: `p-[26px_14px_26px_29px]`
- **Mint card**: `p-[29px_36px]`
- Internal divider: `border-b border-dotted border-black pb-8`

### Badges / Status Labels

```tsx
<span className="
  inline-block px-5
  h-[34px] leading-[1.75]
  bg-brand-red text-black
  font-display font-bold uppercase text-sm
  rounded-full
">
  • PEACH SEASON CLOSED •
</span>
```

Color meanings:
- Red `bg-brand-red`: Closed / Alert
- Green `bg-brand-green`: Active / Open
- Orange `bg-brand-orange`: Highlight

### Inputs & Forms

```tsx
// Text input
<Input className="
  border-brand-orange
  focus:ring-brand-orange focus:border-brand-orange
  bg-brand-gray text-white
" />

// Select
<Select className="
  bg-brand-green text-black
  border-none rounded-md
" />
```

### Modals / Dialogs

```tsx
<Dialog>
  <DialogOverlay className="
    bg-gunmetal/80
    backdrop-blur-[10px]
    hue-rotate-90
  " />
  <DialogContent className="
    bg-[#0f1418] text-white
    rounded-[20px]
    flex flex-col items-center gap-4
  ">
    <DialogHeader>
      <DialogTitle className="text-brand-orange font-display text-2xl" />
    </DialogHeader>
  </DialogContent>
</Dialog>
```

Modal header color by context:
- Primary: `text-brand-orange`
- Success / Farm: `text-brand-green`
- Info: `text-brand-blue`

### Spinners / Loading

```tsx
<Loader2 className="
  h-12 w-12 animate-spin
  text-brand-green
  stroke-[8px]
" />
```

---

## 4. Layout & Spacing

### Page Structure

```
Fixed NavBar (height ~80px, z-10, bg-brand-black)
  ↓
Main Content Area (pt-[180px])
  ↓
Footer (min-h-[200px], bg-brand-orange, text-brand-black)
```

### NavBar

```tsx
<nav className="
  fixed top-0 w-full z-10
  bg-brand-black
  py-8 px-3 md:px-10
  mb-8
" />
```

### Footer

```tsx
<footer className="
  min-h-[200px]
  bg-brand-orange text-brand-black
  p-[60px]
" />
```

### Section Layout

```tsx
<section className="
  mt-0 md:mt-[160px]
  px-[10vw]
  flex flex-col md:flex-row
  justify-start items-start
  gap-8
" />
```

### Spacing Scale

| Scale | Value | Tailwind |
|---|---|---|
| XS | 0.5rem / 8px | `gap-2` |
| SM | 1rem / 16px | `gap-4` |
| MD | 1.5rem / 24px | `gap-6` |
| LG | 2rem / 32px | `gap-8` |
| XL | 2.5rem / 40px | `gap-10` |
| 2XL | 3rem / 48px | `gap-12` |

### Responsive Widths

| Element | Mobile | Desktop |
|---|---|---|
| Cards | `w-[320px]` | `w-[320px]` |
| Card (wider) | `w-[293px]` | `w-[426px]` |
| Hero image | `w-full` | `w-[40vw]` |

### Z-Index Hierarchy

| Element | Z-Index |
|---|---|
| Navigation | `z-10` (`z-index: 9`) |
| Buttons (positioned) | `z-[2]` |
| Mobile menu overlay | `z-[12]` |

---

## 5. Animations & Transitions

### Button Hover (translate up)

```css
/* Standard hover lift */
.btn-hover {
  transition: transform 150ms ease;
}
.btn-hover:hover {
  transform: translateY(-7px);
}
.btn-hover:focus {
  transform: translateY(0px);
}
```

Tailwind equivalents:
```tsx
className="transition-transform hover:-translate-y-2 focus:translate-y-0"
```

### Modal Backdrop

```tsx
className="backdrop-blur-[10px] hue-rotate-90"
```

### General Transitions

- All interactive elements: `transition-all duration-150`
- Prefer `transform` for hover effects (performant)

---

## 6. Brand & Logo

### Logo Assets

| Asset | Usage | Dimensions |
|---|---|---|
| Peach Avatar | Favicon, auth, cards | 56px desktop / 36px mobile |
| Peach Wordmark | Nav desktop | 97px wide |
| Tycoon Wordmark | Nav desktop | 210px wide |
| Mobile Logo | Nav mobile | Compact |
| Footer Logo | Footer | Standard |

### Logo Arrangement

**Desktop nav:** `[Peach Avatar] [Peach Wordmark] [Tycoon Wordmark]` — horizontal, hidden on mobile

**Mobile nav:** `[Peach Avatar 36px] [Mobile Logo]` — compact horizontal

### Meta / Theme

```html
<meta name="theme-color" content="#e46c1e" />
```

### Social Links

Twitter/X, Farcaster, Telegram — `text-2xl` icon size in footer

---

## 7. Content Tone

### Voice & Style

- **Playful, casual, and energetic** — this is a game/NFT farming app
- Button labels are **ALL CAPS**, short action words
- Status messages use **fruit/farm metaphors** ("Your peach art will reveal soon")
- Headings often use **exclamation points**: "Get Trees!", "Get Growing!", "Get peaches!"
- Loading states describe the action: "Minting", "Daily Watering"
- Success messages feel rewarding: "You got the Peach!", "Success!"

### Navigation Labels

`Home` · `Buy Trees` · `Peach Market` · `My Farm` · `My Account` · `About` · `Log Out`

### Button Label Patterns

```
[VERB] [NOUN]  →  BUY TREE, LIST FOR SALE, BUY NOW
[VERB]         →  MINT, WATER, PRUNE, FERTILIZE, UNBOX
```

### Status Badge Patterns

```
• [NOUN] [STATUS] •   →   • PEACH SEASON CLOSED •
• [LABEL] •            →   • Tree Sales Closed •
```

### Heading Hierarchy

1. **Section intro** (Auster, bold, exclamation): `"Get Trees!"`
2. **Feature name** (Helsinki, light): `"Proof-of-peach"`
3. **Status / badge** (uppercase, colored): `"• BOOST SALES CLOSED •"`
4. **Body copy** (Work Sans, 18px, relaxed): Descriptive, friendly

---

## 8. Dark Theme Foundation

The entire app is **dark-first**. There is no light mode.

```
Background:  #0E1418 (near-black with blue undertone)
Surface:     #1F1F1F (dark gray cards)
Modal bg:    #0F1418 (same as background)
Text:        #FFFFFF (primary), #9EB4C7 (muted/info)
Accent:      #E46C1E (orange — used for CTAs, links, headings)
```

Global body style:
```css
body {
  background-color: #0E1418;
  color: #ffffff;
  font-family: "Work Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
}
```

---

## 9. shadcn/ui Component Customization Notes

When installing shadcn/ui (`npx shadcn@latest init`), select:
- Style: **Default**
- Base color: **Neutral** (then override with CSS vars above)
- CSS variables: **Yes**

Key overrides to apply after init:
- `--radius`: Set to `1.25rem` (20px) for card radius, buttons use `9999px` inline
- `--primary`: Map to brand orange `24 76% 50%`
- `--background`: Map to brand black `210 16% 8%`
- All shadcn components inherit these via CSS variables — minimal per-component overrides needed

Button component variant additions:
```tsx
// components/ui/button.tsx additions
const buttonVariants = cva("...", {
  variants: {
    variant: {
      // Add these custom variants
      "brand-orange": "border border-brand-orange text-brand-orange bg-transparent hover:-translate-y-2 ...",
      "brand-green":  "border border-brand-green text-brand-green bg-transparent hover:-translate-y-2 ...",
      "brand-blue":   "border border-brand-blue text-brand-blue bg-transparent hover:-translate-y-2 ...",
    },
    size: {
      // Add custom sizes
      pill:   "h-[60px] w-[220px] rounded-[200px]",
      "pill-lg": "h-[72px] w-[320px] rounded-[200px]",
      "pill-md": "h-[60px] w-[260px] rounded-[200px]",
    },
  },
});
```

---

## 10. Quick Reference Cheatsheet

```
Colors
  Orange:  #E46C1E   (primary, CTA, accent)
  Black:   #0E1418   (background)
  Gray:    #1F1F1F   (cards)
  Red:     #F5253D   (alerts, closed status)
  Green:   #419361   (success, farm actions)
  Blue:    #9EB4C7   (info, muted)

Fonts
  Body:    Work Sans (Google Fonts)
  Display: Helsinki (custom WOFF)
  Deco:    Auster / Alda (Adobe Typekit rao1ahi)

Borders
  Cards:   border-radius: 20px
  Buttons: border-radius: 200px (pill)
  Width:   1px (standard), 2px (emphasized)

Buttons
  Style:   outline, pill shape, italic, all-caps
  Hover:   translateY(-7px)

Spacing
  Base:    0.5rem (8px) increments
  Cards:   ~26-36px internal padding

Z-Index
  Nav: 9 / Modal: above nav / Menu: 12
```
