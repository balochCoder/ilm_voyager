<?php

namespace App\Http\Controllers\Tenants;

use App\Actions\Course\GetCoursesAction;
use App\Actions\Course\StoreCourseAction;
use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Http\Requests\Course\StoreCourseRequest;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseLevel;
use App\Models\Currency;
use App\Models\Institution;

class CourseController extends Controller
{
    use InertiaRoute;

    public function index(Institution $institution, GetCoursesAction $action)
    {
        $result = $action->execute($institution, request()->all());

        return $this->factory->render('agents/institutions/courses/index', $result);
    }

    private function getCourseFormData()
    {
        return [
            'categories' => CourseCategory::all(['id', 'name']),
            'courseLevels' => CourseLevel::all(['id', 'name']),
            'currencies' => Currency::all(),
        ];
    }

    public function create(Institution $institution)
    {
        $formData = $this->getCourseFormData();

        return $this->factory->render('agents/institutions/courses/create', [
            'institution' => $institution,
            ...$formData,
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
        $formData = $this->getCourseFormData();

        return $this->factory->render('agents/institutions/courses/edit', [
            'institution' => $institution,
            'course' => new CourseResource($course),
            ...$formData,
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
        $course->is_active = ! $course->is_active;
        $course->save();

        return back()->with('success', 'Course status updated.');
    }
}
