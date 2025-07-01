<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('institution_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->foreignId('course_level_id')->constrained('course_levels');
            $table->integer('duration_year')->nullable();
            $table->integer('duration_month')->nullable();
            $table->integer('duration_week')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('campus_location')->nullable();
            $table->string('awarding_body')->nullable();
            $table->foreignId('currency_id')->nullable()->constrained()->onDelete('set null');
            $table->decimal('course_fee', 12, 2)->nullable();
            $table->decimal('application_fee', 12, 2)->nullable();
            $table->decimal('monthly_living_cost', 12, 2)->nullable();
            $table->text('part_time_work_details')->nullable();
            $table->text('course_benefits')->nullable();
            $table->text('general_eligibility')->nullable();
            $table->enum('quality_of_desired_application', ['excellent', 'good', 'average', 'below_average'])
                ->nullable();
            $table->boolean('is_language_mandatory')->default(false);
            $table->text('language_requirements')->nullable();
            $table->text('additional_info')->nullable();
            $table->json('course_categories')->nullable();
            $table->json('modules')->nullable();
            $table->json('intake_month')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('courses');
    }
};
