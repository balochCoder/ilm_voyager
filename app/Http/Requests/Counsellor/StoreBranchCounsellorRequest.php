<?php

namespace App\Http\Requests\Counsellor;

use Illuminate\Foundation\Http\FormRequest;

class StoreBranchCounsellorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'min:2'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required', 'string'],
            'phone' => ['nullable', 'string', 'max:20'],
            'mobile' => ['nullable', 'string', 'max:20'],
            'whatsapp' => ['nullable', 'string', 'max:20'],
            'download_csv' => ['required', 'in:allowed,allowed_without_contact,not_allowed'],
            'as_processing_officer' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The contact person name is required.',
            'name.min' => 'The contact person name must be at least 2 characters.',
            'name.max' => 'The contact person name cannot exceed 255 characters.',

            'email.required' => 'The email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered.',
            'email.max' => 'The email address cannot exceed 255 characters.',

            'password.required' => 'The password is required.',
            'password.min' => 'The password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',

            'password_confirmation.required' => 'Password confirmation is required.',

            'download_csv.required' => 'Download CSV option is required.',
            'download_csv.in' => 'Please select a valid download CSV option.',

            'as_processing_officer.boolean' => 'The processing officer field must be true or false.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'contact person name',
            'email' => 'email address',
            'password' => 'password',
            'password_confirmation' => 'password confirmation',
            'phone' => 'phone number',
            'mobile' => 'mobile number',
            'whatsapp' => 'WhatsApp number',
            'download_csv' => 'download CSV option',
            'as_processing_officer' => 'processing officer',
        ];
    }
}
