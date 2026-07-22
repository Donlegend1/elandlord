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
        'state',
        'zip',
        'type',
        'description',
        'image_path',
        'total_units',
    ];

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
}
