<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('currencies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 3)->unique();
            $table->string('symbol', 8)->nullable();
            $table->timestamps();
        });

        // Seed currencies from JSON
        $json = File::get(database_path('data/currencies.json'));
        $currencies = json_decode($json, true);
        $now = now();
        $records = array_map(function ($currency) use ($now) {
            return [
                'name' => $currency['name'],
                'code' => $currency['code'],
                'symbol' => $currency['symbol'] ?? null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }, $currencies);
        DB::table('currencies')->insert($records);
    }

    public function down(): void
    {
        Schema::dropIfExists('currencies');
    }
};
