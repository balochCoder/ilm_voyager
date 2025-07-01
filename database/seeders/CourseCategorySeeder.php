<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CourseCategory;

class CourseCategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
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
        ];

        foreach ($categories as $name) {
            CourseCategory::firstOrCreate(['name' => $name]);
        }
    }
} 