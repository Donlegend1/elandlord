<?php

namespace App\Http\Middleware;

use App\Models\Lease;
use App\Models\MaintenanceRequest;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'notifications' => fn () => $this->notificationsFor($request->user()),
        ];
    }

    protected function notificationsFor(?User $user): array
    {
        if (! $user) {
            return [];
        }

        $items = collect();
        $propertyIds = $this->scopedPropertyIds($user);

        $leaseQuery = Lease::with(['tenant', 'property', 'unit'])
            ->where('status', 'active')
            ->where('lease_end', '<=', now()->addDays(60));

        if ($user->isTenant()) {
            $leaseQuery->where('tenant_user_id', $user->id);
        } elseif ($propertyIds !== null) {
            $leaseQuery->whereIn('property_id', $propertyIds);
        }

        foreach ($leaseQuery->orderBy('lease_end')->limit(5)->get() as $lease) {
            $end = $lease->lease_end->copy()->startOfDay();
            $today = now()->startOfDay();
            $days = (int) $today->diffInDays($end);
            if ($end->lt($today)) {
                $days = -$days;
            }
            $items->push([
                'id' => 'lease-'.$lease->id,
                'type' => $days < 0 ? 'expired' : 'renewal',
                'title' => $days < 0 ? 'Lease expired' : 'Lease renewal due',
                'body' => trim(($lease->tenant?->name ?? 'Tenant').' · '.($lease->property?->name ?? 'Property').($lease->unit?->unit_number ? ' #'.$lease->unit->unit_number : '')),
                'meta' => $days < 0
                    ? 'Expired '.abs($days).' day'.(abs($days) === 1 ? '' : 's').' ago'
                    : ($days === 0 ? 'Expires today' : $days.' day'.($days === 1 ? '' : 's').' remaining'),
                'href' => route('renewals.index'),
            ]);
        }

        $maintQuery = MaintenanceRequest::with(['property', 'tenant'])
            ->whereIn('status', ['pending', 'in_progress']);

        if ($user->isTenant()) {
            $maintQuery->where('tenant_user_id', $user->id);
        } elseif ($propertyIds !== null) {
            $maintQuery->whereIn('property_id', $propertyIds);
        }

        foreach ($maintQuery->latest()->limit(5)->get() as $request) {
            $items->push([
                'id' => 'maint-'.$request->id,
                'type' => 'maintenance',
                'title' => $request->status === 'in_progress' ? 'Maintenance in progress' : 'New maintenance request',
                'body' => $request->title,
                'meta' => ($request->property?->name ?? 'Property').($request->tenant?->name ? ' · '.$request->tenant->name : ''),
                'href' => route('maintenance.index'),
            ]);
        }

        return $items->take(8)->values()->all();
    }

    /**
     * Property IDs in the user's scope, or null for unrestricted (super admin).
     */
    protected function scopedPropertyIds(User $user): ?array
    {
        if ($user->isSuperAdmin()) {
            return null;
        }

        if ($user->isLandlord()) {
            return Property::where('landlord_id', $user->id)->pluck('id')->all();
        }

        if ($user->isAssistant() || $user->isAgent()) {
            return $user->assignedProperties()->pluck('properties.id')->all();
        }

        return [];
    }
}
