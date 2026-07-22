<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'slug', 'category', 'name', 'tagline', 'description', 'specs', 'image', 'sort',
    ];

    protected $casts = [
        'specs' => 'array',
    ];
}
