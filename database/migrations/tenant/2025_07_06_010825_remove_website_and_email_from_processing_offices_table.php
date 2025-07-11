<?php

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
        Schema::table('processing_offices', function (Blueprint $table) {
            $table->dropColumn(['website', 'email']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('processing_offices', function (Blueprint $table) {
            $table->string('website')->nullable();
            $table->string('email')->nullable();
        });
    }
};
