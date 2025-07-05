<?php

declare(strict_types=1);

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
        Schema::create('counsellor_targets', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('counsellor_id')->constrained('counsellors')->onDelete('cascade');
            $table->integer('number_of_applications');
            $table->integer('year');
            $table->text('description');
            $table->foreignUlid('added_by_user_id')->constrained('users')->onDelete('cascade');
            $table->boolean('is_edited')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('counsellor_targets');
    }
};
