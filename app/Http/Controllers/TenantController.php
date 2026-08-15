<?php

namespace App\Http\Controllers;

use App\Models\Lease;
use App\Models\PaymentReceipt;
use App\Models\Property;
use App\Models\TenantProfile;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $propertyIds = $this->getAccessiblePropertyIds($user);

        $leases = Lease::with(['tenant.tenantProfile', 'property', 'unit', 'receipts'])
            ->whereIn('property_id', $propertyIds)
            ->latest()
            ->get();

        return Inertia::render('Tenants/Index', [
            'leases' => $leases,
        ]);
    }

    public function create(Request $request): Response
    {
        $user = $request->user();
        $propertyIds = $this->getAccessiblePropertyIds($user);

        $properties = Property::with(['units' => function ($q) {
            $q->where('status', 'vacant');
        }])->whereIn('id', $propertyIds)->get();

        return Inertia::render('Tenants/Create', [
            'properties' => $properties,
            'identificationTypes' => TenantProfile::ID_TYPES,
        ]);
    }

    public function lookup(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::with('tenantProfile')->where('email', $request->email)->first();

        if (! $user) {
            return response()->json([
                'exists' => false,
                'available' => true,
            ]);
        }

        if (! $user->isTenant()) {
            return response()->json([
                'exists' => true,
                'available' => false,
                'message' => 'This email already belongs to a landlord, assistant, or staff account and cannot be used for a tenant.',
            ]);
        }

        $profile = $user->tenantProfile;

        return response()->json([
            'exists' => true,
            'available' => true,
            'message' => 'This tenant already has an E-Landlord account. Adding a lease will use their existing profile so they are not duplicated.',
            'tenant' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'identification_type' => $profile?->identification_type,
                'identification_number' => $profile?->identification_number,
                'identification_expiry' => $profile?->identification_expiry?->format('Y-m-d'),
                'date_of_birth' => $profile?->date_of_birth?->format('Y-m-d'),
                'nationality' => $profile?->nationality,
                'occupation' => $profile?->occupation,
                'employer' => $profile?->employer,
                'permanent_address' => $profile?->permanent_address,
                'emergency_contact_name' => $profile?->emergency_contact_name,
                'emergency_contact_relationship' => $profile?->emergency_contact_relationship,
                'emergency_contact_phone' => $profile?->emergency_contact_phone,
                'emergency_contact_email' => $profile?->emergency_contact_email,
                'notes' => $profile?->notes,
                'has_identification_document' => $profile?->hasIdentificationDocument() ?? false,
                'identification_document_name' => $profile?->identification_document_name,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'identification_type' => ['nullable', Rule::in(array_keys(TenantProfile::ID_TYPES))],
            'identification_number' => 'nullable|string|max:80',
            'identification_expiry' => 'nullable|date',
            'identification_document' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:5120'],
            'date_of_birth' => 'nullable|date|before:today',
            'nationality' => 'nullable|string|max:80',
            'occupation' => 'nullable|string|max:120',
            'employer' => 'nullable|string|max:120',
            'permanent_address' => 'nullable|string|max:255',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_relationship' => 'nullable|string|max:80',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'emergency_contact_email' => 'nullable|email|max:255',
            'property_id' => 'required|exists:properties,id',
            'unit_id' => 'required|exists:units,id',
            'lease_start' => 'required|date',
            'lease_end' => 'required|date|after:lease_start',
            'rent_amount' => 'required|numeric|min:0',
            'security_deposit' => 'nullable|numeric|min:0',
            'payment_cycle' => 'required|in:monthly,quarterly,yearly',
            'notes' => 'nullable|string|max:2000',
        ]);

        $currentUser = $request->user();
        $propertyIds = $this->getAccessiblePropertyIds($currentUser);

        if (! $propertyIds->map(fn ($id) => (int) $id)->contains((int) $request->property_id)) {
            abort(403, 'You cannot add a tenant to this property.');
        }

        $existingUser = User::where('email', $request->email)->first();

        if ($existingUser && ! $existingUser->isTenant()) {
            return back()->withErrors([
                'email' => 'This email already belongs to a landlord, assistant, or staff account.',
            ])->withInput();
        }

        $isNewTenant = ! $existingUser;

        if ($isNewTenant) {
            $tenantUser = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'role' => 'tenant',
                'password' => Hash::make('password123'),
                'created_by_user_id' => $currentUser->id,
                'email_verified_at' => now(),
            ]);
        } else {
            $tenantUser = $existingUser;
            if (blank($tenantUser->phone) && $request->filled('phone')) {
                $tenantUser->update(['phone' => $request->phone]);
            }
        }

        $this->syncProfile($tenantUser, $request->only([
            'identification_type',
            'identification_number',
            'identification_expiry',
            'date_of_birth',
            'nationality',
            'occupation',
            'employer',
            'permanent_address',
            'emergency_contact_name',
            'emergency_contact_relationship',
            'emergency_contact_phone',
            'emergency_contact_email',
        ]), $isNewTenant);

        $this->storeIdentificationDocument($tenantUser, $request);

        $property = Property::findOrFail($request->property_id);
        $unit = Unit::findOrFail($request->unit_id);

        if ((int) $unit->property_id !== (int) $property->id) {
            return back()->withErrors(['unit_id' => 'That unit does not belong to the selected property.'])->withInput();
        }

        $activeOnUnit = Lease::where('unit_id', $unit->id)->where('status', 'active')->exists();
        if ($activeOnUnit) {
            return back()->withErrors(['unit_id' => 'This unit already has an active lease.'])->withInput();
        }

        Lease::create([
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

        $unit->update(['status' => 'occupied']);

        $message = $isNewTenant
            ? 'Tenant added and lease created successfully.'
            : 'Lease added to the existing tenant account. They can now rent this property without a duplicate profile.';

        return redirect()->route('tenants.index')->with('success', $message);
    }

    public function show(Request $request, User $tenant): Response
    {
        abort_unless($tenant->isTenant(), 404);

        $currentUser = $request->user();
        $propertyIds = $this->getAccessiblePropertyIds($currentUser);
        $isOwner = $currentUser->is($tenant);
        $isAdmin = $currentUser->isSuperAdmin();

        if (! $isAdmin && ! $isOwner) {
            $hasAccess = Lease::where('tenant_user_id', $tenant->id)
                ->whereIn('property_id', $propertyIds)
                ->exists();
            abort_unless($hasAccess, 403);
        }

        $leasesQuery = Lease::with(['property', 'unit', 'landlord', 'receipts'])
            ->where('tenant_user_id', $tenant->id)
            ->latest();

        $receiptsQuery = PaymentReceipt::with(['property', 'unit'])
            ->where('tenant_user_id', $tenant->id)
            ->latest();

        if (! $isAdmin && ! $isOwner) {
            $leasesQuery->whereIn('property_id', $propertyIds);
            $receiptsQuery->whereIn('property_id', $propertyIds);
        }

        $hasOtherLandlords = ! $isAdmin && Lease::where('tenant_user_id', $tenant->id)
            ->whereNotIn('property_id', $propertyIds)
            ->exists();

        $tenant->load('tenantProfile');
        $profile = $tenant->tenantProfile;

        return Inertia::render('Tenants/Show', [
            'tenant' => $tenant->only(['id', 'name', 'email', 'phone', 'role']),
            'profile' => $profile ? [
                ...$profile->only([
                    'identification_type',
                    'identification_number',
                    'nationality',
                    'occupation',
                    'employer',
                    'permanent_address',
                    'emergency_contact_name',
                    'emergency_contact_relationship',
                    'emergency_contact_phone',
                    'emergency_contact_email',
                ]),
                'identification_expiry' => $profile->identification_expiry?->format('M j, Y'),
                'date_of_birth' => $profile->date_of_birth?->format('M j, Y'),
                'has_identification_document' => $profile->hasIdentificationDocument(),
                'identification_document_name' => $profile->identification_document_name,
                'identification_document_is_image' => $profile->identificationDocumentIsImage(),
                'identification_document_url' => $profile->hasIdentificationDocument()
                    ? route('tenants.identification', $tenant)
                    : null,
            ] : null,
            'identificationTypes' => TenantProfile::ID_TYPES,
            'leases' => $leasesQuery->get(),
            'receipts' => $receiptsQuery->get(),
            'hasOtherLandlords' => $hasOtherLandlords,
        ]);
    }

    public function identification(Request $request, User $tenant)
    {
        abort_unless($tenant->isTenant(), 404);

        $this->assertCanViewTenant($request->user(), $tenant);

        $profile = $tenant->tenantProfile;
        abort_unless($profile?->hasIdentificationDocument(), 404);
        abort_unless(Storage::disk('local')->exists($profile->identification_document_path), 404);

        $download = $request->boolean('download');

        return Storage::disk('local')->response(
            $profile->identification_document_path,
            $profile->identification_document_name ?: 'identification',
            [
                'Content-Type' => $profile->identification_document_mime ?: 'application/octet-stream',
            ],
            $download ? 'attachment' : 'inline'
        );
    }

    public function destroy(Request $request, User $tenant): RedirectResponse
    {
        abort_unless($tenant->isTenant(), 404);

        $currentUser = $request->user();
        abort_unless($currentUser->isSuperAdmin() || $currentUser->isLandlord() || $currentUser->isAssistant() || $currentUser->isAgent(), 403);

        $propertyIds = $this->getAccessiblePropertyIds($currentUser);
        $leases = Lease::with('unit')
            ->where('tenant_user_id', $tenant->id)
            ->whereIn('property_id', $propertyIds)
            ->get();

        abort_if($leases->isEmpty(), 403, 'You cannot remove this tenant.');

        $hasOtherLandlords = Lease::where('tenant_user_id', $tenant->id)
            ->whereNotIn('property_id', $propertyIds)
            ->exists();

        foreach ($leases as $lease) {
            if ($lease->status === 'active') {
                $lease->unit?->update(['status' => 'vacant']);
            }
            $lease->update(['status' => 'terminated']);
        }

        if (! $hasOtherLandlords) {
            $this->deleteTenantAccount($tenant);

            return redirect()->route('tenants.index')->with('success', 'Tenant removed. Their leases were ended and the account was deleted.');
        }

        return redirect()->route('tenants.index')->with('success', 'Tenant removed from your properties. Units are now vacant.');
    }

    public function removeLease(Request $request, Lease $lease): RedirectResponse
    {
        $propertyIds = $this->getAccessiblePropertyIds($request->user());
        abort_unless($propertyIds->map(fn ($id) => (int) $id)->contains((int) $lease->property_id), 403);

        $lease->load('unit');

        if ($lease->status === 'active') {
            $lease->unit?->update(['status' => 'vacant']);
        }

        $lease->update(['status' => 'terminated']);

        return back()->with('success', 'Tenant was removed from this unit.');
    }

    private function storeIdentificationDocument(User $tenant, Request $request): void
    {
        if (! $request->hasFile('identification_document')) {
            return;
        }

        $profile = $tenant->tenantProfile()->firstOrCreate([]);

        if (filled($profile->identification_document_path)) {
            return;
        }

        $file = $request->file('identification_document');

        $profile->update([
            'identification_document_path' => $file->store('tenant-ids', 'local'),
            'identification_document_name' => $file->getClientOriginalName(),
            'identification_document_mime' => $file->getClientMimeType(),
        ]);
    }

    private function assertCanViewTenant(User $currentUser, User $tenant): void
    {
        if ($currentUser->isSuperAdmin() || $currentUser->is($tenant)) {
            return;
        }

        $propertyIds = $this->getAccessiblePropertyIds($currentUser);
        $hasAccess = Lease::where('tenant_user_id', $tenant->id)
            ->whereIn('property_id', $propertyIds)
            ->exists();

        abort_unless($hasAccess, 403);
    }

    private function syncProfile(User $tenant, array $data, bool $overwrite): void
    {
        $profile = $tenant->tenantProfile ?: new TenantProfile(['user_id' => $tenant->id]);

        foreach ($data as $field => $value) {
            if ($value === null || $value === '') {
                continue;
            }

            if ($overwrite || blank($profile->{$field})) {
                $profile->{$field} = $value;
            }
        }

        $profile->save();
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

    private function deleteTenantAccount(User $tenant): void
    {
        $profile = $tenant->tenantProfile;

        if ($profile?->identification_document_path) {
            Storage::disk('local')->delete($profile->identification_document_path);
        }

        $tenant->delete();
    }
}
