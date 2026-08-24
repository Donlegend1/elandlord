<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

return new class extends Migration
{
    public function up(): void
    {
        File::ensureDirectoryExists(public_path('uploads/properties'));
        File::ensureDirectoryExists(public_path('uploads/units'));

        $this->relocate('gallery_images', 'path');
        $this->relocate('properties', 'image_path');
        $this->relocate('units', 'image_path');
    }

    public function down(): void
    {
        // Files remain in public/uploads; paths are not reverted.
    }

    private function relocate(string $table, string $column): void
    {
        DB::table($table)->whereNotNull($column)->where($column, '!=', '')->get()->each(function ($row) use ($table, $column) {
            $path = $row->{$column};

            if (str_starts_with($path, 'uploads/')) {
                return;
            }

            $from = storage_path('app/public/'.$path);
            $to = public_path('uploads/'.$path);

            if (is_file($from)) {
                File::ensureDirectoryExists(dirname($to));
                File::copy($from, $to);
            }

            DB::table($table)->where('id', $row->id)->update([
                $column => 'uploads/'.$path,
            ]);
        });
    }
};
