<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Webhook\RazorpayWebhookController;
use App\Http\Controllers\Webhook\ShiprocketWebhookController;

Route::prefix('v1')->group(function () {
    // 1. Public Catalog (Edge Cached by Cloudflare Worker)
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{handle}', [ProductController::class, 'show']);

    // 2. Zero-Password Email OTP Auth (Never Cached)
    Route::post('/auth/otp/request', [AuthController::class, 'requestOtp']);
    Route::post('/auth/otp/verify', [AuthController::class, 'verifyOtp']);

    // 3. Checkout & Payment Intent (Never Cached)
    Route::post('/checkout/payment-intent', [CheckoutController::class, 'createPaymentIntent']);

    // 4. Cryptographically Signed Webhooks (Never Cached)
    Route::post('/webhooks/razorpay', [RazorpayWebhookController::class, 'handle']);
    Route::post('/webhooks/shiprocket', [ShiprocketWebhookController::class, 'handle']);

    // 5. Tracking Endpoint (Edge Cached for 5 mins)
    Route::get('/orders/track/{awb}', function ($awb) {
        $tracking = cache()->get("tracking_{$awb}", [
            'awb' => $awb,
            'status' => 'IN TRANSIT',
            'courier_name' => 'Bluedart Express',
            'scans' => [
                ['date' => now()->subHours(4)->toDateTimeString(), 'activity' => 'Shipment dispatched from sacred Vedic consecration center', 'location' => 'Varanasi Central Hub'],
                ['date' => now()->toDateTimeString(), 'activity' => 'In transit to destination city hub', 'location' => 'National Express Sorting Facility']
            ]
        ]);
        return response()->json(['success' => true, 'data' => $tracking]);
    });
});
