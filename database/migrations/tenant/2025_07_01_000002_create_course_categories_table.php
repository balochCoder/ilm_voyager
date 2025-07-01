<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('course_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        // Seed data
        DB::table('course_categories')->insert(array_map(function ($name) {
            return ['name' => $name, 'created_at' => now(), 'updated_at' => now()];
        }, [
            'Architecture, Building and Planning',
            'Art and Design',
            'Business and Management',
            'Commerce',
            'Computer Science and IT',
            'Culinary Arts',
            'Education and Training',
            'Engineering',
            'Hair, Beauty and Personal Care',
            'Health Sciences',
            'Healthcare and Medicine',
            'Humanities',
            'Information Science and Mathematics',
            'Land and Environment',
            'Language Programmes',
            'Law',
            'Media/Journalism/Communication',
            'Military Studies',
            'Music, Dance and Performing Arts',
            'Nursing',
            'Science and Mathematics',
            'Social Studies and Communication',
            'Sports',
            'Travel, Tourism and Hospitality',
            'Vocational Courses',
            'Accounting and Marketing',
            'Agriculture',
        ]));
    }

    public function down()
    {
        Schema::dropIfExists('course_categories');
    }
};
