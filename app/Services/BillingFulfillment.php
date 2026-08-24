<?php

namespace App\Services;

use App\Models\ListingContactUnlock;
use App\Models\PlatformPayment;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class BillingFulfillment
{
    public function __construct(private PaystackService $paystack)
    {
    }

    public function fulfillVerifiedPayment(array $transaction, ?Request $request = null): PlatformPayment
    {
        $reference = $transaction['reference'] ?? null;
        $payment = PlatformPayment::query()->where('reference', $reference)->first();

        if (! $payment) {
            $metadata = $this->metadata($transaction);
            $payment = PlatformPayment::query()->create([
                'user_id' => $metadata['user_id'] ?? null,
                'property_id' => $metadata['property_id'] ?? null,
                'subscription_plan_id' => $metadata['plan_id'] ?? null,
                'type' => $metadata['type'] ?? 'subscription',
                'email' => $transaction['customer']['email'] ?? 'unknown@example.com',
                'amount' => $this->paystack->fromSubunit((int) ($transaction['amount'] ?? 0)),
                'currency' => $transaction['currency'] ?? 'NGN',
                'reference' => $reference,
                'status' => 'pending',
                'metadata' => $metadata,
            ]);
        }

        if ($payment->status === 'success') {
            $this->applyUnlockSession($payment, $request);

            return $payment;
        }

        $successful = ($transaction['status'] ?? '') === 'success';

        $payment->update([
            'status' => $successful ? 'success' : ($transaction['status'] ?? 'failed'),
            'paid_at' => $successful ? now() : null,
            'metadata' => array_merge($payment->metadata ?? [], $this->metadata($transaction)),
        ]);

        if ($successful) {
            if ($payment->type === 'subscription') {
                $this->activateSubscription($payment, $transaction);
            }

            if ($payment->type === 'listing_contact' && $payment->property_id) {
                $this->unlockListing($payment, $request);
            }
        }

        return $payment->refresh();
    }

    public function applyUnlockSession(PlatformPayment $payment, ?Request $request): void
    {
        if (! $request || $payment->type !== 'listing_contact' || ! $payment->property_id) {
            return;
        }

        $ids = collect($request->session()->get('unlocked_listings', []))
            ->push($payment->property_id)
            ->unique()
            ->values()
            ->all();

        $request->session()->put('unlocked_listings', $ids);
        $request->session()->put('unlock_email', $payment->email);

        cookie()->queue('unlocked_listings', json_encode($ids), 60 * 24 * 90);
    }

    protected function activateSubscription(PlatformPayment $payment, array $transaction): void
    {
        $user = $payment->user_id ? User::find($payment->user_id) : User::where('email', $payment->email)->first();

        if (! $user) {
            return;
        }

        $plan = $payment->plan
            ?? SubscriptionPlan::query()->find($payment->metadata['plan_id'] ?? null);

        $nextPayment = $plan?->nextPaymentAt()
            ?? (isset($transaction['plan_object']['interval'])
                ? $this->nextFromInterval($transaction['plan_object']['interval'])
                : now()->addMonth());

        $existing = $user->landlordSubscription;
        $user->landlordSubscription()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'subscription_plan_id' => $plan?->id,
                'paystack_customer_code' => $transaction['customer']['customer_code'] ?? $existing?->paystack_customer_code,
                'paystack_subscription_code' => $transaction['subscription']['subscription_code']
                    ?? $payment->metadata['subscription_code']
                    ?? $existing?->paystack_subscription_code,
                'paystack_email_token' => $transaction['subscription']['email_token']
                    ?? $existing?->paystack_email_token,
                'status' => 'active',
                'starts_at' => $existing?->starts_at ?? now(),
                'next_payment_at' => $nextPayment,
                'ends_at' => null,
            ],
        );
    }

    protected function unlockListing(PlatformPayment $payment, ?Request $request): void
    {
        ListingContactUnlock::query()->updateOrCreate(
            [
                'property_id' => $payment->property_id,
                'email' => strtolower($payment->email),
            ],
            [
                'platform_payment_id' => $payment->id,
                'unlocked_at' => now(),
                'expires_at' => now()->addDays(90),
            ],
        );

        $this->applyUnlockSession($payment, $request);
    }

    protected function metadata(array $transaction): array
    {
        $meta = $transaction['metadata'] ?? [];

        if (is_string($meta)) {
            $decoded = json_decode($meta, true);
            $meta = is_array($decoded) ? $decoded : [];
        }

        if (isset($meta['custom_fields']) && is_array($meta) && ! isset($meta['type'])) {
            foreach ($meta['custom_fields'] as $field) {
                if (($field['variable_name'] ?? '') === 'type') {
                    $meta['type'] = $field['value'] ?? null;
                }
            }
        }

        return is_array($meta) ? $meta : [];
    }

    protected function nextFromInterval(string $interval): Carbon
    {
        return match ($interval) {
            'quarterly' => now()->addMonths(3),
            'annually' => now()->addYear(),
            default => now()->addMonth(),
        };
    }
}
