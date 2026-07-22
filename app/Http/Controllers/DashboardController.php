<?php

namespace App\Http\Controllers;

use App\Models\Lease;
use App\Models\MaintenanceRequest;
use App\Models\PaymentReceipt;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isSuperAdmin()) {
            return Inertia::render('Dashboard/SuperAdminDashboard', [
                'stats' => [
                    'totalUsers' => User::count(),
                    'totalLandlords' => User::where('role', 'landlord')->count(),
                    'totalAssistants' => User::where('role', 'assistant')->count(),
                    'totalTenants' => User::where('role', 'tenant')->count(),
                    'totalProperties' => Property::count(),
                    'totalLeases' => Lease::where('status', 'active')->count(),
                    'totalRevenue' => PaymentReceipt::sum('amount'),
                ],
                'recentUsers' => User::latest()->take(5)->get(),
            ]);
        }

        if ($user->isTenant()) {
            $leases = Lease::with(['property', 'unit', 'landlord'])
                ->where('tenant_user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

            $activeLease = $leases->firstWhere('status', 'active');

            $receipts = PaymentReceipt::with(['property', 'unit'])
                ->where('tenant_user_id', $user->id)
                ->latest()
                ->take(10)
                ->get();

            $maintenanceRequests = MaintenanceRequest::with(['property', 'unit'])
                ->where('tenant_user_id', $user->id)
                ->latest()
                ->get();

            return Inertia::render('Dashboard/TenantDashboard', [
                'leases' => $leases,
                'activeLease' => $activeLease,
                'receipts' => $receipts,
                'maintenanceRequests' => $maintenanceRequests,
            ]);
        }

        if ($user->isAssistant()) {
            $assignedPropertyIds = $user->assignedProperties()->pluck('properties.id');

            $propertiesCount = $assignedPropertyIds->count();
            $activeLeases = Lease::with(['tenant', 'property', 'unit'])
                ->whereIn('property_id', $assignedPropertyIds)
                ->where('status', 'active')
                ->get();

            $recentReceipts = PaymentReceipt::with(['tenant', 'property', 'unit'])
                ->whereIn('property_id', $assignedPropertyIds)
                ->latest()
                ->take(5)
                ->get();

            $upcomingRenewals = Lease::with(['tenant', 'property', 'unit'])
                ->whereIn('property_id', $assignedPropertyIds)
                ->where('status', 'active')
                ->where('lease_end', '<=', now()->addDays(60))
                ->orderBy('lease_end', 'asc')
                ->get();

            return Inertia::render('Dashboard/AssistantDashboard', [
                'stats' => [
                    'assignedPropertiesCount' => $propertiesCount,
                    'activeTenantsCount' => $activeLeases->count(),
                    'upcomingRenewalsCount' => $upcomingRenewals->count(),
                    'totalCollected' => PaymentReceipt::whereIn('property_id', $assignedPropertyIds)->sum('amount'),
                ],
                'activeLeases' => $activeLeases,
                'recentReceipts' => $recentReceipts,
                'upcomingRenewals' => $upcomingRenewals,
            ]);
        }

        // Default Landlord/Agent Dashboard
        $propertyQuery = Property::query();
        if ($user->isLandlord()) {
            $propertyQuery->where('landlord_id', $user->id);
        } else if ($user->isAgent()) {
            $assignedIds = $user->assignedProperties()->pluck('properties.id');
            $propertyQuery->whereIn('id', $assignedIds);
        }

        $properties = $propertyQuery->with(['units', 'assignments.user'])->get();
        $propertyIds = $properties->pluck('id');

        $activeLeases = Lease::with(['tenant', 'property', 'unit'])
            ->whereIn('property_id', $propertyIds)
            ->where('status', 'active')
            ->get();

        $upcomingRenewals = Lease::with(['tenant', 'property', 'unit'])
            ->whereIn('property_id', $propertyIds)
            ->where('status', 'active')
            ->where('lease_end', '<=', now()->addDays(60))
            ->orderBy('lease_end', 'asc')
            ->get();

        $recentReceipts = PaymentReceipt::with(['tenant', 'property', 'unit'])
            ->whereIn('property_id', $propertyIds)
            ->latest()
            ->take(5)
            ->get();

        $assistants = $user->createdAssistants()->with('assignedProperties')->get();

        return Inertia::render('Dashboard/LandlordDashboard', [
            'stats' => [
                'totalProperties' => $properties->count(),
                'totalUnits' => $properties->sum('total_units'),
                'activeTenants' => $activeLeases->count(),
                'upcomingRenewals' => $upcomingRenewals->count(),
                'totalAssistants' => $assistants->count(),
                'monthlyRevenue' => PaymentReceipt::whereIn('property_id', $propertyIds)
                    ->whereMonth('payment_date', now()->month)
                    ->sum('amount'),
            ],
            'properties' => $properties,
            'recentReceipts' => $recentReceipts,
            'upcomingRenewals' => $upcomingRenewals,
            'assistants' => $assistants,
        ]);
    }
}
