<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_user_id',
        'property_id',
        'unit_id',
        'title',
        'description',
        'priority',
        'status',
    ];

    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_user_id');
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
