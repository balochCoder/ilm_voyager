<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BranchResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'country_id' => $this->country_id,
            'country' => $this->whenLoaded('country', function () {
                return [
                    'id' => $this->country->id,
                    'name' => $this->country->name,
                    'flag' => $this->country->flag,
                ];
            }),
            'time_zone_id' => $this->time_zone_id,
            'phone' => $this->phone,
            'website' => $this->website,
            'email' => $this->email,
            'user_id' => $this->user_id,
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                    'designation' => $this->user->designation,
                    'phone' => $this->user->phone,
                    'mobile' => $this->user->mobile,
                    'whatsapp' => $this->user->whatsapp,
                    'skype' => $this->user->skype,
                    'download_csv' => $this->user->download_csv,
                    'last_login_at' => $this->user->last_login_at,
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'contact_person_name' => $this->user ? $this->user->name : null,
            'contact_person_email' => $this->user ? $this->user->email : null,
            'contact_person_mobile' => $this->user ? $this->user->mobile : null,
            'is_active' => $this->is_active,
        ];
    }
}
