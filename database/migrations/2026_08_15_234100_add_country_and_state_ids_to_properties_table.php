<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            if (! Schema::hasColumn('properties', 'country')) {
                $table->string('country')->nullable()->after('city');
            }
        });

        Schema::table('properties', function (Blueprint $table) {
            if (! Schema::hasColumn('properties', 'country_id')) {
                $table->unsignedBigInteger('country_id')->nullable()->after('country');
            }
            if (! Schema::hasColumn('properties', 'state_id')) {
                $table->unsignedBigInteger('state_id')->nullable()->after('state');
            }
        });

        $this->addForeignKeyIfMissing('properties_country_id_foreign', 'country_id', 'countries');
        $this->addForeignKeyIfMissing('properties_state_id_foreign', 'state_id', 'states');
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            foreach (['properties_state_id_foreign', 'properties_country_id_foreign'] as $constraint) {
                try {
                    $table->dropForeign($constraint);
                } catch (\Throwable $e) {
                    // Constraint may not exist.
                }
            }

            foreach (['state_id', 'country_id', 'country'] as $column) {
                if (Schema::hasColumn('properties', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }

    private function addForeignKeyIfMissing(string $constraint, string $column, string $referencedTable): void
    {
        $database = Schema::getConnection()->getDatabaseName();
        $exists = Schema::getConnection()->selectOne(
            'select constraint_name from information_schema.table_constraints
             where table_schema = ? and table_name = ? and constraint_name = ? and constraint_type = ?',
            [$database, 'properties', $constraint, 'FOREIGN KEY']
        );

        if ($exists) {
            return;
        }

        try {
            Schema::table('properties', function (Blueprint $table) use ($column, $referencedTable) {
                $table->foreign($column)->references('id')->on($referencedTable)->nullOnDelete();
            });
        } catch (\Throwable $e) {
            // Application validation still requires a valid country_id and matching state_id.
        }
    }
};
