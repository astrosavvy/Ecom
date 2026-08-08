<?php

namespace App\Http\Controllers\Webhook;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class RazorpayWebhookController extends Controller
{
    private string $webhookSecret = "ygaJSQX8K0UYomuQrK8ioclk";

    public function handle(Request $request): JsonResponse
    {
        $signature = $request->header('X-Razorpay-Signature');
        $rawPayload = $request->getContent();

        // 1. Signature Verification
        if ($signature) {
            $expectedSignature = hash_hmac('sha256', $rawPayload, $this->webhookSecret);
            if (!hash_equals($expectedSignature, $signature)) {
                return response()->json(['error' => 'Invalid signature'], 400);
            }
        }

        $payload = json_decode($rawPayload, true);
        $eventId = $payload['id'] ?? ('evt_' . time());

        // 2. Idempotency Check
        if (cache()->has("processed_webhook_{$eventId}")) {
            return response()->json(['status' => 'already_processed'], 200);
        }

        $event = $payload['event'] ?? 'payment.captured';

        if ($event === 'payment.captured') {
            $paymentEntity = $payload['payload']['payment']['entity'] ?? [];
            $receipt = $paymentEntity['order_id'] ?? ($payload['order_id'] ?? 'ord_live');

            $orderDraft = cache()->get("order_draft_{$receipt}");
            if ($orderDraft) {
                $orderDraft['payment_status'] = 'PAID';
                $orderDraft['payment_id'] = $paymentEntity['id'] ?? 'pay_verified';
                $orderDraft['paid_at'] = now()->toIso8601String();
                cache()->put("order_confirmed_{$receipt}", $orderDraft, 86400 * 30);
            }
        }

        // Record processed webhook for idempotency
        cache()->put("processed_webhook_{$eventId}", true, 86400 * 7);

        return response()->json(['status' => 'success'], 200);
    }
}
