<?php

namespace App\Http\Controllers\Tenants;

use App\Http\Controllers\Controller;
use App\Http\Requests\Course\StoreCourseRequest;
use App\Models\Institution;
use Inertia\Inertia;
use App\Actions\Institution\StoreCourseAction;
use App\Models\Currency;
use App\Models\CourseCategory;
use App\Models\CourseLevel;
use App\Http\Resources\CourseResource;

class CourseController extends Controller
{
    public function index(Institution $institution)
    {
        $query = $institution->courses()->with(['courseLevel', 'currency']);

        $courseLevelId = request('course_level_id');
        $courseName = request('course_name');
        $campus = request('campus');
        $keyword = request('keyword');

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
                    ->orWhere('quality_of_desired_application', 'like', "%$keyword%")
                    ;
            });
        });

        $courses = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        $notLanguageMandatoryCount = $institution->courses()->where('is_language_mandatory', false)->count();
        $courseLevels = \App\Models\CourseLevel::all(['id', 'name']);

        return Inertia::render('agents/institutions/courses/index', [
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
        ]);
    }
    public function create(Institution $institution)
    {
        $categories = CourseCategory::all(['id', 'name']);
        $courseLevels = CourseLevel::all(['id', 'name']);
        $currencies = Currency::all();
        return Inertia::render('agents/institutions/courses/create', [
            'institution' => $institution,
            'categories' => $categories,
            'courseLevels' => $courseLevels,
            'currencies' => $currencies,
        ]);
    }

    public function store(StoreCourseRequest $request, Institution $institution, StoreCourseAction $action)
    {
        $action->execute($request);
        return redirect()->route('agents:institutions:courses:index', $institution->id)
            ->with('success', 'Course added successfully!');
    }
}
