<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class State extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
        'country_id',
        'code',
        'iso2',
        'type',
        'country_code',
    ];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }
}
