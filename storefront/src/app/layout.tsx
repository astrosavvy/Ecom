import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/CartContext";

export const metadata: Metadata = {
  title: "YOUNOYA — For Every Chapter",
  description:
    "Handcrafted excellence, consecrated grace, and frictionless zero-password express checkout.",
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
      <body className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans antialiased selection:bg-emerald-400 selection:text-black overflow-x-hidden">
        <CartProvider>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
