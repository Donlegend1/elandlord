<?php

namespace App\Services;

use App\Models\BillingSetting;
use App\Models\LandlordSubscription;
use App\Models\Unit;
use App\Models\User;

class UnitQuota
{
    public function used(User $user): int
    {
        return Unit::query()
            ->whereHas('property', fn ($q) => $q->where('landlord_id', $user->id))
            ->count();
    }

    public function activeSubscription(User $user): ?LandlordSubscription
    {
        $subscription = $user->landlordSubscription;

        return $subscription?->isActive() ? $subscription : null;
    }

    public function limit(User $user): ?int
    {
        if (! $user->isLandlord()) {
            return null;
        }

        if ($this->activeSubscription($user)) {
            return null;
        }

        return BillingSetting::freeUnitLimit();
    }

    public function remaining(User $user): ?int
    {
        $limit = $this->limit($user);

        if ($limit === null) {
            return null;
        }

        return max(0, $limit - $this->used($user));
    }

    public function canAdd(User $user, int $additional): bool
    {
        if ($additional <= 0) {
            return true;
        }

        $limit = $this->limit($user);

        if ($limit === null) {
            return true;
        }

        return ($this->used($user) + $additional) <= $limit;
    }

    public function payload(?User $user): ?array
    {
        if (! $user?->isLandlord()) {
            return null;
        }

        $user->loadMissing('landlordSubscription.plan');

        $subscription = $this->activeSubscription($user);
        $limit = $this->limit($user);

        return [
            'used' => $this->used($user),
            'limit' => $limit,
            'remaining' => $this->remaining($user),
            'subscribed' => (bool) $subscription,
            'plan_name' => $subscription?->plan?->name,
            'plan_interval' => $subscription?->plan?->interval,
            'can_add' => $this->canAdd($user, 1),
            'currency' => BillingSetting::currency(),
        ];
    }

    public function blockMessage(User $user): string
    {
        $limit = BillingSetting::freeUnitLimit();

        return "Your free plan allows {$limit} unit".($limit === 1 ? '' : 's').'. Subscribe to add more units.';
    }
}
