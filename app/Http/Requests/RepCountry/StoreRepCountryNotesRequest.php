<?php

namespace App\Http\Requests\RepCountry;

use Illuminate\Foundation\Http\FormRequest;

class StoreRepCountryNotesRequest extends FormRequest
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