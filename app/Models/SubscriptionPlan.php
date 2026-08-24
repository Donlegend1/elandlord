<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubscriptionPlan extends Model
{
    public const INTERVALS = [
        'monthly' => 'Monthly',
        'quarterly' => 'Quarterly',
        'annually' => 'Yearly',
    ];

    protected $fillable = [
        'interval',
        'name',
        'amount',
        'description',
        'features',
        'paystack_plan_code',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'features' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(LandlordSubscription::class);
    }

    public function paystackInterval(): string
    {
        return $this->interval === 'annually' ? 'annually' : $this->interval;
    }

    public function periodLabel(): string
    {
        return self::INTERVALS[$this->interval] ?? ucfirst($this->interval);
    }

    public function nextPaymentAt(): \Carbon\CarbonInterface
    {
        return match ($this->interval) {
            'quarterly' => now()->addMonths(3),
            'annually' => now()->addYear(),
            default => now()->addMonth(),
        };
    }
}
