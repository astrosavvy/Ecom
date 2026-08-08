<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class ProductController extends Controller
{
    private array $products = [
        [
            'id' => 'prod_001',
            'handle' => 'vedic-prosperity-rakhi',
            'sku' => 'HOFK0009275279',
            'title' => 'Vedic Prosperity Rakhi Set with Dry Fruits & Consecrated Thread',
            'subtitle' => 'अब ग्रहों से डरने की ज़रूरत नहीं - vedic rakhi करेगी भाई बहन की रक्षा',
            'price' => 1099,
            'original_price' => 1299,
            'tax_inclusive' => true,
            'free_shipping' => true,
            'inventory_quantity' => 250,
            'badge' => 'Bestseller',
            'description' => "In cherished traditions, this designer handcrafted Vedic Rakhi set in vibrant colors tells a story of elegance and affection. Each intricately crafted rakhi celebrates the unique bond between siblings. Inspired by timeless traditions, it transforms a simple thread into a meaningful keepsake.",
            'features' => [
                'Designer Beads Rakhi Set: 1 N',
                'Sacred Symbolism & Vedic Elements: 1 N',
                'Almonds: 100 Gm',
                'Cashews: 100 Gm',
                'Complimentary Roli & Chawal Packets',
            ],
            'return_policy' => 'Returns/Cancellations accepted within 48h only with an uncut unboxing video recorded.'
        ],
        [
            'id' => 'prod_002',
            'handle' => 'vedic-prosperity-wealth-attraction-rakhi',
            'sku' => 'HOFK0009275280',
            'title' => 'Vedic Prosperity & Wealth Attraction Rakhi',
            'subtitle' => 'Astrologically selected crystal, oyster shells & sacred red-yellow mauli',
            'price' => 999,
            'original_price' => 1199,
            'tax_inclusive' => true,
            'free_shipping' => true,
            'inventory_quantity' => 180,
            'badge' => 'Popular',
            'description' => "Featuring an astrologically selected crystal, oyster shells, sacred red-yellow mauli and thoughtfully curated Vedic elements, for PROSPERITY AND WEALTH ATTRACTION.",
            'features' => [
                'Astrologically Curated Crystal: 1 N',
                'Natural Conch & Oyster Shell Details',
                'Sacred Red-Yellow Mauli Thread',
                'Complimentary Roli & Chawal Packets',
            ],
            'return_policy' => 'Returns/Cancellations accepted within 48h only with an uncut unboxing video recorded.'
        ],
        [
            'id' => 'prod_003',
            'handle' => 'vedic-abundance-blessing-rakhi',
            'sku' => 'HOFK0009275281',
            'title' => 'Vedic Abundance & Blessing Rakhi',
            'subtitle' => 'Honour tradition while becoming a keepsake your brother can treasure',
            'price' => 999,
            'original_price' => 1199,
            'tax_inclusive' => true,
            'free_shipping' => true,
            'inventory_quantity' => 150,
            'badge' => 'New',
            'description' => "Celebrate Raksha Bandhan with a handcrafted Vedic Rakhi where every element has been chosen with intention.",
            'features' => [
                'Handcrafted Vedic Thread: 1 N',
                'Sacred Symbolism',
                'Reusable Keepsake Box',
                'Complimentary Roli & Chawal Packets',
            ],
            'return_policy' => 'Returns/Cancellations accepted within 48h only with an uncut unboxing video recorded.'
        ],
        [
            'id' => 'prod_004',
            'handle' => 'navagraha-om-protection-kaudi-rakhi',
            'sku' => 'HOFK0009275282',
            'title' => 'Navagraha Om Protection Kaudi Rakhi',
            'subtitle' => 'Sacred kaudis, Om motif & Navagraha-inspired harmony thread',
            'price' => 1099,
            'original_price' => 1299,
            'tax_inclusive' => true,
            'free_shipping' => true,
            'inventory_quantity' => 300,
            'badge' => 'Sacred',
            'description' => "Featuring astrologically selected crystal accents, sacred kaudis symbolising prosperity and Goddess Lakshmi’s blessings, an Om motif representing divine protection, and the timeless red-yellow mauli thread.",
            'features' => [
                'Navagraha-Inspired Crystal Accents',
                'Sacred Kaudi Detailing & Om Motif',
                'Evil Eye Protection Thread',
                'Complimentary Roli & Chawal Packets',
            ],
            'return_policy' => 'Returns/Cancellations accepted within 48h only with an uncut unboxing video recorded.'
        ]
    ];

    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->products,
            'meta' => [
                'count' => count($this->products),
                'shipping_policy' => '100% Free Express Shipping Across India',
                'tax_policy' => 'All prices are inclusive of taxes',
                'return_policy' => 'Mandatory uncut unboxing video required for returns/replacements'
            ]
        ], 200, [
            'Cache-Control' => 'public, max-age=3600, stale-while-revalidate=86400'
        ]);
    }

    public function show(string $handle): JsonResponse
    {
        foreach ($this->products as $product) {
            if ($product['handle'] === $handle || $product['id'] === $handle) {
                return response()->json([
                    'success' => true,
                    'data' => $product
                ], 200, [
                    'Cache-Control' => 'public, max-age=3600, stale-while-revalidate=86400'
                ]);
            }
        }

        return response()->json([
            'success' => false,
            'error' => 'Product not found'
        ], 404);
    }
}
