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
        Schema::create('rep_countries', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->string('monthly_living_cost')
                ->nullable();

            $table->text('visa_requirements')
                ->nullable();
            $table->text('part_time_work_details')
                ->nullable();
            $table->text('country_benefits')
                ->nullable();

            $table->boolean('is_active')
                ->default(false);

            $table->foreignUlid('country_id')
                ->unique()
                ->constrained('countries')
                ->onDelete('cascade');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rep_countries');
    }
};
