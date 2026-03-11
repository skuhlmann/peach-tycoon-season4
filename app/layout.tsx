import type { Metadata } from "next";

// DApp: all pages require client-side wallet state, so opt out of static generation.
export const dynamic = "force-dynamic";
import "./globals.css";
import Providers from "@/components/Providers";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Peach Tycoon — Season Four",
  description:
    "Buy a Peach Box Token on Base and redeem it for a real box of Colorado peaches from Palisade, CO.",
  manifest: "/meta/manifest.json",
  icons: {
    icon: [
      { url: "/meta/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/meta/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/meta/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/meta/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/meta/apple-touch-icon.png",
  },
  openGraph: {
    title: "Peach Tycoon — Season Four",
    description:
      "Buy a Peach Box Token on Base and redeem it for a real box of Colorado peaches.",
    siteName: "Peach Tycoon",
    type: "website",
    images: [
      {
        url: "/meta/preview.png",
        width: 1200,
        height: 630,
        alt: "Peach Tycoon — Season Four",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peach Tycoon — Season Four",
    description:
      "Buy a Peach Box Token on Base and redeem it for a real box of Colorado peaches.",
    images: ["/meta/twitter.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#e46c1e" />
      </head>
      <body className="antialiased">
        <Providers>
          <NavBar />
          <main className="pt-[80px]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
