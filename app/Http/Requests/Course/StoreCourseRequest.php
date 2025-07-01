<?php

namespace App\Http\Requests\Course;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'course_level_id' => 'required|integer|exists:course_levels,id',
            'duration_year' => 'nullable|min:0',
            'duration_month' => 'nullable|min:0',
            'duration_week' => 'nullable|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'campus' => 'required|string|max:255',
            'awarding_body' => 'nullable|string|max:255',
            'currency_id' => 'required|exists:currencies,id',
            'course_fee' => 'nullable|numeric|min:0',
            'application_fee' => 'nullable|numeric|min:0',
            'monthly_living_cost' => 'nullable|numeric|min:0',
            'part_time_work_details' => 'nullable|string|max:255',
            'course_benefits' => 'nullable|string',
            'general_eligibility' => 'nullable|string',
            'quality_of_desired_application' => 'required|string|max:255',
            'is_language_mandatory' => 'nullable|boolean',
            'language_requirements' => 'required_if:is_language_mandatory,true|string',
            'additional_info' => 'nullable|string',
            'course_categories' => 'nullable|array',
            'course_categories.*' => 'string',
            'modules' => 'nullable|array',
            'modules.*' => 'string',
            'intake_month' => 'nullable|array',
            'intake_month.*' => 'string',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $year = $this->input('duration_year');
            $month = $this->input('duration_month');
            $week = $this->input('duration_week');
            if (empty($year) && empty($month) && empty($week)) {
                $validator->errors()->add('duration_year', 'At least one duration field (year, month, or week) is required.');
            }
        });
    }
}
