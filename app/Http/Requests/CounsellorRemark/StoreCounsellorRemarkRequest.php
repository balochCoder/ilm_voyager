<?php

namespace App\Http\Requests\CounsellorRemark;

use Illuminate\Foundation\Http\FormRequest;

class StoreCounsellorRemarkRequest extends FormRequest
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
            'remark' => 'required|string|max:1000',
            'remark_date' => 'nullable|date',
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
            'remark.required' => 'The remark field is required.',
            'remark.max' => 'The remark may not be greater than 1000 characters.',
            'remark_date.date' => 'The remark date must be a valid date.',
        ];
    }
}
