<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;

class GalleryImage extends Model
{
    protected $fillable = [
        'path',
        'sort_order',
    ];

    protected $appends = ['url'];

    public function imageable()
    {
        return $this->morphTo();
    }

    public function getUrlAttribute(): string
    {
        return static::publicUrl($this->path) ?? '';
    }

    public static function storeUpload(UploadedFile $file, string $directory): string
    {
        $folder = 'uploads/'.$directory;
        File::ensureDirectoryExists(public_path($folder));
        $name = $file->hashName();
        $file->move(public_path($folder), $name);

        return $folder.'/'.$name;
    }

    public static function publicUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        if (str_starts_with($path, 'uploads/')) {
            return asset($path);
        }

        return asset('storage/'.$path);
    }

    public function deleteFile(): void
    {
        if (! $this->path) {
            return;
        }

        $publicFile = public_path($this->path);
        if (is_file($publicFile)) {
            unlink($publicFile);
        }

        $legacyFile = storage_path('app/public/'.$this->path);
        if (is_file($legacyFile)) {
            unlink($legacyFile);
        }
    }
}
