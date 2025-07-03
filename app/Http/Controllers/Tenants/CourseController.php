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
use App\Http\Controllers\Concerns\InertiaRoute;

class CourseController extends Controller
{
    use InertiaRoute;
    public function index(Institution $institution, GetCoursesAction $action)
    {
        $result = $action->execute($institution, request()->all());
        return $this->factory->render('agents/institutions/courses/index', $result);
    }

    public function create(Institution $institution)
    {
        $categories = CourseCategory::all(['id', 'name']);
        $courseLevels = CourseLevel::all(['id', 'name']);
        $currencies = Currency::all();
        return $this->factory->render('agents/institutions/courses/create', [
            'institution' => $institution,
            'categories' => $categories,
            'courseLevels' => $courseLevels,
            'currencies' => $currencies,
        ]);
    }

    public function store(StoreCourseRequest $request, Institution $institution, StoreCourseAction $action)
    {
        $action->execute($request);
        return to_route('agents:institutions:courses:index', $institution->id)
            ->with('success', 'Course added successfully!');
    }

    public function edit(Institution $institution, \App\Models\Course $course)
    {
        $categories = \App\Models\CourseCategory::all(['id', 'name']);
        $courseLevels = \App\Models\CourseLevel::all(['id', 'name']);
        $currencies = \App\Models\Currency::all();
        return $this->factory->render('agents/institutions/courses/edit', [
            'institution' => $institution,
            'course' => new CourseResource($course),
            'categories' => $categories,
            'courseLevels' => $courseLevels,
            'currencies' => $currencies,
        ]);
    }

    public function update(\App\Http\Requests\Course\StoreCourseRequest $request, Institution $institution, \App\Models\Course $course, \App\Actions\Institution\StoreCourseAction $action)
    {
        $action->execute($request, $course);
        return to_route('agents:institutions:courses:index', $institution->id)
            ->with('success', 'Course updated successfully!');
    }
}
