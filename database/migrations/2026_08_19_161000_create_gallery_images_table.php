<?php

use App\Models\Property;
use App\Models\Unit;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery_images', function (Blueprint $table) {
            $table->id();
            $table->morphs('imageable');
            $table->string('path');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        $now = now();

        Property::query()->whereNotNull('image_path')->where('image_path', '!=', '')->each(function (Property $property) use ($now) {
            DB::table('gallery_images')->insert([
                'imageable_type' => Property::class,
                'imageable_id' => $property->id,
                'path' => $property->image_path,
                'sort_order' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        });

        Unit::query()->whereNotNull('image_path')->where('image_path', '!=', '')->each(function (Unit $unit) use ($now) {
            DB::table('gallery_images')->insert([
                'imageable_type' => Unit::class,
                'imageable_id' => $unit->id,
                'path' => $unit->image_path,
                'sort_order' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_images');
    }
};
