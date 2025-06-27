<?php

declare(strict_types=1);

namespace App\Http\Requests\RepCountry;

use Illuminate\Foundation\Http\FormRequest;

final class StoreRepCountryNotesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status_notes' => 'required|array',
            'status_notes.*' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'status_notes.required' => 'Status notes are required.',
            'status_notes.array' => 'Status notes must be an array.',
            'status_notes.*.string' => 'Each note must be a string.',
        ];
    }
}
