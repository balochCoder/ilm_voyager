<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('course_levels', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        // Seed data
        DB::table('course_levels')->insert(array_map(function ($name) {
            return ['name' => $name, 'created_at' => now(), 'updated_at' => now()];
        }, [
            'Advanced Diploma',
            'Applied Degrees',
            'Bachelors/UG',
            'Certificate',
            'Coaching/Preparing Courses',
            'Diploma',
            'Foundation',
            'Graduate Certificate',
            'Masters/PG',
            'Phd/Doctorate',
            'Post Doctorate',
            'Summer School',
            'Others',
        ]));
    }

    public function down()
    {
        Schema::dropIfExists('course_levels');
    }
};
