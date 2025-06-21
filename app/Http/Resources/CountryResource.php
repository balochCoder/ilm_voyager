<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CountryResource extends JsonResource
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
            'flag' => $this->flag,
            'is_active' => $this->is_active,
            'created' => DateResource::make($this->created_at),
            'updated' => DateResource::make($this->updated_at),
            'rep_country' => $this->whenLoaded('repCountry'),
        ];
    }
} 