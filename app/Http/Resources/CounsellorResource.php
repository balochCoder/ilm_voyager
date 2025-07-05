<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CounsellorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'branch_id' => $this->branch_id,
            'as_processing_officer' => $this->as_processing_officer,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // User details
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'phone' => $this->user->phone,
                'mobile' => $this->user->mobile,
                'whatsapp' => $this->user->whatsapp,
                'download_csv' => $this->user->download_csv,
                'is_active' => $this->user->is_active,
                'last_login_at' => $this->user->last_login_at,
            ],

            // Branch details
            'branch' => [
                'id' => $this->branch->id,
                'name' => $this->branch->name,
            ],
        ];
    }
}
