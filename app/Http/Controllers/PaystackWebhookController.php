<?php

namespace App\Http\Controllers;

use App\Models\LandlordSubscription;
use App\Models\PlatformPayment;
use App\Services\BillingFulfillment;
use App\Services\PaystackService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class PaystackWebhookController extends Controller
{
    public function __invoke(Request $request, BillingFulfillment $fulfillment): Response
    {
        $secret = config('paystack.secret_key');
        $signature = $request->header('x-paystack-signature');

        if (! $secret || ! $signature) {
            return response('ignored', 200);
        }

        $computed = hash_hmac('sha512', $request->getContent(), $secret);

        if (! hash_equals($computed, $signature)) {
            return response('invalid signature', 400);
        }

        $event = $request->input('event');
        $data = $request->input('data', []);

        if ($event === 'charge.success') {
            $fulfillment->fulfillVerifiedPayment($data, $request);
        }

        if (in_array($event, ['subscription.create', 'subscription.not_renew', 'subscription.disable'], true)) {
            $code = $data['subscription_code'] ?? null;
            $customerCode = $data['customer']['customer_code'] ?? null;
            $status = match ($event) {
                'subscription.disable' => 'cancelled',
                'subscription.not_renew' => 'non-renewing',
                default => 'active',
            };

            $subscription = LandlordSubscription::query()
                ->when($code, fn ($q) => $q->where('paystack_subscription_code', $code))
                ->when(! $code && $customerCode, fn ($q) => $q->where('paystack_customer_code', $customerCode))
                ->first();

            if (! $subscription && $customerCode) {
                $payment = PlatformPayment::query()
                    ->where('type', 'subscription')
                    ->where('status', 'success')
                    ->whereJsonContains('metadata->user_id', $data['metadata']['user_id'] ?? null)
                    ->latest()
                    ->first();

                if ($payment?->user_id) {
                    $subscription = LandlordSubscription::query()->where('user_id', $payment->user_id)->first();
                }
            }

            if ($subscription) {
                $subscription->update([
                    'status' => $status === 'active' ? 'active' : $status,
                    'paystack_subscription_code' => $code ?? $subscription->paystack_subscription_code,
                    'paystack_email_token' => $data['email_token'] ?? $subscription->paystack_email_token,
                    'paystack_customer_code' => $customerCode ?? $subscription->paystack_customer_code,
                    'next_payment_at' => isset($data['next_payment_date']) ? $data['next_payment_date'] : $subscription->next_payment_at,
                    'ends_at' => $status === 'cancelled' ? now() : $subscription->ends_at,
                ]);
            }
        }

        if ($event === 'invoice.payment_failed') {
            $code = $data['subscription']['subscription_code'] ?? null;
            if ($code) {
                LandlordSubscription::query()
                    ->where('paystack_subscription_code', $code)
                    ->update(['status' => 'past_due']);
            }
        }

        Log::info('Paystack webhook handled', ['event' => $event]);

        return response('ok', 200);
    }
}
