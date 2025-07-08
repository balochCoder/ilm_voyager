<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'institution_id' => $this->institution_id,
            'institution_name' => optional($this->institution)->institution_name,
            'country_name' => optional(optional(optional($this->institution)->repCountry)->country)->name,
            'country_flag' => optional(optional(optional($this->institution)->repCountry)->country)->flag,
            'title' => $this->title,
            'course_level_id' => $this->course_level_id,
            'course_level' => $this->whenLoaded('courseLevel', function () {
                return [
                    'id' => optional($this->courseLevel)->id,
                    'name' => optional($this->courseLevel)->name,
                ];
            }),
            'duration_year' => $this->duration_year,
            'duration_month' => $this->duration_month,
            'duration_week' => $this->duration_week,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'campus' => $this->campus,
            'awarding_body' => $this->awarding_body,
            'currency_id' => $this->currency_id,
            'currency' => $this->whenLoaded('currency', function () {
                return [
                    'id' => optional($this->currency)->id,
                    'name' => optional($this->currency)->name,
                    'code' => optional($this->currency)->code,
                ];
            }),
            'course_fee' => $this->course_fee,
            'application_fee' => $this->application_fee,
            'course_benefits' => $this->course_benefits,
            'general_eligibility' => $this->general_eligibility,
            'quality_of_desired_application' => $this->quality_of_desired_application,
            'is_language_mandatory' => $this->is_language_mandatory,
            'language_requirements' => $this->language_requirements,
            'additional_info' => $this->additional_info,
            'course_categories' => $this->course_categories,
            'modules' => $this->modules,
            'intake_month' => $this->intake_month,
            'is_active' => $this->is_active,
            'documents' => $this->getDocumentsWithTitles(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
        ];
    }

    private function getCourseCategoryNames()
    {
        if (!is_array($this->course_categories)) {
            return [];
        }
        $ids = $this->course_categories;
        $names = \App\Models\CourseCategory::whereIn('id', $ids)->pluck('name')->toArray();

        return $names;
    }
}
