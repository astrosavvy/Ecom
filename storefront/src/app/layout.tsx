import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/CartContext";

export const metadata: Metadata = {
  title: "Axon — Digital Workers for Mundane Workflows",
  description:
    "Eliminate your tedious browser work and 10x your team's capacity with intelligent digital workers.",
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
        <CartProvider>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
