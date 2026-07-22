<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyAssignment;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Property::with(['units', 'landlord', 'assignedUsers']);

        if ($user->isLandlord()) {
            $query->where('landlord_id', $user->id);
        } else if ($user->isAssistant() || $user->isAgent()) {
            $assignedIds = $user->assignedProperties()->pluck('properties.id');
            $query->whereIn('id', $assignedIds);
        }

        $properties = $query->latest()->get();

        return Inertia::render('Properties/Index', [
            'properties' => $properties,
        ]);
    }

    public function create(Request $request)
    {
        $user = $request->user();
        $assistants = $user->isLandlord() ? $user->createdAssistants : [];

        return Inertia::render('Properties/Create', [
            'assistants' => $assistants,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'nullable|string|max:100',
            'zip' => 'nullable|string|max:20',
            'type' => 'required|in:residential,commercial,multi-family,industrial',
            'description' => 'nullable|string',
            'units' => 'required|array|min:1',
            'units.*.unit_number' => 'required|string|max:50',
            'units.*.rent_amount' => 'required|numeric|min:0',
            'units.*.bedrooms' => 'nullable|integer',
            'units.*.bathrooms' => 'nullable|integer',
            'assistant_ids' => 'nullable|array',
            'assistant_ids.*' => 'exists:users,id',
        ]);

        $user = $request->user();

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('properties', 'public');
        }

        $property = Property::create([
            'landlord_id' => $user->isLandlord() ? $user->id : ($user->created_by_user_id ?? $user->id),
            'name' => $request->name,
            'address' => $request->address,
            'city' => $request->city,
            'state' => $request->state,
            'zip' => $request->zip,
            'type' => $request->type,
            'description' => $request->description,
            'image_path' => $imagePath,
            'total_units' => count($request->units),
        ]);

        foreach ($request->units as $unitData) {
            Unit::create([
                'property_id' => $property->id,
                'unit_number' => $unitData['unit_number'],
                'rent_amount' => $unitData['rent_amount'],
                'deposit_amount' => $unitData['deposit_amount'] ?? $unitData['rent_amount'],
                'bedrooms' => $unitData['bedrooms'] ?? 1,
                'bathrooms' => $unitData['bathrooms'] ?? 1,
                'status' => 'vacant',
            ]);
        }

        if ($request->filled('assistant_ids')) {
            foreach ($request->assistant_ids as $assistantId) {
                PropertyAssignment::create([
                    'user_id' => $assistantId,
                    'property_id' => $property->id,
                    'role_assigned' => 'assistant',
                ]);
            }
        }

        return redirect()->route('properties.index')->with('success', 'Property registered successfully.');
    }

    public function show(Request $request, Property $property)
    {
        $user = $request->user();
        $this->authorizePropertyAccess($user, $property);

        $property->load(['units.activeLease.tenant', 'landlord', 'assignedUsers', 'leases.tenant', 'maintenanceRequests.tenant']);
        $assistants = $user->isLandlord() ? $user->createdAssistants : [];

        return Inertia::render('Properties/Show', [
            'property' => $property,
            'assistants' => $assistants,
        ]);
    }

    public function edit(Request $request, Property $property)
    {
        $user = $request->user();
        $this->authorizePropertyAccess($user, $property);

        $property->load('units');
        $assistants = $user->isLandlord() ? $user->createdAssistants : [];

        return Inertia::render('Properties/Edit', [
            'property' => $property,
            'assistants' => $assistants,
        ]);
    }

    public function update(Request $request, Property $property)
    {
        $user = $request->user();
        $this->authorizePropertyAccess($user, $property);

        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'nullable|string|max:100',
            'zip' => 'nullable|string|max:20',
            'type' => 'required|in:residential,commercial,multi-family,industrial',
            'description' => 'nullable|string',
        ]);

        $property->update($request->only(['name', 'address', 'city', 'state', 'zip', 'type', 'description']));

        return redirect()->route('properties.show', $property->id)->with('success', 'Property updated successfully.');
    }

    public function destroy(Request $request, Property $property)
    {
        $user = $request->user();
        if (!$user->isSuperAdmin() && $property->landlord_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $property->delete();
        return redirect()->route('properties.index')->with('success', 'Property deleted successfully.');
    }

    public function assignAssistant(Request $request, Property $property)
    {
        $user = $request->user();
        if (!$user->isSuperAdmin() && $property->landlord_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'assistant_ids' => 'array',
            'assistant_ids.*' => 'exists:users,id',
        ]);

        PropertyAssignment::where('property_id', $property->id)->where('role_assigned', 'assistant')->delete();

        if ($request->filled('assistant_ids')) {
            foreach ($request->assistant_ids as $assistantId) {
                PropertyAssignment::create([
                    'user_id' => $assistantId,
                    'property_id' => $property->id,
                    'role_assigned' => 'assistant',
                ]);
            }
        }

        return back()->with('success', 'Assistants assigned successfully.');
    }

    private function authorizePropertyAccess($user, Property $property)
    {
        if ($user->isSuperAdmin()) return;
        if ($user->isLandlord() && $property->landlord_id === $user->id) return;
        if (($user->isAssistant() || $user->isAgent()) && $user->assignedProperties->contains('id', $property->id)) return;

        abort(403, 'Access denied to this property.');
    }
}
