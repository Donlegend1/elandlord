<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class LegalPage extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'description',
        'content',
        'updated_by',
    ];

    public function editor()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function renderedHtml(): string
    {
        return Str::markdown($this->content ?? '', [
            'html_input' => 'strip',
            'allow_unsafe_links' => false,
        ]);
    }
}
