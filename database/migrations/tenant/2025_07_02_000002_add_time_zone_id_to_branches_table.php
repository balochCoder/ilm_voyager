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
            $table->dropColumn('timezone');
            $table->foreignUlid('time_zone_id')->nullable()->constrained('time_zones')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->string('timezone')->nullable();
            $table->dropForeign(['time_zone_id']);
            $table->dropColumn('time_zone_id');
        });
    }
};
