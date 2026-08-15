<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
        'code',
        'iso2',
        'iso3',
        'phonecode',
        'sortname',
    ];

    public function states()
    {
        return $this->hasMany(State::class)->orderBy('name');
    }
}
