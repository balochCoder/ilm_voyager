<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AssociateResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'associate_name' => $this->associate_name,
            'branch' => $this->whenLoaded('branch', function () {
                return [
                    'id' => $this->branch->id,
                    'name' => $this->branch->name,
                ];
            }),
            'country' => $this->whenLoaded('country', function () {
                return [
                    'id' => $this->country->id,
                    'name' => $this->country->name,
                    'flag' => $this->country->flag ?? null,
                ];
            }),
            'category' => $this->category,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'phone' => $this->phone,
            'website' => $this->website,
            'term_of_association' => $this->term_of_association,
            'contract_file_url' => $this->getFirstMediaUrl('contract_file'),
            'contact_person' => $this->contact_person,
            'designation' => $this->designation,
            'contact_phone' => $this->contact_phone,
            'contact_mobile' => $this->contact_mobile,
            'contact_skype' => $this->contact_skype,
            'contact_email' => $this->contact_email,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
