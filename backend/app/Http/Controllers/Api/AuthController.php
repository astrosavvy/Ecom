<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class AuthController extends Controller
{
    private string $salt = "younoya_secure_salt_2026_d2c";

    public function requestOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email'
        ]);

        $email = strtolower(trim($validated['email']));
        
        // Mock generation in dev / Production OTP
        $otp = (string) random_int(100000, 999999);
        $otpHash = hash('sha256', $otp . $this->salt);

        // Store challenge with 10-minute expiry
        cache()->put("otp_challenge_{$email}", [
            'hash' => $otpHash,
            'attempts' => 0,
            'expires_at' => now()->addMinutes(10)->timestamp
        ], 600);

        // Simulated/Live SMTP dispatch
        return response()->json([
            'success' => true,
            'message' => 'Verification code sent successfully to ' . $email,
            'cooldown_seconds' => 60
        ], 200, [
            'Cache-Control' => 'no-store, no-cache, must-revalidate'
        ]);
    }

    public function verifyOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
            'fullName' => 'nullable|string'
        ]);

        $email = strtolower(trim($validated['email']));
        $challenge = cache()->get("otp_challenge_{$email}");

        if (!$challenge) {
            return response()->json([
                'success' => false,
                'error' => 'OTP challenge expired or not found. Please request a new code.'
            ], 400);
        }

        $inputHash = hash('sha256', $validated['otp'] . $this->salt);

        if (!hash_equals($challenge['hash'], $inputHash)) {
            $challenge['attempts'] += 1;
            if ($challenge['attempts'] >= 5) {
                cache()->forget("otp_challenge_{$email}");
                return response()->json([
                    'success' => false,
                    'error' => 'Too many failed attempts. Please request a new code.'
                ], 429);
            }
            cache()->put("otp_challenge_{$email}", $challenge, 600);
            return response()->json([
                'success' => false,
                'error' => 'Invalid verification code.'
            ], 400);
        }

        // Successfully verified
        cache()->forget("otp_challenge_{$email}");

        $sessionToken = bin2hex(random_bytes(32));
        cache()->put("session_{$sessionToken}", [
            'email' => $email,
            'fullName' => $validated['fullName'] ?? 'Guest Customer',
            'verified_at' => now()->toIso8601String()
        ], 86400 * 30);

        $cookie = cookie('yn_session', $sessionToken, 60 * 24 * 30, '/', null, true, true, false, 'Lax');

        return response()->json([
            'success' => true,
            'message' => 'OTP verified successfully',
            'customer' => [
                'email' => $email,
                'fullName' => $validated['fullName'] ?? 'Guest Customer'
            ]
        ], 200, [
            'Cache-Control' => 'no-store, no-cache, must-revalidate'
        ])->withCookie($cookie);
    }
}
