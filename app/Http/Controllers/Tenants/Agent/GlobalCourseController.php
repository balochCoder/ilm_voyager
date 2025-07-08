<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenants\Agent;

use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Models\Country;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseLevel;

final class GlobalCourseController extends Controller
{
    use InertiaRoute;

    public function index()
    {
        $query = \Spatie\QueryBuilder\QueryBuilder::for(Course::query())
            ->with([
                'courseLevel',
                'currency',
                'institution.repCountry.country',
            ])
            ->allowedFilters([
                \Spatie\QueryBuilder\AllowedFilter::callback('country_id', function ($query, $value) {
                    if ($value && $value !== 'all') {
                        $query->whereHas('institution.repCountry.country', function ($q) use ($value) {
                            $q->where('id', $value);
                        });
                    }
                }),
                \Spatie\QueryBuilder\AllowedFilter::callback('course_category', function ($query, $value) {
                    if ($value && $value !== 'all') {
                        $query->whereJsonContains('course_categories', $value);
                    }
                }),
                \Spatie\QueryBuilder\AllowedFilter::callback('intake', function ($query, $value) {
                    if ($value && $value !== 'all') {
                        $query->whereJsonContains('intake_month', $value);
                    }
                }),
                \Spatie\QueryBuilder\AllowedFilter::callback('course_level_id', function ($query, $value) {
                    if ($value && $value !== 'all') {
                        $query->where('course_level_id', $value);
                    }
                }),
                \Spatie\QueryBuilder\AllowedFilter::callback('quality_of_desired_application', function ($query, $value) {
                    if ($value && $value !== 'all') {
                        $query->where('quality_of_desired_application', $value);
                    }
                }),
                \Spatie\QueryBuilder\AllowedFilter::callback('keyword', function ($query, $value) {
                    $query->where(function ($sub) use ($value) {
                        $sub->where('title', 'like', "%$value%")
                            ->orWhere('general_eligibility', 'like', "%$value%")
                            ->orWhere('campus', 'like', "%$value%")
                            ->orWhere('course_fee', 'like', "%$value%")
                            ->orWhere('awarding_body', 'like', "%$value%")
                            ->orWhere('quality_of_desired_application', 'like', "%$value%");
                    });
                }),
                \Spatie\QueryBuilder\AllowedFilter::callback('course_fee', function ($query, $value) {
                    if ($value && is_numeric($value)) {
                        $query->where('course_fee', '<=', $value);
                    }
                }),
            ])
            ->defaultSort('-created_at');

        $courses = $query->paginate(12)->withQueryString();

        $countries = Country::orderBy('name')->get(['id', 'name']);
        $categories = CourseCategory::orderBy('name')->get(['id', 'name']);
        $levels = CourseLevel::orderBy('name')->get(['id', 'name']);
        $intakes = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];
        $qualities = ['excellent', 'good', 'average', 'below_average'];

        return $this->factory->render('agents/courses/index', [
            'courses' => CourseResource::collection($courses),
            'filterOptions' => [
                'countries' => $countries,
                'categories' => $categories,
                'levels' => $levels,
                'intakes' => $intakes,
                'qualities' => $qualities,
            ],
        ]);
    }
}
