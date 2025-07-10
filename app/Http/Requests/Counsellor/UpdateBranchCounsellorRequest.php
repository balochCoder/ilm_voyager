<?php

namespace App\Http\Requests\Counsellor;

use App\Models\Counsellor;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBranchCounsellorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $counsellor = Counsellor::findOrFail($this->counsellor);
        $rules = [
            'name' => ['required', 'string', 'max:255', 'min:2'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($counsellor->user_id),
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'mobile' => ['nullable', 'string', 'max:20'],
            'whatsapp' => ['nullable', 'string', 'max:20'],
            'download_csv' => ['required', 'in:allowed,allowed_without_contact,not_allowed'],
            'as_processing_officer' => ['boolean'],
        ];
        if ($this->get('password')) {
            $rules['password'] = ['string', 'min:8', 'confirmed'];
            $rules['password_confirmation'] = ['required', 'string'];
        }

        return $rules;
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

            'password.min' => 'The password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',

            'password_confirmation.required' => 'Password confirmation is required when setting a new password.',

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
