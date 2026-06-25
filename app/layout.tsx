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
    "Season 4 is sold out. Peach Tycoon connects seasonal Peach Tokens to real boxes of Palisade, Colorado peaches.",
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
      "Season 4 is sold out. Come back next season for the next Palisade peach drop.",
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
      "Season 4 is sold out. Come back next season for the next Palisade peach drop.",
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
        <link rel="agent-commerce" href="/.well-known/agent-commerce" />
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
