<?php

namespace App\Http\Controllers;

use App\Models\BillingSetting;
use App\Models\PlatformPayment;
use App\Models\SubscriptionPlan;
use App\Services\BillingFulfillment;
use App\Services\PaystackService;
use App\Services\UnitQuota;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;
use Throwable;

class BillingController extends Controller
{
    public function index(Request $request, UnitQuota $quota): Response
    {
        $user = $request->user();
        abort_unless($user->isLandlord() || $user->isSuperAdmin(), 403);

        $this->ensureDefaultPlans();

        $user->load('landlordSubscription.plan');

        return Inertia::render('Billing/Index', [
            'quota' => $quota->payload($user),
            'plans' => SubscriptionPlan::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get()
                ->map(fn (SubscriptionPlan $plan) => [
                    'id' => $plan->id,
                    'interval' => $plan->interval,
                    'name' => $plan->name,
                    'amount' => $plan->amount,
                    'description' => $plan->description,
                    'features' => $plan->features ?? [],
                    'period_label' => $plan->periodLabel(),
                ]),
            'subscription' => $user->landlordSubscription,
            'currency' => BillingSetting::currency(),
            'paystack_configured' => PaystackService::configured(),
        ]);
    }

    public function subscribe(Request $request, PaystackService $paystack): HttpResponse
    {
        $user = $request->user();
        abort_unless($user->isLandlord(), 403);

        $data = $request->validate([
            'plan_id' => 'required|integer|exists:subscription_plans,id',
        ]);

        $plan = SubscriptionPlan::query()->where('is_active', true)->findOrFail($data['plan_id']);

        if (! PaystackService::configured()) {
            return back()->with('error', 'Paystack is not configured yet. Ask the super admin to add the API keys.');
        }

        try {
            if (! $plan->paystack_plan_code) {
                $paystack->syncPlan($plan);
            }

            $reference = 'SUB-'.$user->id.'-'.Str::upper(Str::random(12));

            PlatformPayment::query()->create([
                'user_id' => $user->id,
                'subscription_plan_id' => $plan->id,
                'type' => 'subscription',
                'email' => $user->email,
                'amount' => $plan->amount,
                'currency' => BillingSetting::currency(),
                'reference' => $reference,
                'status' => 'pending',
                'metadata' => [
                    'type' => 'subscription',
                    'plan_id' => $plan->id,
                    'user_id' => $user->id,
                ],
            ]);

            $initialized = $paystack->initialize([
                'email' => $user->email,
                'amount' => $paystack->toSubunit($plan->amount),
                'plan' => $plan->paystack_plan_code,
                'reference' => $reference,
                'callback_url' => $request->getSchemeAndHttpHost().route('billing.callback', [], false),
                'metadata' => [
                    'type' => 'subscription',
                    'plan_id' => $plan->id,
                    'user_id' => $user->id,
                ],
            ]);
        } catch (Throwable $e) {
            return back()->with('error', $e->getMessage());
        }

        return Inertia::location($initialized['authorization_url']);
    }

    public function callback(Request $request, PaystackService $paystack, BillingFulfillment $fulfillment): RedirectResponse
    {
        $reference = $request->query('reference');

        if (! $reference) {
            return redirect()->route('billing.index')->with('error', 'Missing payment reference.');
        }

        try {
            $transaction = $paystack->verify($reference);
            $payment = $fulfillment->fulfillVerifiedPayment($transaction, $request);
        } catch (Throwable $e) {
            return redirect()->route('billing.index')->with('error', $e->getMessage());
        }

        if ($payment->status !== 'success') {
            return redirect()->route('billing.index')->with('error', 'Payment was not completed.');
        }

        return redirect()->route('billing.index')->with('success', 'Subscription is active. You can add more units.');
    }

    protected function ensureDefaultPlans(): void
    {
        if (SubscriptionPlan::query()->exists()) {
            return;
        }

        app(\Database\Seeders\BillingSeeder::class)->run();
    }
}
