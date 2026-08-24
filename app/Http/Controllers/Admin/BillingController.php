<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BillingSetting;
use App\Models\LandlordSubscription;
use App\Models\PlatformPayment;
use App\Models\SubscriptionPlan;
use App\Services\PaystackService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class BillingController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->isSuperAdmin(), 403);

        $this->ensureDefaultPlans();

        return Inertia::render('Admin/Billing/Index', [
            'settings' => [
                'free_unit_limit' => BillingSetting::freeUnitLimit(),
                'listing_contact_fee' => BillingSetting::listingContactFee(),
                'currency' => BillingSetting::currency(),
            ],
            'plans' => SubscriptionPlan::query()->orderBy('sort_order')->get(),
            'paystack_configured' => PaystackService::configured(),
            'subscriptions' => LandlordSubscription::query()
                ->with(['user:id,name,email', 'plan:id,name,interval'])
                ->latest()
                ->take(20)
                ->get(),
            'payments' => PlatformPayment::query()
                ->latest()
                ->take(20)
                ->get(['id', 'type', 'email', 'amount', 'currency', 'status', 'reference', 'paid_at', 'created_at']),
        ]);
    }

    public function updateSettings(Request $request): RedirectResponse
    {
        abort_unless($request->user()->isSuperAdmin(), 403);

        $data = $request->validate([
            'free_unit_limit' => 'required|integer|min:0|max:10000',
            'listing_contact_fee' => 'required|numeric|min:0',
            'currency' => 'required|string|in:NGN,USD,GHS,ZAR,KES',
            'plans' => 'required|array|size:3',
            'plans.*.id' => 'required|integer|exists:subscription_plans,id',
            'plans.*.name' => 'required|string|max:120',
            'plans.*.amount' => 'required|numeric|min:0',
            'plans.*.description' => 'nullable|string|max:255',
            'plans.*.is_active' => 'required|boolean',
        ]);

        BillingSetting::setValue('free_unit_limit', $data['free_unit_limit']);
        BillingSetting::setValue('listing_contact_fee', $data['listing_contact_fee']);
        BillingSetting::setValue('currency', $data['currency']);

        $paystack = app(PaystackService::class);
        $warnings = [];

        foreach ($data['plans'] as $planData) {
            $plan = SubscriptionPlan::findOrFail($planData['id']);
            $plan->update([
                'name' => $planData['name'],
                'amount' => $planData['amount'],
                'description' => $planData['description'] ?? null,
                'is_active' => $planData['is_active'],
            ]);

            if (PaystackService::configured() && $plan->is_active) {
                try {
                    $paystack->syncPlan($plan);
                } catch (Throwable $e) {
                    $warnings[] = $plan->name.': '.$e->getMessage();
                }
            }
        }

        $message = 'Billing settings saved.';
        if ($warnings !== []) {
            return back()->with('error', $message.' Paystack sync: '.implode(' ', $warnings));
        }

        if (! PaystackService::configured()) {
            $message .= ' Add PAYSTACK_SECRET_KEY to .env so landlords can pay.';
        }

        return back()->with('success', $message);
    }

    protected function ensureDefaultPlans(): void
    {
        if (SubscriptionPlan::query()->exists()) {
            return;
        }

        app(\Database\Seeders\BillingSeeder::class)->run();
    }
}
