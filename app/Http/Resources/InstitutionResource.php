<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class InstitutionResource extends JsonResource
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
            'institution_name' => $this->institution_name,
            'campus' => $this->campus,
            'website' => $this->website,
            'monthly_living_cost' => $this->monthly_living_cost,
            'funds_required_for_visa' => $this->funds_required_for_visa,
            'application_fee' => $this->application_fee,
            'currency' => $this->whenLoaded('currency', function () {
                return [
                    'id' => $this->currency->id,
                    'name' => $this->currency->name,
                    'code' => $this->currency->code,
                    'symbol' => $this->currency->symbol,
                ];
            }),
            'contract_terms' => $this->contract_terms,
            'institute_type' => $this->institute_type,
            'quality_of_desired_application' => $this->quality_of_desired_application,
            'contract_expiry_date' => $this->contract_expiry_date,
            'is_language_mandatory' => $this->is_language_mandatory,
            'language_requirements' => $this->language_requirements,
            'institutional_benefits' => $this->institutional_benefits,
            'part_time_work_details' => $this->part_time_work_details,
            'scholarship_policy' => $this->scholarship_policy,
            'institution_status_notes' => $this->institution_status_notes,
            'contact_person_name' => $this->contact_person_name,
            'contact_person_email' => $this->contact_person_email,
            'contact_person_mobile' => $this->contact_person_mobile,
            'contact_person_designation' => $this->contact_person_designation,
            'is_active' => $this->is_active,
            'logo_url' => $this->logo_url,
            'rep_country' => RepCountryResource::make($this->whenLoaded('repCountry')),
            'created' => DateResource::make($this->created_at),
            'updated' => DateResource::make($this->updated_at),
        ];
    }
}
