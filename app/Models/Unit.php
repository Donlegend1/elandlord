<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'unit_number',
        'rent_amount',
        'deposit_amount',
        'bedrooms',
        'bathrooms',
        'status',
        'image_path',
        'description',
    ];

    protected $appends = ['image_url', 'image_urls'];

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

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function leases()
    {
        return $this->hasMany(Lease::class);
    }

    public function activeLease()
    {
        return $this->hasOne(Lease::class)->where('status', 'active')->latestOfMany();
    }
}
