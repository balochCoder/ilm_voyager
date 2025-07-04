<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('time_zones', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name')->unique();
            $table->string('label');
            $table->timestamps();
        });

        // Insert all PHP time zones
        $timeZones = \DateTimeZone::listIdentifiers();
        $now = now();
        $data = [];
        foreach ($timeZones as $tz) {
            $label = $tz;
            $data[] = [
                'id' => Str::ulid(),
                'name' => $tz,
                'label' => $label,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        DB::table('time_zones')->insert($data);
    }

    public function down(): void
    {
        Schema::dropIfExists('time_zones');
    }
};
