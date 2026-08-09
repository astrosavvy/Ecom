import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/CartContext";

export const metadata: Metadata = {
  title: "YOUNOYA — Sacred Astrology-Blessed Rakhis & Vedic Ritual Keepsakes",
  description: "Handcrafted consecrated Rakhis, Vedic Puja Keepsakes, and spiritual essentials delivered across India with zero-password express checkout.",
  keywords: ["YOUNOYA", "Vedic Astrology", "Astro Rakhi", "Puja Kit", "Sacred Gifts", "India"],
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
      <body className="min-h-screen bg-[#0c0d12] text-white flex flex-col font-inter antialiased selection:bg-amber-400 selection:text-black">
        <CartProvider>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
