<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'public_contact_display',
        'avatar',
        'created_by_user_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    public function isLandlord(): bool
    {
        return $this->role === 'landlord';
    }

    public function isAssistant(): bool
    {
        return $this->role === 'assistant';
    }

    public function isAgent(): bool
    {
        return $this->role === 'agent';
    }

    public function isTenant(): bool
    {
        return $this->role === 'tenant';
    }

    public function createdAssistants()
    {
        return $this->hasMany(User::class, 'created_by_user_id')->where('role', 'assistant');
    }

    public function createdTenants()
    {
        return $this->hasMany(User::class, 'created_by_user_id')->where('role', 'tenant');
    }

    public function properties()
    {
        return $this->hasMany(Property::class, 'landlord_id');
    }

    public function assignedProperties()
    {
        return $this->belongsToMany(Property::class, 'property_assignments', 'user_id', 'property_id')->withPivot('role_assigned')->withTimestamps();
    }

    public function tenantLeases()
    {
        return $this->hasMany(Lease::class, 'tenant_user_id');
    }

    public function tenantProfile()
    {
        return $this->hasOne(TenantProfile::class);
    }
}
