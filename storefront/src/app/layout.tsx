import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/CartContext";

export const metadata: Metadata = {
  title: "YOUNOYA — Beyond silence, we build the eternal.",
  description:
    "Building platforms for brilliant minds, fearless makers, and thoughtful souls. Pure craftsmanship with zero-password express checkout.",
  keywords: ["YOUNOYA", "Luxury", "Studio", "Craftsmanship", "Zero Password Checkout"],
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
      <body className="min-h-screen bg-white text-black flex flex-col font-sans antialiased selection:bg-black selection:text-white">
        <CartProvider>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
