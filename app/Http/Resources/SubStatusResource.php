<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class SubStatusResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'is_completed' => $this->is_completed,
            'completed_at' => $this->completed_at,
            'order' => $this->order,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at ? DateResource::make($this->created_at) : null,
            'updated_at' => $this->updated_at ? DateResource::make($this->updated_at) : null,
        ];
    }
}
