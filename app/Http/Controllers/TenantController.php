<?php

namespace App\Http\Controllers;

use App\Models\Lease;
use App\Models\PaymentReceipt;
use App\Models\Property;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class TenantController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $propertyIds = $this->getAccessiblePropertyIds($user);

        $leases = Lease::with(['tenant', 'property', 'unit', 'receipts'])
            ->whereIn('property_id', $propertyIds)
            ->latest()
            ->get();

        return Inertia::render('Tenants/Index', [
            'leases' => $leases,
        ]);
    }

    public function create(Request $request)
    {
        $user = $request->user();
        $propertyIds = $this->getAccessiblePropertyIds($user);

        $properties = Property::with(['units' => function($q) {
            $q->where('status', 'vacant');
        }])->whereIn('id', $propertyIds)->get();

        return Inertia::render('Tenants/Create', [
            'properties' => $properties,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'property_id' => 'required|exists:properties,id',
            'unit_id' => 'required|exists:units,id',
            'lease_start' => 'required|date',
            'lease_end' => 'required|date|after:lease_start',
            'rent_amount' => 'required|numeric|min:0',
            'security_deposit' => 'nullable|numeric|min:0',
            'payment_cycle' => 'required|in:monthly,quarterly,yearly',
        ]);

        $currentUser = $request->user();

        // Find or create tenant User
        $tenantUser = User::where('email', $request->email)->first();

        if (!$tenantUser) {
            $tenantUser = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'role' => 'tenant',
                'password' => Hash::make('password123'), // Default temporary password
                'created_by_user_id' => $currentUser->id,
            ]);
        } else {
            $tenantUser->update(['role' => 'tenant']);
        }

        $property = Property::findOrFail($request->property_id);
        $unit = Unit::findOrFail($request->unit_id);

        $lease = Lease::create([
            'tenant_user_id' => $tenantUser->id,
            'property_id' => $property->id,
            'unit_id' => $unit->id,
            'landlord_id' => $property->landlord_id,
            'lease_start' => $request->lease_start,
            'lease_end' => $request->lease_end,
            'rent_amount' => $request->rent_amount,
            'security_deposit' => $request->security_deposit ?? 0,
            'payment_cycle' => $request->payment_cycle,
            'status' => 'active',
            'notes' => $request->notes,
        ]);

        // Update unit status to occupied
        $unit->update(['status' => 'occupied']);

        return redirect()->route('tenants.index')->with('success', 'Tenant added and lease created successfully.');
    }

    public function show(Request $request, User $tenant)
    {
        $currentUser = $request->user();

        // Get tenant property history (all leases active and past)
        $leases = Lease::with(['property', 'unit', 'landlord', 'receipts'])
            ->where('tenant_user_id', $tenant->id)
            ->latest()
            ->get();

        $receipts = PaymentReceipt::with(['property', 'unit'])
            ->where('tenant_user_id', $tenant->id)
            ->latest()
            ->get();

        return Inertia::render('Tenants/Show', [
            'tenant' => $tenant,
            'leases' => $leases,
            'receipts' => $receipts,
        ]);
    }

    private function getAccessiblePropertyIds($user)
    {
        if ($user->isSuperAdmin()) {
            return Property::pluck('id');
        }

        if ($user->isLandlord()) {
            return Property::where('landlord_id', $user->id)->pluck('id');
        }

        return $user->assignedProperties()->pluck('properties.id');
    }
}
