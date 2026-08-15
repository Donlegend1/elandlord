<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\Property;
use App\Models\PropertyInquiry;
use App\Models\State;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class ListingController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'country_id' => 'nullable|integer',
            'state_id' => 'nullable|integer',
            'size' => 'nullable|string|in:studio,1_bedroom,2_bedroom,3_bedroom,4_bedroom,5_plus',
        ]);

        $query = Property::query()
            ->with(['units', 'landlord', 'assignedUsers'])
            ->latest();

        if (! empty($filters['country_id'])) {
            $query->where('country_id', $filters['country_id']);
        }

        if (! empty($filters['state_id'])) {
            $query->where('state_id', $filters['state_id']);
        }

        if (! empty($filters['size'])) {
            $size = $filters['size'];
            $query->where(function ($q) use ($size) {
                $q->where('size', $size)
                    ->orWhere(function ($inner) use ($size) {
                        $inner->whereNull('size')->whereHas('units', function ($units) use ($size) {
                            match ($size) {
                                'studio' => $units->where('bedrooms', '<=', 0),
                                '5_plus' => $units->where('bedrooms', '>=', 5),
                                default => $units->where('bedrooms', (int) $size),
                            };
                        });
                    });
            });
        }

        $properties = $query->paginate(12)->withQueryString()->through(fn (Property $property) => $this->card($property));

        $states = [];
        if (! empty($filters['country_id']) && Schema::hasTable('states')) {
            $states = State::query()
                ->where('country_id', $filters['country_id'])
                ->orderBy('name')
                ->get(['id', 'name']);
        }

        return Inertia::render('Listings/Index', [
            'properties' => $properties,
            'filters' => [
                'country_id' => $filters['country_id'] ?? '',
                'state_id' => $filters['state_id'] ?? '',
                'size' => $filters['size'] ?? '',
            ],
            'countries' => Schema::hasTable('countries')
                ? Country::query()->orderBy('name')->get(['id', 'name'])
                : [],
            'states' => $states,
            'sizes' => Property::sizeOptions(),
        ]);
    }

    public function show(Property $property): Response
    {
        $property->load(['units', 'landlord', 'assignedUsers']);

        return Inertia::render('Listings/Show', [
            'property' => [
                ...$this->card($property),
                'address' => $property->address,
                'zip' => $property->zip,
                'description' => $property->description,
                'units' => $property->units->map(fn ($unit) => [
                    'id' => $unit->id,
                    'unit_number' => $unit->unit_number,
                    'rent_amount' => $unit->rent_amount,
                    'bedrooms' => $unit->bedrooms,
                    'bathrooms' => $unit->bathrooms,
                    'status' => $unit->status,
                    'image_url' => $unit->image_url,
                ]),
                'contacts' => $property->publicContacts(),
            ],
        ]);
    }

    public function inquire(Request $request, Property $property): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:30',
            'message' => 'required|string|max:2000',
        ]);

        PropertyInquiry::create([
            'property_id' => $property->id,
            ...$data,
        ]);

        return back()->with('success', 'Your message was sent. The property contact will get back to you.');
    }

    private function card(Property $property): array
    {
        $rents = $property->units->pluck('rent_amount')->filter();

        return [
            'id' => $property->id,
            'name' => $property->name,
            'type' => $property->type,
            'size' => $property->size,
            'size_label' => $property->sizeLabel(),
            'city' => $property->city,
            'state' => $property->state,
            'country' => $property->country,
            'image_url' => $property->image_url,
            'total_units' => $property->units->count() ?: $property->total_units,
            'min_rent' => $rents->min(),
            'max_bedrooms' => $property->units->max('bedrooms'),
        ];
    }
}
