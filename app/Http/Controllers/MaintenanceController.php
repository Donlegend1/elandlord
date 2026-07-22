<?php

namespace App\Http\Controllers;

use App\Models\Lease;
use App\Models\MaintenanceRequest;
use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaintenanceController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = MaintenanceRequest::with(['tenant', 'property', 'unit']);

        if ($user->isTenant()) {
            $query->where('tenant_user_id', $user->id);
        } else if ($user->isLandlord()) {
            $propIds = Property::where('landlord_id', $user->id)->pluck('id');
            $query->whereIn('property_id', $propIds);
        } else if ($user->isAssistant() || $user->isAgent()) {
            $propIds = $user->assignedProperties()->pluck('properties.id');
            $query->whereIn('property_id', $propIds);
        }

        $requests = $query->latest()->get();

        $tenantActiveLeases = $user->isTenant() 
            ? Lease::with(['property', 'unit'])->where('tenant_user_id', $user->id)->where('status', 'active')->get()
            : [];

        return Inertia::render('Maintenance/Index', [
            'maintenanceRequests' => $requests,
            'tenantLeases' => $tenantActiveLeases,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'lease_id' => 'required|exists:leases,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high,urgent',
        ]);

        $user = $request->user();
        $lease = Lease::findOrFail($request->lease_id);

        MaintenanceRequest::create([
            'tenant_user_id' => $user->id,
            'property_id' => $lease->property_id,
            'unit_id' => $lease->unit_id,
            'title' => $request->title,
            'description' => $request->description,
            'priority' => $request->priority,
            'status' => 'pending',
        ]);

        return redirect()->route('maintenance.index')->with('success', 'Maintenance request submitted.');
    }

    public function updateStatus(Request $request, MaintenanceRequest $maintenanceRequest)
    {
        $request->validate([
            'status' => 'required|in:pending,in_progress,resolved,cancelled',
        ]);

        $maintenanceRequest->update(['status' => $request->status]);

        return back()->with('success', 'Maintenance request status updated.');
    }
}
