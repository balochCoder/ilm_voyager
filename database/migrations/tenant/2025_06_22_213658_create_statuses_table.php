<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('statuses', function (Blueprint $table) {
            $table->ulid('id')->primary()->unique();
            $table->string('name')->unique();
            $table->string('color')->default('gray'); // For badge colors
            $table->integer('order')->default(0); // For ordering in the process
            $table->timestamps();
        });

        // Insert preloaded statuses
        $statuses = [
            ['id' => Str::ulid(), 'name' => 'New', 'color' => 'blue', 'order' => 1],
            ['id' => Str::ulid(), 'name' => 'Application On Hold', 'color' => 'yellow', 'order' => 2],
            ['id' => Str::ulid(), 'name' => 'Pre-Application Process', 'color' => 'purple', 'order' => 3],
            ['id' => Str::ulid(), 'name' => 'Rejected by University', 'color' => 'red', 'order' => 4],
            ['id' => Str::ulid(), 'name' => 'Application Submitted', 'color' => 'green', 'order' => 5],
            ['id' => Str::ulid(), 'name' => 'Conditional Offer', 'color' => 'orange', 'order' => 6],
            ['id' => Str::ulid(), 'name' => 'Pending Interview', 'color' => 'yellow', 'order' => 7],
            ['id' => Str::ulid(), 'name' => 'Unconditional Offer', 'color' => 'green', 'order' => 8],
            ['id' => Str::ulid(), 'name' => 'Acceptance', 'color' => 'green', 'order' => 9],
            ['id' => Str::ulid(), 'name' => 'Visa Processing', 'color' => 'blue', 'order' => 10],
            ['id' => Str::ulid(), 'name' => 'Enrolled', 'color' => 'green', 'order' => 11],
            ['id' => Str::ulid(), 'name' => 'Dropped', 'color' => 'red', 'order' => 12],
        ];

        foreach ($statuses as $status) {
            DB::table('statuses')->insert([
                'id' => $status['id'],
                'name' => $status['name'],
                'color' => $status['color'],
                'order' => $status['order'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('statuses');
    }
};
