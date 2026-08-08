<?php

namespace App\Http\Controllers\Webhook;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class ShiprocketWebhookController extends Controller
{
    private string $shiprocketSecret = "younoya_shiprocket_secure_2026";

    public function handle(Request $request): JsonResponse
    {
        $token = $request->header('x-shiprocket-token');
        if ($token && $token !== $this->shiprocketSecret) {
            return response()->json(['error' => 'Unauthorized webhook token'], 401);
        }

        $payload = $request->json()->all();
        $orderId = $payload['order_id'] ?? null;
        $status = $payload['current_status'] ?? 'IN TRANSIT';
        $awb = $payload['awb'] ?? 'AWB-YNY-' . time();

        if ($orderId) {
            cache()->put("tracking_{$awb}", [
                'order_id' => $orderId,
                'awb' => $awb,
                'courier_name' => $payload['courier_name'] ?? 'Bluedart',
                'status' => $status,
                'scans' => $payload['scans'] ?? [
                    ['date' => now()->toDateTimeString(), 'activity' => 'Shipment scanned at origin hub', 'location' => 'Mumbai Hub']
                ],
                'updated_at' => now()->toIso8601String()
            ], 86400 * 30);
        }

        return response()->json(['status' => 'acknowledged'], 200);
    }
}
