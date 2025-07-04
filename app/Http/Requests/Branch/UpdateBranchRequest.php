<?php

namespace App\Http\Requests\Branch;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBranchRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country_id' => 'required|exists:countries,id',
            'time_zone_id' => 'required|exists:time_zones,id',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|url|max:255',
            'email' => 'nullable|email|max:255',

            // Contact person details
            'contact_name' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'user_phone' => 'nullable|string|max:20',
            'mobile' => 'required|string|max:20',
            'whatsapp' => 'nullable|string|max:20',
            'skype' => 'nullable|string|max:255',
            'download_csv' => 'required|in:allowed,allowed_without_contact,not_allowed',

            // User login details
            'user_email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($this->route('branch')->user_id),
            ],

            // Password fields (optional for updates)
            'password' => 'nullable|string|min:8|confirmed',
            'password_confirmation' => 'nullable|string',
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
            'name.required' => 'Branch name is required.',
            'country_id.required' => 'Country is required.',
            'time_zone_id.required' => 'Time zone is required.',
            'contact_name.required' => 'Contact person name is required.',
            'mobile.required' => 'Mobile number is required.',
            'user_email.required' => 'Email address is required.',
            'user_email.unique' => 'This email address is already in use.',
            'password.min' => 'Password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',
            'download_csv.required' => 'Download CSV option is required.',
        ];
    }
}
