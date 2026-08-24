<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'landlord_id',
        'name',
        'address',
        'city',
        'country',
        'country_id',
        'state',
        'state_id',
        'zip',
        'type',
        'size',
        'description',
        'image_path',
        'total_units',
    ];

    protected $appends = ['image_url', 'image_urls'];

    public const SIZES = [
        'studio' => 'Studio',
        '1_bedroom' => '1 Bedroom',
        '2_bedroom' => '2 Bedrooms',
        '3_bedroom' => '3 Bedrooms',
        '4_bedroom' => '4 Bedrooms',
        '5_plus' => '5+ Bedrooms',
    ];

    public static function sizeOptions(): array
    {
        return collect(self::SIZES)
            ->map(fn ($label, $value) => ['value' => $value, 'label' => $label])
            ->values()
            ->all();
    }

    public function sizeLabel(): string
    {
        if ($this->size && isset(self::SIZES[$this->size])) {
            return self::SIZES[$this->size];
        }

        $beds = (int) $this->units->max('bedrooms');

        if ($beds >= 5) {
            return self::SIZES['5_plus'];
        }
        if ($beds === 1) {
            return self::SIZES['1_bedroom'];
        }
        if ($beds > 1) {
            return $beds.' Bedrooms';
        }

        return self::SIZES['studio'];
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->imageUrls()[0] ?? null;
    }

    public function getImageUrlsAttribute(): array
    {
        return $this->imageUrls();
    }

    public function imageUrls(): array
    {
        if ($this->relationLoaded('images') && $this->images->isNotEmpty()) {
            return $this->images->map->url->values()->all();
        }

        return $this->image_path ? array_values(array_filter([GalleryImage::publicUrl($this->image_path)])) : [];
    }

    public function images()
    {
        return $this->morphMany(GalleryImage::class, 'imageable')->orderBy('sort_order');
    }

    public function publicContacts(): array
    {
        $landlord = $this->landlord;
        $mode = $landlord?->public_contact_display === 'agent' ? 'agent' : 'both';

        $agents = $this->assignedUsers
            ->filter(fn (User $user) => filled($user->phone) && in_array($user->role, ['assistant', 'agent'], true))
            ->map(fn (User $user) => [
                'role' => 'Agent',
                'name' => $user->name,
                'phone' => $user->phone,
            ])
            ->values();

        $contacts = collect();

        if (in_array($mode, ['agent', 'both'], true)) {
            $contacts = $contacts->concat($agents);
        }

        if ($mode === 'both' && filled($landlord?->phone)) {
            $contacts->push([
                'role' => 'Landlord',
                'name' => $landlord->name,
                'phone' => $landlord->phone,
            ]);
        }

        if ($contacts->isEmpty() && filled($landlord?->phone)) {
            $contacts->push([
                'role' => 'Landlord',
                'name' => $landlord->name,
                'phone' => $landlord->phone,
            ]);
        }

        return $contacts->unique(fn ($c) => $c['role'].'|'.$c['phone'])->values()->all();
    }

    public function landlord()
    {
        return $this->belongsTo(User::class, 'landlord_id');
    }

    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    public function assignments()
    {
        return $this->hasMany(PropertyAssignment::class);
    }

    public function assignedUsers()
    {
        return $this->belongsToMany(User::class, 'property_assignments', 'property_id', 'user_id')
                    ->withPivot('role_assigned')
                    ->withTimestamps();
    }

    public function leases()
    {
        return $this->hasMany(Lease::class);
    }

    public function paymentReceipts()
    {
        return $this->hasMany(PaymentReceipt::class);
    }

    public function maintenanceRequests()
    {
        return $this->hasMany(MaintenanceRequest::class);
    }

    public function countryRecord()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }

    public function stateRecord()
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    public function inquiries()
    {
        return $this->hasMany(PropertyInquiry::class);
    }
}
