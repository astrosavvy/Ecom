import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/CartContext";
import { DeckProvider } from "@/components/home/DeckContext";

export const metadata: Metadata = {
  title: "YOUNOYA — Sacred Astrology-Blessed Rakhis & Vedic Ritual Keepsakes",
  description:
    "Handcrafted Vedic Rakhis, authentic astrological gemstones, and sacred puja keepsakes crafted with devotion and delivered across India with zero-password checkout.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#07080E] text-[#FDFCF8] flex flex-col font-sans antialiased selection:bg-[#D4AF37] selection:text-[#07080E]">
        <DeckProvider>
          <CartProvider>
            <Header />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </CartProvider>
        </DeckProvider>
      </body>
    </html>
  );
}
