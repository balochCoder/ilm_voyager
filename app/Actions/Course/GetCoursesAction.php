<?php

namespace App\Actions\Course;

use App\Http\Resources\CourseResource;
use App\Models\Institution;

class GetCoursesAction
{
    public function execute(Institution $institution, array $filters)
    {
        $query = $institution->courses()->with(['courseLevel', 'currency']);

        $courseLevelId = $filters['course_level_id'] ?? null;
        $courseName = $filters['course_name'] ?? null;
        $campus = $filters['campus'] ?? null;
        $keyword = $filters['keyword'] ?? null;

        $query->when($courseLevelId, function ($q) use ($courseLevelId) {
            if ($courseLevelId !== 'all') {
                $q->where('course_level_id', $courseLevelId);
            }
        });

        $query->when($courseName, function ($q) use ($courseName) {
            $q->where('title', 'like', "%$courseName%");
        });

        $query->when($campus, function ($q) use ($campus) {
            $q->where('campus', 'like', "%$campus%");
        });

        $query->when($keyword, function ($q) use ($keyword) {
            $q->where(function ($sub) use ($keyword) {
                $sub->where('title', 'like', "%$keyword%")
                    ->orWhere('general_eligibility', 'like', "%$keyword%")
                    ->orWhere('campus', 'like', "%$keyword%")
                    ->orWhere('course_fee', 'like', "%$keyword%")
                    ->orWhere('awarding_body', 'like', "%$keyword%")
                    ->orWhere('quality_of_desired_application', 'like', "%$keyword%");
            });
        });

        $courses = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        $notLanguageMandatoryCount = $institution->courses()->where('is_language_mandatory', false)->count();
        $courseLevels = \App\Models\CourseLevel::all(['id', 'name']);

        return [
            'courses' => CourseResource::collection($courses),
            'institution' => [
                'id' => $institution->id,
                'institution_name' => $institution->institution_name,
            ],
            'not_language_mandatory_count' => $notLanguageMandatoryCount,
            'courseLevels' => $courseLevels,
            'filters' => [
                'course_level_id' => $courseLevelId,
                'course_name' => $courseName,
                'campus' => $campus,
                'keyword' => $keyword,
            ],
        ];
    }
}
