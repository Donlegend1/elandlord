<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('units', function (Blueprint $table) {
            if (Schema::hasColumn('units', 'description')) {
                return;
            }

            if (Schema::hasColumn('units', 'image_path')) {
                $table->text('description')->nullable()->after('image_path');
            } else {
                $table->text('description')->nullable()->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->dropColumn('description');
        });
    }
};
