<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class CheckoutController extends Controller
{
    private string $razorpayKeyId = "rzp_test_TNGgxOeUADZzEF";
    private string $razorpayKeySecret = "ygaJSQX8K0UYomuQrK8ioclk";

    public function createPaymentIntent(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'fullName' => 'required|string',
            'telephone' => 'required|string',
            'address1' => 'required|string',
            'address2' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'postcode' => 'required|string|size:6',
            'amount' => 'required|numeric|min:999'
        ]);

        $orderId = 'ord_' . time() . '_' . random_int(1000, 9999);
        $amountInPaise = (int) ($validated['amount'] * 100);

        // Store order draft
        cache()->put("order_draft_{$orderId}", array_merge($validated, [
            'order_id' => $orderId,
            'amount_in_paise' => $amountInPaise,
            'payment_status' => 'PENDING',
            'shipping_status' => 'UNFULFILLED',
            'free_shipping' => true,
            'tax_inclusive' => true,
            'created_at' => now()->toIso8601String()
        ]), 86400);

        // Razorpay API Order payload
        $razorpayOrder = [
            'id' => 'order_rzp_' . time(),
            'entity' => 'order',
            'amount' => $amountInPaise,
            'currency' => 'INR',
            'receipt' => $orderId,
            'status' => 'created'
        ];

        return response()->json([
            'success' => true,
            'order_id' => $orderId,
            'razorpay_order_id' => $razorpayOrder['id'],
            'amount' => $amountInPaise,
            'currency' => 'INR',
            'key_id' => $this->razorpayKeyId,
            'customer' => [
                'name' => $validated['fullName'],
                'email' => $validated['email'],
                'contact' => $validated['telephone']
            ]
        ], 200, [
            'Cache-Control' => 'no-store, no-cache, must-revalidate'
        ]);
    }
}
