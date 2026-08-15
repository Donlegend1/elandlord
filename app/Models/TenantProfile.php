<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TenantProfile extends Model
{
    public const ID_TYPES = [
        'national_id' => 'National ID / NIN',
        'passport' => 'Passport',
        'drivers_license' => "Driver's License",
        'voters_card' => "Voter's Card",
        'residence_permit' => 'Residence Permit',
        'other' => 'Other',
    ];

    protected $fillable = [
        'user_id',
        'identification_type',
        'identification_number',
        'identification_expiry',
        'identification_document_path',
        'identification_document_name',
        'identification_document_mime',
        'date_of_birth',
        'nationality',
        'occupation',
        'employer',
        'permanent_address',
        'emergency_contact_name',
        'emergency_contact_relationship',
        'emergency_contact_phone',
        'emergency_contact_email',
        'notes',
    ];

    protected $casts = [
        'identification_expiry' => 'date',
        'date_of_birth' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function identificationLabel(): ?string
    {
        if (! $this->identification_type) {
            return null;
        }

        return self::ID_TYPES[$this->identification_type] ?? $this->identification_type;
    }

    public function hasIdentificationDocument(): bool
    {
        return filled($this->identification_document_path);
    }

    public function identificationDocumentIsImage(): bool
    {
        return str_starts_with((string) $this->identification_document_mime, 'image/');
    }
}
