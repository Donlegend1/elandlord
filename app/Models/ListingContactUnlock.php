<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListingContactUnlock extends Model
{
    protected $fillable = [
        'property_id',
        'platform_payment_id',
        'email',
        'unlocked_at',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'unlocked_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(PlatformPayment::class, 'platform_payment_id');
    }

    public function isValid(): bool
    {
        return ! $this->expires_at || $this->expires_at->isFuture();
    }
}
