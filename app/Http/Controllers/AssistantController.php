<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyAssignment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AssistantController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user->isLandlord() && !$user->isSuperAdmin()) {
            abort(403, 'Only Landlords or Super Admins can manage assistants.');
        }

        $assistants = User::with('assignedProperties')
            ->where('role', 'assistant')
            ->when($user->isLandlord(), fn($q) => $q->where('created_by_user_id', $user->id))
            ->latest()
            ->get();

        $properties = Property::when($user->isLandlord(), fn($q) => $q->where('landlord_id', $user->id))->get();

        return Inertia::render('Assistants/Index', [
            'assistants' => $assistants,
            'properties' => $properties,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user->isLandlord() && !$user->isSuperAdmin()) {
            abort(403, 'Only Landlords can create assistants.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:6',
            'property_ids' => 'nullable|array',
            'property_ids.*' => 'exists:properties,id',
        ]);

        $assistant = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'role' => 'assistant',
            'password' => Hash::make($request->password),
            'created_by_user_id' => $user->id,
            'email_verified_at' => now(),
        ]);

        if ($request->filled('property_ids')) {
            foreach ($request->property_ids as $propId) {
                PropertyAssignment::create([
                    'user_id' => $assistant->id,
                    'property_id' => $propId,
                    'role_assigned' => 'assistant',
                ]);
            }
        }

        return redirect()->route('assistants.index')->with('success', 'Assistant account created and properties assigned successfully.');
    }

    public function assignProperties(Request $request, User $assistant)
    {
        $user = $request->user();

        if (!$user->isLandlord() && !$user->isSuperAdmin()) {
            abort(403, 'Unauthorized.');
        }

        $request->validate([
            'property_ids' => 'nullable|array',
            'property_ids.*' => 'exists:properties,id',
        ]);

        PropertyAssignment::where('user_id', $assistant->id)->delete();

        if ($request->filled('property_ids')) {
            foreach ($request->property_ids as $propId) {
                PropertyAssignment::create([
                    'user_id' => $assistant->id,
                    'property_id' => $propId,
                    'role_assigned' => 'assistant',
                ]);
            }
        }

        return back()->with('success', 'Assigned properties updated successfully.');
    }
}
