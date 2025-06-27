<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class RepCountryStatusResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'status_name' => $this->status_name,
            'order' => $this->order,
            'notes' => $this->notes,
            'completed_at' => $this->completed_at,
            'is_current' => $this->is_current,
            'created_at' => $this->created_at ? DateResource::make($this->created_at) : null,
            'updated_at' => $this->updated_at ? DateResource::make($this->updated_at) : null,
        ];
    }
}
