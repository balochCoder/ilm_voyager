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
        Schema::create('rep_country_status', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('rep_country_id')->constrained('rep_countries')->onDelete('cascade');
            $table->string('status_name'); // Use status name instead of status_id
            $table->text('notes')->nullable(); // Additional notes for this status
            $table->date('completed_at')->nullable(); // When this status was completed
            $table->boolean('is_current')->default(false); // Mark current status
            $table->integer('order')->default(0); // Order of status in the process
            $table->timestamps();

            // Ensure unique combination of rep_country and status_name
            $table->unique(['rep_country_id', 'status_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rep_country_status');
    }
};
