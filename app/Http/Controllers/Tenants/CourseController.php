<?php

namespace App\Http\Controllers\Tenants;

use App\Http\Controllers\Controller;
use App\Http\Requests\Course\StoreCourseRequest;
use App\Models\Institution;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Actions\Institution\StoreCourseAction;
use App\Models\Currency;
use Illuminate\Contracts\Cache\Store;
use App\Models\CourseCategory;
use App\Models\CourseLevel;
use App\Http\Resources\CourseResource;

class CourseController extends Controller
{
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
        return redirect()->route('agents:institutions:show', $institution->id)
            ->with('success', 'Course added successfully!');
    }

    public function index(Institution $institution)
    {
        $courses = $institution->courses()
            ->with('courseLevel')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('agents/institutions/courses/index', [
            'courses' => CourseResource::collection($courses),
            'institution' => [
                'id' => $institution->id,
                'institution_name' => $institution->institution_name,
            ],
        ]);
    }
}
