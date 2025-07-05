<?php

namespace App\Http\Requests\Counsellor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCounsellorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($this->route('counsellor')->user_id),
            ],
            'password' => ['nullable', 'string', 'min:8'],
            'password_confirmation' => ['nullable', 'required_with:password', 'same:password'],
            'phone' => ['nullable', 'string', 'max:20'],
            'mobile' => ['nullable', 'string', 'max:20'],
            'whatsapp' => ['nullable', 'string', 'max:20'],
            'download_csv' => ['required', 'in:allowed,allowed_without_contact,not_allowed'],
            'branch_id' => ['required', 'exists:branches,id'],
            'as_processing_officer' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The contact person name is required.',
            'email.required' => 'The email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered.',
            'password.min' => 'The password must be at least 8 characters.',
            'password_confirmation.required_with' => 'Password confirmation is required when setting a new password.',
            'password_confirmation.same' => 'Password confirmation does not match.',
            'branch_id.required' => 'Please select a branch.',
            'branch_id.exists' => 'The selected branch is invalid.',
            'download_csv.required' => 'Download CSV option is required.',
        ];
    }
}
