<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\GalleryImage;
use App\Models\Property;
use App\Models\PropertyAssignment;
use App\Models\State;
use App\Models\Unit;
use App\Models\User;
use App\Services\UnitQuota;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Property::with(['units.images', 'images', 'landlord', 'assignedUsers']);

        if ($user->isLandlord()) {
            $query->where('landlord_id', $user->id);
        } else if ($user->isAssistant() || $user->isAgent()) {
            $assignedIds = $user->assignedProperties()->pluck('properties.id');
            $query->whereIn('id', $assignedIds);
        }

        $properties = $query->latest()->get();

        return Inertia::render('Properties/Index', [
            'properties' => $properties,
            'quota' => app(UnitQuota::class)->payload($user),
        ]);
    }

    public function create(Request $request)
    {
        $user = $request->user();
        $assistants = $user->isLandlord() ? $user->createdAssistants : [];

        return Inertia::render('Properties/Create', [
            'assistants' => $assistants,
            'countries' => Schema::hasTable('countries')
                ? Country::query()->orderBy('name')->get(['id', 'name'])
                : [],
            'sizes' => Property::sizeOptions(),
            'quota' => app(UnitQuota::class)->payload($user),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'country_id' => 'required|exists:countries,id',
            'state_id' => [
                'required',
                Rule::exists('states', 'id')->where(fn ($q) => $q->where('country_id', $request->country_id)),
            ],
            'zip' => 'nullable|string|max:20',
            'type' => 'required|in:residential,commercial,multi-family,industrial',
            'size' => 'required|in:studio,1_bedroom,2_bedroom,3_bedroom,4_bedroom,5_plus',
            'description' => 'nullable|string',
            'images' => 'nullable|array|max:12',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
            'units' => 'required|array|min:1',
            'units.*.unit_number' => 'required|string|max:50',
            'units.*.rent_amount' => 'required|numeric|min:0',
            'units.*.bedrooms' => 'nullable|integer',
            'units.*.bathrooms' => 'nullable|integer',
            'units.*.description' => 'nullable|string',
            'units.*.images' => 'nullable|array|max:8',
            'units.*.images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
            'assistant_ids' => 'nullable|array',
            'assistant_ids.*' => 'exists:users,id',
        ]);

        $user = $request->user();
        $quota = app(UnitQuota::class);

        if ($user->isLandlord() && ! $quota->canAdd($user, count($request->units))) {
            return back()->with('error', $quota->blockMessage($user));
        }

        $country = Country::findOrFail($request->country_id);
        $state = State::findOrFail($request->state_id);

        $property = Property::create([
            'landlord_id' => $user->isLandlord() ? $user->id : ($user->created_by_user_id ?? $user->id),
            'name' => $request->name,
            'address' => $request->address,
            'city' => $request->city,
            'country' => $country->name,
            'country_id' => $country->id,
            'state' => $state->name,
            'state_id' => $state->id,
            'zip' => $request->zip,
            'type' => $request->type,
            'size' => $request->size,
            'description' => $request->description,
            'total_units' => count($request->units),
        ]);

        $this->storeGalleryImages($property, $this->uploadedFiles($request, 'images'), 'properties');

        foreach ($request->units as $index => $unitData) {
            $unit = Unit::create([
                'property_id' => $property->id,
                'unit_number' => $unitData['unit_number'],
                'rent_amount' => $unitData['rent_amount'],
                'deposit_amount' => $unitData['deposit_amount'] ?? $unitData['rent_amount'],
                'bedrooms' => $unitData['bedrooms'] ?? 1,
                'bathrooms' => $unitData['bathrooms'] ?? 1,
                'description' => $unitData['description'] ?? null,
                'status' => 'vacant',
            ]);
            $this->storeGalleryImages($unit, $this->uploadedFiles($request, "units.{$index}.images"), 'units');
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

        $property->load(['units.images', 'units.activeLease.tenant', 'images', 'landlord', 'assignedUsers', 'leases.tenant', 'maintenanceRequests.tenant']);
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

        $property->load(['units.images', 'images']);
        $assistants = $user->isLandlord() ? $user->createdAssistants : [];

        $states = [];
        if ($property->country_id && Schema::hasTable('states')) {
            $states = State::query()
                ->where('country_id', $property->country_id)
                ->orderBy('name')
                ->get(['id', 'name']);
        }

        return Inertia::render('Properties/Edit', [
            'property' => $property,
            'assistants' => $assistants,
            'countries' => Schema::hasTable('countries')
                ? Country::query()->orderBy('name')->get(['id', 'name'])
                : [],
            'states' => $states,
            'sizes' => Property::sizeOptions(),
            'quota' => app(UnitQuota::class)->payload($user),
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
            'country_id' => 'required|exists:countries,id',
            'state_id' => [
                'required',
                Rule::exists('states', 'id')->where(fn ($q) => $q->where('country_id', $request->country_id)),
            ],
            'zip' => 'nullable|string|max:20',
            'type' => 'required|in:residential,commercial,multi-family,industrial',
            'size' => 'required|in:studio,1_bedroom,2_bedroom,3_bedroom,4_bedroom,5_plus',
            'description' => 'nullable|string',
            'images' => 'nullable|array|max:12',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
            'remove_image_ids' => 'nullable|array',
            'remove_image_ids.*' => 'integer',
            'units' => 'required|array|min:1',
            'units.*.id' => 'nullable|integer',
            'units.*.unit_number' => 'required|string|max:50',
            'units.*.rent_amount' => 'required|numeric|min:0',
            'units.*.bedrooms' => 'nullable|integer',
            'units.*.bathrooms' => 'nullable|integer',
            'units.*.description' => 'nullable|string',
            'units.*.images' => 'nullable|array|max:8',
            'units.*.images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
            'units.*.remove_image_ids' => 'nullable|array',
            'units.*.remove_image_ids.*' => 'integer',
        ]);

        $quota = app(UnitQuota::class);
        $existingCount = $property->units()->count();
        $delta = count($request->units) - $existingCount;

        if ($user->isLandlord() && $delta > 0 && ! $quota->canAdd($user, $delta)) {
            return back()->with('error', $quota->blockMessage($user));
        }

        $country = Country::findOrFail($request->country_id);
        $state = State::findOrFail($request->state_id);

        $property->update([
            'name' => $request->name,
            'address' => $request->address,
            'city' => $request->city,
            'country' => $country->name,
            'country_id' => $country->id,
            'state' => $state->name,
            'state_id' => $state->id,
            'zip' => $request->zip,
            'type' => $request->type,
            'size' => $request->size,
            'description' => $request->description,
            'total_units' => count($request->units),
        ]);

        $this->removeGalleryImages($property, $request->input('remove_image_ids', []));
        $this->storeGalleryImages($property, $this->uploadedFiles($request, 'images'), 'properties');

        $keptIds = [];

        foreach ($request->units as $index => $unitData) {
            $existing = null;

            if (! empty($unitData['id'])) {
                $existing = $property->units()->where('id', $unitData['id'])->first();
            }

            if ($existing) {
                $existing->update([
                    'unit_number' => $unitData['unit_number'],
                    'rent_amount' => $unitData['rent_amount'],
                    'deposit_amount' => $unitData['deposit_amount'] ?? $existing->deposit_amount,
                    'bedrooms' => $unitData['bedrooms'] ?? $existing->bedrooms,
                    'bathrooms' => $unitData['bathrooms'] ?? $existing->bathrooms,
                    'description' => $unitData['description'] ?? null,
                ]);
                $this->removeGalleryImages($existing, $unitData['remove_image_ids'] ?? []);
                $this->storeGalleryImages($existing, $this->uploadedFiles($request, "units.{$index}.images"), 'units');
                $keptIds[] = $existing->id;
                continue;
            }

            $created = Unit::create([
                'property_id' => $property->id,
                'unit_number' => $unitData['unit_number'],
                'rent_amount' => $unitData['rent_amount'],
                'deposit_amount' => $unitData['deposit_amount'] ?? $unitData['rent_amount'],
                'bedrooms' => $unitData['bedrooms'] ?? 1,
                'bathrooms' => $unitData['bathrooms'] ?? 1,
                'description' => $unitData['description'] ?? null,
                'status' => 'vacant',
            ]);
            $this->storeGalleryImages($created, $this->uploadedFiles($request, "units.{$index}.images"), 'units');
            $keptIds[] = $created->id;
        }

        $property->units()
            ->whereNotIn('id', $keptIds)
            ->where('status', 'vacant')
            ->get()
            ->each(function (Unit $unit) {
                $this->deleteAllGalleryImages($unit);
                $unit->delete();
            });

        $property->update(['total_units' => $property->units()->count()]);

        return redirect()->route('properties.show', $property->id)->with('success', 'Property updated successfully.');
    }

    public function destroy(Request $request, Property $property)
    {
        $user = $request->user();
        if (!$user->isSuperAdmin() && $property->landlord_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $property->load(['units.images', 'images']);
        $property->units->each(fn (Unit $unit) => $this->deleteAllGalleryImages($unit));
        $this->deleteAllGalleryImages($property);

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

    private function uploadedFiles(Request $request, string $key): array
    {
        $files = $request->file($key);

        if (! $files) {
            return [];
        }

        return is_array($files) ? array_values(array_filter($files)) : [$files];
    }

    private function storeGalleryImages($model, array $files, string $directory): void
    {
        if ($files === []) {
            return;
        }

        $sort = (int) $model->images()->max('sort_order');

        foreach ($files as $file) {
            $sort++;
            $model->images()->create([
                'path' => GalleryImage::storeUpload($file, $directory),
                'sort_order' => $sort,
            ]);
        }

        $this->syncCoverImage($model);
    }

    private function removeGalleryImages($model, array $ids): void
    {
        $ids = array_values(array_filter($ids));

        if ($ids === []) {
            return;
        }

        $model->images()->whereIn('id', $ids)->get()->each(function ($image) {
            $image->deleteFile();
            $image->delete();
        });

        $this->syncCoverImage($model);
    }

    private function deleteAllGalleryImages($model): void
    {
        $model->loadMissing('images');
        $model->images->each(function ($image) {
            $image->deleteFile();
            $image->delete();
        });
    }

    private function syncCoverImage($model): void
    {
        $first = $model->images()->orderBy('sort_order')->first();
        $model->update(['image_path' => $first?->path]);
    }
}
