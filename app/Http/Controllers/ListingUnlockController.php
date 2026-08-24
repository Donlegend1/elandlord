<?php

namespace App\Http\Controllers;

use App\Models\BillingSetting;
use App\Models\PlatformPayment;
use App\Models\Property;
use App\Services\BillingFulfillment;
use App\Services\PaystackService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response as HttpResponse;
use Throwable;

class ListingUnlockController extends Controller
{
    public function store(Request $request, Property $property, PaystackService $paystack): HttpResponse
    {
        $data = $request->validate([
            'email' => 'required|email|max:255',
        ]);

        $fee = BillingSetting::listingContactFee();

        if ($fee <= 0) {
            return back()->with('success', 'Contact details are already free to view.');
        }

        if (! PaystackService::configured()) {
            return back()->with('error', 'Online payments are not available right now. Send an email inquiry instead.');
        }

        $email = strtolower($data['email']);
        $reference = 'CNT-'.$property->id.'-'.Str::upper(Str::random(12));

        PlatformPayment::query()->create([
            'user_id' => $request->user()?->id,
            'property_id' => $property->id,
            'type' => 'listing_contact',
            'email' => $email,
            'amount' => $fee,
            'currency' => BillingSetting::currency(),
            'reference' => $reference,
            'status' => 'pending',
            'metadata' => [
                'type' => 'listing_contact',
                'property_id' => $property->id,
            ],
        ]);

        try {
            $initialized = $paystack->initialize([
                'email' => $email,
                'amount' => $paystack->toSubunit($fee),
                'reference' => $reference,
                'callback_url' => $request->getSchemeAndHttpHost().route('listings.unlock.callback', $property, false),
                'metadata' => [
                    'type' => 'listing_contact',
                    'property_id' => $property->id,
                ],
            ]);
        } catch (Throwable $e) {
            return back()->with('error', $e->getMessage());
        }

        $request->session()->put('unlock_email', $email);

        return Inertia::location($initialized['authorization_url']);
    }

    public function callback(Request $request, Property $property, PaystackService $paystack, BillingFulfillment $fulfillment): RedirectResponse
    {
        $reference = $request->query('reference');

        if (! $reference) {
            return redirect()->route('listings.show', $property)->with('error', 'Missing payment reference.');
        }

        try {
            $transaction = $paystack->verify($reference);
            $payment = $fulfillment->fulfillVerifiedPayment($transaction, $request);
        } catch (Throwable $e) {
            return redirect()->route('listings.show', $property)->with('error', $e->getMessage());
        }

        if ($payment->status !== 'success') {
            return redirect()->route('listings.show', $property)->with('error', 'Payment was not completed.');
        }

        return redirect()->route('listings.show', $property)->with('success', 'Contact details unlocked.');
    }
}
