<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class BillingSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
    ];

    public static function getValue(string $key, mixed $default = null): mixed
    {
        if (! Schema::hasTable('billing_settings')) {
            return $default;
        }

        $row = static::query()->where('key', $key)->first();

        return $row?->value ?? $default;
    }

    public static function setValue(string $key, mixed $value): void
    {
        static::query()->updateOrCreate(
            ['key' => $key],
            ['value' => $value === null ? null : (string) $value],
        );
    }

    public static function freeUnitLimit(): int
    {
        return max(0, (int) static::getValue('free_unit_limit', 5));
    }

    public static function listingContactFee(): float
    {
        return max(0, (float) static::getValue('listing_contact_fee', 2000));
    }

    public static function currency(): string
    {
        return strtoupper((string) static::getValue('currency', config('paystack.currency', 'NGN')));
    }

    public static function formatMoney(float|int|string|null $amount, ?string $currency = null): string
    {
        $currency = $currency ?: static::currency();
        $symbols = [
            'NGN' => '₦',
            'USD' => '$',
            'GHS' => 'GH₵',
            'ZAR' => 'R',
            'KES' => 'KSh ',
        ];
        $symbol = $symbols[$currency] ?? $currency.' ';

        return $symbol.number_format((float) $amount, 2);
    }
}
