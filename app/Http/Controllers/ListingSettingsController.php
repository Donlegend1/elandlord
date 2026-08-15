<?php

namespace App\Http\Controllers;

use App\Models\PropertyInquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ListingSettingsController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();

        if (! $user->isLandlord() && ! $user->isSuperAdmin()) {
            abort(403, 'Only landlords can change listing contact settings.');
        }

        $inquiryQuery = PropertyInquiry::query()
            ->with('property:id,name,landlord_id')
            ->latest();

        if ($user->isLandlord()) {
            $inquiryQuery->whereHas('property', fn ($q) => $q->where('landlord_id', $user->id));
        }

        return Inertia::render('Settings/Listing', [
            'settings' => [
                'phone' => $user->phone ?? '',
                'public_contact_display' => $user->public_contact_display === 'agent' ? 'agent' : 'both',
            ],
            'inquiries' => $inquiryQuery->limit(25)->get()->map(fn (PropertyInquiry $inquiry) => [
                'id' => $inquiry->id,
                'name' => $inquiry->name,
                'email' => $inquiry->email,
                'phone' => $inquiry->phone,
                'message' => $inquiry->message,
                'property_name' => $inquiry->property?->name,
                'created_at' => $inquiry->created_at?->toDayDateTimeString(),
            ]),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user->isLandlord() && ! $user->isSuperAdmin()) {
            abort(403, 'Only landlords can change listing contact settings.');
        }

        $data = $request->validate([
            'phone' => 'nullable|string|max:30',
            'public_contact_display' => 'required|in:agent,both',
        ]);

        $user->update($data);

        return back()->with('success', 'Listing contact settings saved.');
    }
}
