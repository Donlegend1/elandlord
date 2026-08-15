<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyInquiry extends Model
{
    protected $fillable = [
        'property_id',
        'name',
        'email',
        'phone',
        'message',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
