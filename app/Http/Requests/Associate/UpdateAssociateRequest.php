<?php

namespace App\Http\Requests\Associate;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAssociateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'associate_name' => ['sometimes', 'string', 'max:255'],
            'branch_id' => ['sometimes', 'exists:branches,id'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'country_id' => ['sometimes', 'exists:countries,id'],
            'phone' => ['nullable', 'string', 'max:20'],
            'website' => ['nullable', 'string', 'max:255'],
            'category' => ['sometimes', 'string', 'max:255'],
            'term_of_association' => ['nullable', 'string'],
            'contract_term_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png,doc,docx', 'max:10240'],
            'contact_person' => ['sometimes', 'string', 'max:255'],
            'designation' => ['sometimes', 'string', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:20'],
            'contact_mobile' => ['sometimes', 'string', 'max:20'],
            'contact_skype' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['sometimes', 'email', 'max:255'],
        ];

        if ($this->get('password')) {
            $rules['password'] = ['string', 'min:8', 'confirmed'];
            $rules['password_confirmation'] = ['required', 'string'];
        }

        return $rules;
    }
}
