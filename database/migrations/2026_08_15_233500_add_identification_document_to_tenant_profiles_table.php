<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->string('identification_document_path')->nullable()->after('identification_expiry');
            $table->string('identification_document_name')->nullable()->after('identification_document_path');
            $table->string('identification_document_mime')->nullable()->after('identification_document_name');
        });
    }

    public function down(): void
    {
        Schema::table('tenant_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'identification_document_path',
                'identification_document_name',
                'identification_document_mime',
            ]);
        });
    }
};
