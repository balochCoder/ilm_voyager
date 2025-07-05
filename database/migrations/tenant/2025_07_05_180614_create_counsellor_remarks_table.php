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
        Schema::create('counsellor_remarks', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('counsellor_id')->constrained('counsellors')->onDelete('cascade');
            $table->text('remark');
            $table->date('remark_date');
            $table->foreignUlid('added_by_user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('counsellor_remarks');
    }
};
