<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RepCountryResource extends JsonResource
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
            'monthly_living_cost' => $this->monthly_living_cost,
            'visa_requirements' => $this->visa_requirements,
            'part_time_work_details' => $this->part_time_work_details,
            'country_benefits' => $this->country_benefits,
            'is_active' => $this->is_active,
            'created' => DateResource::make($this->created_at),
            'updated' => DateResource::make($this->updated_at),
            'country' => CountryResource::make($this->whenLoaded('country')),
            'statuses' => $this->repCountryStatuses->map(function ($pivot) {
                return [
                    'status_name' => $pivot->status_name,
                    'order' => $pivot->order,
                    'notes' => $pivot->notes,
                    'completed_at' => $pivot->completed_at,
                    'is_current' => $pivot->is_current,
                ];
            }),
            'current_status' => $this->repCountryStatuses->firstWhere('is_current', true),
        ];
    }
}
