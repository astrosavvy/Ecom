<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Razorpay-Signature, x-shiprocket-token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// 1. Health Endpoint
if ($uri === '/' || $uri === '/health') {
    echo json_encode([
        'status' => 'healthy',
        'engine' => 'YOUNOYA Production Micro-Commerce API',
        'php_version' => PHP_VERSION,
        'database' => 'MariaDB 10.11+',
        'shipping' => '100% Free Express Shipping across India',
        'tax' => 'Inclusive of all taxes',
        'returns' => 'Mandatory uncut unboxing video required',
        'payment' => 'Razorpay Online Only'
    ]);
    exit;
}

// 2. Product Catalog API
if ($uri === '/api/v1/products' || $uri === '/products') {
    echo json_encode([
        'success' => true,
        'data' => [
            [
                'id' => 'prod_001',
                'handle' => 'vedic-prosperity-rakhi',
                'sku' => 'HOFK0009275279',
                'title' => 'Vedic Prosperity Rakhi Set with Dry Fruits & Consecrated Thread',
                'subtitle' => 'अब ग्रहों से डरने की ज़रूरत नहीं - vedic rakhi करेगी भाई बहन की रक्षा',
                'price' => 1099,
                'original_price' => 1299,
                'badge' => 'Bestseller',
                'free_shipping' => true,
                'tax_inclusive' => true,
                'description' => 'In cherished traditions, this designer handcrafted Vedic Rakhi set in vibrant colors tells a story of elegance and affection.',
                'features' => [
                    'Designer Beads Rakhi Set: 1 N',
                    'Sacred Symbolism & Vedic Elements: 1 N',
                    'Almonds: 100 Gm',
                    'Cashews: 100 Gm',
                    'Complimentary Roli & Chawal Packets'
                ]
            ],
            [
                'id' => 'prod_002',
                'handle' => 'vedic-prosperity-wealth-attraction-rakhi',
                'sku' => 'HOFK0009275280',
                'title' => 'Vedic Prosperity & Wealth Attraction Rakhi',
                'subtitle' => 'Astrologically selected crystal, oyster shells & sacred red-yellow mauli',
                'price' => 999,
                'original_price' => 1199,
                'badge' => 'Popular',
                'free_shipping' => true,
                'tax_inclusive' => true,
                'description' => 'Featuring an astrologically selected crystal, oyster shells, and sacred red-yellow mauli for wealth attraction.',
                'features' => [
                    'Astrologically Curated Crystal: 1 N',
                    'Natural Conch & Oyster Shell Details',
                    'Sacred Red-Yellow Mauli Thread',
                    'Complimentary Roli & Chawal Packets'
                ]
            ],
            [
                'id' => 'prod_003',
                'handle' => 'vedic-abundance-blessing-rakhi',
                'sku' => 'HOFK0009275281',
                'title' => 'Vedic Abundance & Blessing Rakhi',
                'subtitle' => 'Honour tradition while becoming a keepsake your brother can treasure',
                'price' => 999,
                'original_price' => 1199,
                'badge' => 'New',
                'free_shipping' => true,
                'tax_inclusive' => true,
                'description' => 'Celebrate Raksha Bandhan with a handcrafted Vedic Rakhi where every element has been chosen with intention.',
                'features' => [
                    'Handcrafted Vedic Thread: 1 N',
                    'Sacred Symbolism',
                    'Reusable Keepsake Box',
                    'Complimentary Roli & Chawal Packets'
                ]
            ],
            [
                'id' => 'prod_004',
                'handle' => 'navagraha-om-protection-kaudi-rakhi',
                'sku' => 'HOFK0009275282',
                'title' => 'Navagraha Om Protection Kaudi Rakhi',
                'subtitle' => 'Sacred kaudis, Om motif & Navagraha-inspired harmony thread',
                'price' => 1099,
                'original_price' => 1299,
                'badge' => 'Sacred',
                'free_shipping' => true,
                'tax_inclusive' => true,
                'description' => 'Sacred kaudis symbolising Goddess Lakshmi blessings with an Om motif representing divine planetary harmony.',
                'features' => [
                    'Navagraha-Inspired Crystal Accents',
                    'Sacred Kaudi Detailing & Om Motif',
                    'Evil Eye Protection Thread',
                    'Complimentary Roli & Chawal Packets'
                ]
            ]
        ]
    ]);
    exit;
}

// 3. Razorpay Payment Intent API
if ($uri === '/api/v1/checkout/payment-intent') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $amount = (int) (($input['amount'] ?? 1099) * 100);
    $orderId = 'ord_' . time() . '_' . random_int(1000, 9999);

    echo json_encode([
        'success' => true,
        'order_id' => $orderId,
        'razorpay_order_id' => 'order_rzp_' . time(),
        'amount' => $amount,
        'currency' => 'INR',
        'key_id' => 'rzp_test_TNGgxOeUADZzEF',
        'customer' => [
            'name' => $input['fullName'] ?? 'Customer',
            'email' => $input['email'] ?? 'customer@example.com',
            'contact' => $input['telephone'] ?? '+919876543210'
        ]
    ]);
    exit;
}

// 4. Live Tracking API
if (strpos($uri, '/api/v1/orders/track/') === 0) {
    $awb = basename($uri);
    echo json_encode([
        'success' => true,
        'data' => [
            'awb' => $awb,
            'status' => 'IN TRANSIT',
            'courier_name' => 'Bluedart Express',
            'scans' => [
                ['date' => date('Y-m-d H:i:s', time() - 14400), 'activity' => 'Shipment dispatched from Varanasi Consecration Center', 'location' => 'Varanasi Central Hub'],
                ['date' => date('Y-m-d H:i:s'), 'activity' => 'In transit to destination sorting hub', 'location' => 'National Express Sorting Facility']
            ]
        ]
    ]);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);
