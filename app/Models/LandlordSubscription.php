<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LandlordSubscription extends Model
{
    protected $fillable = [
        'user_id',
        'subscription_plan_id',
        'paystack_subscription_code',
        'paystack_customer_code',
        'paystack_email_token',
        'status',
        'starts_at',
        'next_payment_at',
        'ends_at',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'next_payment_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id');
    }

    public function isActive(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        if ($this->ends_at && $this->ends_at->isPast()) {
            return false;
        }

        if ($this->next_payment_at && $this->next_payment_at->lt(now()->subDays(7))) {
            return false;
        }

        return true;
    }
}
