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
use App\Actions\Course\GetCoursesAction;

class CourseController extends Controller
{
    public function index(Institution $institution, GetCoursesAction $action)
    {
        $result = $action->execute($institution, request()->all());
        return Inertia::render('agents/institutions/courses/index', $result);
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
