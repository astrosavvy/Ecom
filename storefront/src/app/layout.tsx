import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/CartContext";
import { DeckProvider } from "@/components/home/DeckContext";
import { CursorSpotlight } from "@/components/ui/CursorSpotlight";
import { AuroraBackground } from "@/components/ui/AuroraBackground";

export const metadata: Metadata = {
  title: "YOUNOYA — Sacred Vedic Astrology-Blessed Keepsakes & Ritual Consecrations",
  description:
    "Discover personalized Vedic astrology-prescribed consecrated talismans and sacred ritual keepsakes. Enter your birth details and receive custom astrological recommendations with zero-password OTP checkout.",
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
      <body className="min-h-screen bg-[#040508] text-[#FDFCF8] flex flex-col font-sans antialiased selection:bg-[#D4AF37] selection:text-[#07080E]">
        <DeckProvider>
          <CartProvider>
            {/* Trionn-Inspired Persistent Layers */}
            <AuroraBackground />
            <CursorSpotlight />

            <Header />
            <main className="flex-1 w-full relative z-10">{children}</main>
            <Footer />
          </CartProvider>
        </DeckProvider>
      </body>
    </html>
  );
}
