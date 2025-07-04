<?php

namespace App\Http\Controllers\Tenants;

use App\Http\Controllers\Controller;
use App\Http\Requests\Course\StoreCourseRequest;
use App\Models\Institution;
use App\Actions\Course\StoreCourseAction;
use App\Models\Currency;
use App\Models\CourseCategory;
use App\Models\CourseLevel;
use App\Http\Resources\CourseResource;
use App\Actions\Course\GetCoursesAction;
use App\Http\Controllers\Concerns\InertiaRoute;
use App\Models\Course;

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
        $categories = CourseCategory::all(['id', 'name']);
        $courseLevels = CourseLevel::all(['id', 'name']);
        $currencies = Currency::all();
        return $this->factory->render('agents/institutions/courses/edit', [
            'institution' => $institution,
            'course' => new CourseResource($course),
            'categories' => $categories,
            'courseLevels' => $courseLevels,
            'currencies' => $currencies,
        ]);
    }

    public function update(StoreCourseRequest $request, Institution $institution, Course $course, StoreCourseAction $action)
    {
        $action->execute($request, $course);
        return to_route('agents:institutions:courses:index', $institution->id)
            ->with('success', 'Course updated successfully!');
    }

    public function toggleStatus(Course $course)
    {
        $course->is_active = !$course->is_active;
        $course->save();
        return back()->with('success', 'Course status updated.');
    }
}
