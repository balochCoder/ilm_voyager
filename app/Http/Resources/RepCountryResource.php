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
        $statusResource = function ($status) {
            return [
                'status_name' => $status->status_name,
                'order' => $status->order,
                'notes' => $status->notes,
                'completed_at' => $status->completed_at,
                'is_current' => $status->is_current,
                'created_at' => $status->created_at ? DateResource::make($status->created_at) : null,
                'updated_at' => $status->updated_at ? DateResource::make($status->updated_at) : null,
            ];
        };

        return [
            'id' => $this->id,
            'monthly_living_cost' => $this->monthly_living_cost,
            'visa_requirements' => $this->visa_requirements,
            'part_time_work_details' => $this->part_time_work_details,
            'country_benefits' => $this->country_benefits,
            'is_active' => $this->is_active,
            'country' => CountryResource::make($this->whenLoaded('country')),
            'statuses' => $this->repCountryStatuses->map($statusResource),
            'current_status' => $this->repCountryStatuses->firstWhere('is_current', true)
                ? $statusResource($this->repCountryStatuses->firstWhere('is_current', true))
                : null,
            'created' => DateResource::make($this->created_at),
            'updated' => DateResource::make($this->updated_at),
        ];
    }
}
