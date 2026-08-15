<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'public_contact_display')) {
                $table->string('public_contact_display')->default('both')->after('phone');
            }
        });

        Schema::table('properties', function (Blueprint $table) {
            if (! Schema::hasColumn('properties', 'size')) {
                $table->string('size')->nullable()->after('type');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'public_contact_display')) {
                $table->dropColumn('public_contact_display');
            }
        });

        Schema::table('properties', function (Blueprint $table) {
            if (Schema::hasColumn('properties', 'size')) {
                $table->dropColumn('size');
            }
        });
    }
};
