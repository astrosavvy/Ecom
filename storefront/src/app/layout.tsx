import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "YOUNOYA — Sacred Astrology-Blessed Rakhis & Vedic Ritual Kits",
  description: "Handcrafted consecrated Rakhis, Vedic Puja Kits, and spiritual essentials delivered across India with express checkout.",
  keywords: ["YOUNOYA", "Vedic Astrology", "Astro Rakhi", "Puja Kit", "Sacred Gifts", "India"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#0a0a0c] text-white flex flex-col font-inter antialiased selection:bg-white selection:text-black">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
