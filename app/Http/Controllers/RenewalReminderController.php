<?php

namespace App\Http\Controllers;

use App\Models\Lease;
use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RenewalReminderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Lease::with(['tenant', 'property', 'unit', 'landlord'])
            ->where('status', 'active');

        if ($user->isTenant()) {
            $query->where('tenant_user_id', $user->id);
        } else if ($user->isLandlord()) {
            $query->where('landlord_id', $user->id);
        } else if ($user->isAssistant() || $user->isAgent()) {
            $propIds = $user->assignedProperties()->pluck('properties.id');
            $query->whereIn('property_id', $propIds);
        }

        $allLeases = $query->get();

        $expiring30Days = $allLeases->filter(fn($l) => $l->lease_end->lte(now()->addDays(30)) && $l->lease_end->gte(now()));
        $expiring60Days = $allLeases->filter(fn($l) => $l->lease_end->lte(now()->addDays(60)) && $l->lease_end->gt(now()->addDays(30)));
        $expiredLeases = $allLeases->filter(fn($l) => $l->lease_end->lt(now()));

        return Inertia::render('Renewals/Index', [
            'expiring30Days' => $expiring30Days->values(),
            'expiring60Days' => $expiring60Days->values(),
            'expiredLeases' => $expiredLeases->values(),
            'allActiveLeases' => $allLeases->values(),
        ]);
    }

    public function renewLease(Request $request, Lease $lease)
    {
        $request->validate([
            'new_lease_end' => 'required|date|after:' . $lease->lease_end->format('Y-m-d'),
            'new_rent_amount' => 'nullable|numeric|min:0',
        ]);

        $lease->update([
            'lease_end' => $request->new_lease_end,
            'rent_amount' => $request->new_rent_amount ?? $lease->rent_amount,
            'status' => 'active',
        ]);

        return back()->with('success', 'Lease renewed successfully.');
    }
}
