<?php

declare(strict_types=1);

namespace App\Http\Requests\RepCountry;

use Illuminate\Foundation\Http\FormRequest;

final class SaveRepCountryStatusOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status_order' => 'required|array',
            'status_order.*.status_name' => 'required|string',
            'status_order.*.order' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'status_order.required' => 'Status order is required.',
            'status_order.array' => 'Status order must be an array.',
            'status_order.*.status_name.required' => 'Each status must have a name.',
            'status_order.*.order.required' => 'Each status must have an order.',
        ];
    }
}
