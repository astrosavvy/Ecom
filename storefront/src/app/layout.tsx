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
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
