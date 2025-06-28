<?php

declare(strict_types=1);

namespace App\Http\Requests\RepCountry;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class AddSubStatusRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('sub_statuses', 'name')
                    ->where('rep_country_status_id', $this->route('repCountryStatus')->id)
                    ->ignore(null),
            ],
            'description' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Sub-step name is required.',
            'name.string' => 'Sub-step name must be a string.',
            'name.max' => 'Sub-step name may not be greater than 255 characters.',
            'name.unique' => 'A sub-step with this name already exists for this status. Please choose a different name.',
            'description.string' => 'Description must be a string.',
            'description.max' => 'Description may not be greater than 1000 characters.',
        ];
    }
}
