<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->dropColumn('country');
            $table->foreignUlid('country_id')->after('state')->nullable()->constrained('countries')->onDelete('restrict');
            $table->boolean('is_active')->default(true)->after('email');
        });
    }

    public function down(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->dropForeign(['country_id']);
            $table->dropColumn('country_id');
            $table->string('country')->after('state');
            $table->dropColumn('is_active');
        });
    }
};
