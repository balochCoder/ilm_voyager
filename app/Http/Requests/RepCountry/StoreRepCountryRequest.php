<?php

declare(strict_types=1);

namespace App\Http\Requests\RepCountry;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreRepCountryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'monthly_living_cost' => 'nullable|integer',
            'visa_requirements' => 'nullable|string',
            'part_time_work_details' => 'nullable|string',
            'country_benefits' => 'nullable|string',
            'is_active' => 'boolean',
            'country_id' => [
                'required',
                'exists:countries,id',
                Rule::unique('rep_countries', 'country_id'),
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'country_id.required' => 'Please select a country.',
            'country_id.exists' => 'The selected country does not exist.',
            'country_id.unique' => 'This country is already being represented.',
        ];
    }
}
