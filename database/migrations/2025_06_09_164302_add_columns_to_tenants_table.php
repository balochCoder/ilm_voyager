<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->string('agency_name')->unique()->after('id');
            $table->string('name')->unique()->after('agency_name');
            $table->string('email')->unique()->after('agency_name');
            $table->string('password')->after('email');
            $table->string('website')->unique()->after('password');
            $table->boolean('is_approved')->default(false)->after('website');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn(['agency_name', 'name', 'email', 'password', 'website', 'is_approved']);

        });
    }
};
