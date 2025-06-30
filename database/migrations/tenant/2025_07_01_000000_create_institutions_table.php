<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('institutions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('rep_country_id')->constrained('rep_countries')->onDelete('cascade');
            $table->string('institution_name');
            $table->string('campus')->nullable();
            $table->string('website')->nullable();
            $table->decimal('monthly_living_cost', 10, 2)->nullable();
            $table->decimal('funds_required_for_visa', 10, 2)->nullable();
            $table->decimal('application_fee', 10, 2)->nullable();
            $table->foreignId('currency_id')->constrained('currencies')->onDelete('cascade');
            $table->text('contract_terms')->nullable();
            $table->enum('institute_type', ['direct', 'indirect']);
            $table->enum('quality_of_desired_application', ['excellent', 'good', 'average', 'below_average']);
            $table->date('contract_expiry_date')->nullable();
            $table->boolean('is_language_mandatory')->default(false);
            $table->text('language_requirements')->nullable();
            $table->text('institutional_benefits')->nullable();
            $table->text('part_time_work_details')->nullable();
            $table->text('scholarship_policy')->nullable();
            $table->text('institution_status_notes')->nullable();
            $table->string('contact_person_name')->nullable();
            $table->string('contact_person_email')->nullable();
            $table->string('contact_person_mobile')->nullable();
            $table->string('contact_person_designation')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('institutions');
    }
};
