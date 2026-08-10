import React from "react";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const res = await fetch("https://api.younoya.com/api/v1/products", {
      next: { revalidate: 3600 }
    });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data.map((p: { handle: string }) => ({
        handle: p.handle
      }));
    }
  } catch (e) {
    console.error("Error generating static params for products:", e);
  }

  // Safe fallback static params for essential catalog
  return [
    { handle: "vedic-prosperity-rakhi" },
    { handle: "vedic-prosperity-wealth-attraction-rakhi" },
    { handle: "vedic-abundance-blessing-rakhi" },
    { handle: "navagraha-om-protection-kaudi-rakhi" }
  ];
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  return <ProductDetailClient initialHandle={handle} />;
}
