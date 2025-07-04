<?php

namespace App\Http\Requests\Branch;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBranchRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            // Branch fields
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country_id' => 'required|ulid|exists:countries,id',
            'time_zone_id' => 'required|ulid|exists:time_zones,id',
            'phone' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            // User fields
            'contact_name' => 'required|string|max:255',
            'user_email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'designation' => 'nullable|string|max:255',
            'user_phone' => 'nullable|string|max:255',
            'mobile' => 'required|string|max:255',
            'whatsapp' => 'nullable|string|max:255',
            'skype' => 'nullable|string|max:255',
            'download_csv' => ['required', Rule::in(['allowed', 'allowed_without_contact', 'not_allowed'])],
        ];
    }
}
