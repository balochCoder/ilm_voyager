<?php

namespace App\Http\Requests\CounsellorTarget;

use Illuminate\Foundation\Http\FormRequest;

class StoreCounsellorTargetRequest extends FormRequest
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
            'number_of_applications' => 'required|integer|min:1',
            'year' => 'required|integer',
            'description' => 'required|string|max:1000',
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
            'number_of_applications.required' => 'The number of applications field is required.',
            'number_of_applications.integer' => 'The number of applications must be a number.',
            'number_of_applications.min' => 'The number of applications must be at least 1.',
            'year.required' => 'The year field is required.',
            'year.integer' => 'The year must be a number.',
            'description.required' => 'The description field is required.',
            'description.max' => 'The description may not be greater than 1000 characters.',
        ];
    }
}
