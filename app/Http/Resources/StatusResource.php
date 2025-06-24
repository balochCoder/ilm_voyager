<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StatusResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->resource->id,
            'name' => $this->resource->name,
            'color' => $this->resource->color,
            'order' => $this->resource->order,
        ];

        // Include pivot data if this is a many-to-many relationship
        if ($this->pivot) {
            $data['pivot'] = [
                'notes' => $this->pivot->notes,
                'completed_at' => $this->pivot->completed_at,
                'is_current' => $this->pivot->is_current,
                'order' => $this->pivot->order,
            ];
        }

        return $data;
    }
}
