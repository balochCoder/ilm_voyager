<?php

declare(strict_types=1);

namespace App\Http\Requests\RepCountry;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class AddRepCountryStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('rep_country_status', 'status_name')
                    ->where('rep_country_id', $this->route('repCountry')->id)
                    ->ignore(null),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Status name is required.',
            'name.string' => 'Status name must be a string.',
            'name.max' => 'Status name may not be greater than 255 characters.',
            'name.unique' => 'A status with this name already exists for this country. Please choose a different name.',
        ];
    }
}
