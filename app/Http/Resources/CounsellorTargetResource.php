<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CounsellorTargetResource extends JsonResource
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
            'number_of_applications' => $this->number_of_applications,
            'year' => $this->year,
            'description' => $this->description,
            'added_by_user' => [
                'id' => $this->addedByUser?->id,
                'name' => $this->addedByUser?->name,
            ],
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'created_at_formatted' => $this->created_at?->diffForHumans(),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            'updated_at_formatted' => $this->updated_at?->diffForHumans(),
            'is_edited' => $this->is_edited ?? false,
        ];
    }
}
