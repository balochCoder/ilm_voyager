<?php

namespace App\Http\Requests\Counsellor;

use Illuminate\Foundation\Http\FormRequest;

class StoreCounsellorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required', 'string'],
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
            'password.required' => 'The password is required.',
            'password.min' => 'The password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',
            'password_confirmation.required' => 'Password confirmation is required.',
            'branch_id.required' => 'Please select a branch.',
            'branch_id.exists' => 'The selected branch is invalid.',
            'download_csv.required' => 'Download CSV option is required.',
        ];
    }
}
