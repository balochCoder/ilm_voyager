<?php

namespace App\Actions\Course;

use App\Http\Resources\CourseResource;
use App\Models\Institution;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class GetCoursesAction
{
    public function execute(Institution $institution, array $filters)
    {
        $query = QueryBuilder::for($institution->courses()->getQuery())
            ->with(['courseLevel', 'currency'])
            ->allowedFilters([
                AllowedFilter::callback('course_level_id', function ($query, $value) {
                    if ($value !== 'all') {
                        $query->where('course_level_id', $value);
                    }
                }),
                AllowedFilter::callback('course_name', function ($query, $value) {
                    $query->where('title', 'like', "%$value%");
                }),
                AllowedFilter::callback('campus', function ($query, $value) {
                    $query->where('campus', 'like', "%$value%");
                }),
                AllowedFilter::callback('keyword', function ($query, $value) {
                    $query->where(function ($sub) use ($value) {
                        $sub->where('title', 'like', "%$value%")
                            ->orWhere('general_eligibility', 'like', "%$value%")
                            ->orWhere('campus', 'like', "%$value%")
                            ->orWhere('course_fee', 'like', "%$value%")
                            ->orWhere('awarding_body', 'like', "%$value%")
                            ->orWhere('quality_of_desired_application', 'like', "%$value%");
                    });
                }),
            ])
            ->defaultSort('-created_at');

        $courses = $query->paginate(10)->withQueryString();

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
                'course_level_id' => $filters['course_level_id'] ?? null,
                'course_name' => $filters['course_name'] ?? null,
                'campus' => $filters['campus'] ?? null,
                'keyword' => $filters['keyword'] ?? null,
            ],
        ];
    }
}
