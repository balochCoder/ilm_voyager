<?php

declare(strict_types=1);

namespace App\Http\Requests\Institution;

use Illuminate\Foundation\Http\FormRequest;

class StoreInstitutionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rep_country_id' => 'required|exists:rep_countries,id',
            'institution_name' => 'required|string|max:255',
            'campus' => 'nullable|string|max:255',
            'website' => 'required|url|max:255',
            'monthly_living_cost' => 'nullable|numeric|min:0|max:999999.99',
            'funds_required_for_visa' => 'nullable|numeric|min:0|max:999999.99',
            'application_fee' => 'nullable|numeric|min:0|max:999999.99',
            'currency_id' => 'required|exists:currencies,id',
            'contract_terms' => 'nullable|string',
            'institute_type' => 'required|in:direct,indirect',
            'quality_of_desired_application' => 'required|in:excellent,good,average,below_average',
            'contract_expiry_date' => 'nullable|date|after:today',
            'is_language_mandatory' => 'boolean',
            'language_requirements' => 'nullable|string',
            'institutional_benefits' => 'nullable|string',
            'part_time_work_details' => 'nullable|string',
            'scholarship_policy' => 'nullable|string',
            'institution_status_notes' => 'nullable|string',
            'contact_person_name' => 'required|string|max:255',
            'contact_person_email' => 'required|email|max:255',
            'contact_person_mobile' => 'required|string|max:20',
            'contact_person_designation' => 'required|string|max:255',
            'contract_copy' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'logo' => 'nullable|file|mimes:jpg,jpeg,png,svg|max:5120',
            'prospectus' => 'nullable|file|mimes:pdf|max:10240',
            'additional_files' => 'nullable|array',
            'additional_files.*' => 'file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240',
            'additional_file_titles' => 'nullable|array',
            'additional_file_titles.*' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'additional_files.*.file' => 'Each additional file must be a valid file.',
            'additional_files.*.mimes' => 'Additional files must be PDF, JPG, PNG, DOC, or DOCX files.',
            'additional_files.*.max' => 'Each additional file must not exceed 10MB.',
        ];
    }
}
