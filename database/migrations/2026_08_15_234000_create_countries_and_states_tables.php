<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('countries')) {
            Schema::create('countries', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->char('iso2', 2)->nullable()->index();
                $table->char('iso3', 3)->nullable();
                $table->string('phonecode')->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('states')) {
            Schema::create('states', function (Blueprint $table) {
                $table->id();
                $table->foreignId('country_id')->constrained('countries')->cascadeOnDelete();
                $table->string('name');
                $table->string('iso2')->nullable();
                $table->string('type')->nullable();
                $table->timestamps();

                $table->index('country_id');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('states');
        Schema::dropIfExists('countries');
    }
};
