<?php

declare(strict_types=1);

namespace App\Http\Requests\RepCountry;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class EditRepCountryStatusRequest extends FormRequest
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
        $repCountryStatus = $this->route('repCountryStatus');
        
        return [
            'status_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('rep_country_status', 'status_name')
                    ->where('rep_country_id', $repCountryStatus->rep_country_id)
                    ->ignore($repCountryStatus->id),
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
            'status_name.required' => 'The status name is required.',
            'status_name.string' => 'The status name must be a string.',
            'status_name.max' => 'The status name may not be greater than 255 characters.',
            'status_name.unique' => 'A status with this name already exists for this country. Please choose a different name.',
        ];
    }
} 