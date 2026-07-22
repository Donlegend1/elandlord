<?php

namespace App\Http\Controllers;

use App\Models\Lease;
use App\Models\PaymentReceipt;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ReceiptController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = PaymentReceipt::with(['tenant', 'property', 'unit', 'createdBy']);

        if ($user->isTenant()) {
            $query->where('tenant_user_id', $user->id);
        } else if ($user->isLandlord()) {
            $propIds = Property::where('landlord_id', $user->id)->pluck('id');
            $query->whereIn('property_id', $propIds);
        } else if ($user->isAssistant() || $user->isAgent()) {
            $propIds = $user->assignedProperties()->pluck('properties.id');
            $query->whereIn('property_id', $propIds);
        }

        $receipts = $query->latest()->get();

        $leases = Lease::with(['tenant', 'property', 'unit'])
            ->when($user->isLandlord(), fn($q) => $q->where('landlord_id', $user->id))
            ->when($user->isAssistant() || $user->isAgent(), fn($q) => $q->whereIn('property_id', $user->assignedProperties()->pluck('properties.id')))
            ->where('status', 'active')
            ->get();

        return Inertia::render('Receipts/Index', [
            'receipts' => $receipts,
            'activeLeases' => $leases,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'lease_id' => 'required|exists:leases,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'period_covered' => 'required|string|max:100',
            'payment_method' => 'required|in:cash,bank_transfer,cheque,online_card',
            'transaction_reference' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        $user = $request->user();
        $lease = Lease::findOrFail($request->lease_id);

        $receiptNumber = 'EL-' . date('Y') . '-' . strtoupper(Str::random(6));

        $receipt = PaymentReceipt::create([
            'receipt_number' => $receiptNumber,
            'lease_id' => $lease->id,
            'tenant_user_id' => $lease->tenant_user_id,
            'property_id' => $lease->property_id,
            'unit_id' => $lease->unit_id,
            'amount' => $request->amount,
            'payment_date' => $request->payment_date,
            'period_covered' => $request->period_covered,
            'payment_method' => $request->payment_method,
            'transaction_reference' => $request->transaction_reference,
            'notes' => $request->notes,
            'created_by_user_id' => $user->id,
        ]);

        return redirect()->route('receipts.show', $receipt->id)->with('success', 'Payment recorded & Digital Receipt generated successfully!');
    }

    public function show(Request $request, PaymentReceipt $receipt)
    {
        $user = $request->user();

        $receipt->load(['tenant', 'property.landlord', 'unit', 'createdBy']);

        return Inertia::render('Receipts/Show', [
            'receipt' => $receipt,
        ]);
    }
}
