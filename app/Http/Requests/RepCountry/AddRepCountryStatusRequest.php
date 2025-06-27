<?php

declare(strict_types=1);

namespace App\Http\Requests\RepCountry;

use Illuminate\Foundation\Http\FormRequest;

final class AddRepCountryStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Status name is required.',
            'name.string' => 'Status name must be a string.',
            'name.max' => 'Status name may not be greater than 255 characters.',
        ];
    }
}
