<?php

namespace App\Http\Requests\ProcessingOffice;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProcessingOfficeRequest extends FormRequest
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
            'whatsapp' => 'nullable|string|max:20',

            // Contact person details
            'contact_name' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'user_phone' => 'nullable|string|max:20',
            'mobile' => 'required|string|max:20',
            'skype' => 'nullable|string|max:255',
            'download_csv' => 'required|in:allowed,allowed_without_contact,not_allowed',

            // User login details
            'user_email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($this->route('processingOffice')->user_id),
            ],

            // Password fields (optional for updates)
            'password' => 'nullable|string|min:8|confirmed',
            'password_confirmation' => 'nullable|string',
        ];
    }
}
