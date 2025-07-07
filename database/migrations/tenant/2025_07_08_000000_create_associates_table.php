<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('associates', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->foreignUlid('branch_id')->constrained('branches')->onDelete('cascade');
            $table->string('associate_name');
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->foreignUlid('country_id')->constrained('countries')->onDelete('cascade');
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->string('category');
            $table->text('term_of_association')->nullable();
            $table->string('contact_person');
            $table->string('designation');
            $table->string('contact_phone')->nullable();
            $table->string('contact_mobile');
            $table->string('contact_skype')->nullable();
            $table->string('contact_email');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('associates');
    }
};
