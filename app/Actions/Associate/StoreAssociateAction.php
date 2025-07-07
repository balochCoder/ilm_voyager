<?php

namespace App\Actions\Associate;

use App\Enums\TenantRolesEnum;
use App\Http\Requests\Associate\StoreAssociateRequest;
use App\Models\Associate;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class StoreAssociateAction
{
    public function execute(StoreAssociateRequest $request): void
    {
        $data = $request->validated();
        DB::transaction(function () use ($data, $request) {
            // Create user
            $user = User::create([
                'name' => $data['associate_name'],
                'email' => $data['contact_email'],
                'password' => Hash::make($data['password']),
                'phone' => $data['contact_phone'] ?? null,
                'mobile' => $data['contact_mobile'] ?? null,
                'is_active' => true,
            ]);

            // Assign associate role
            $user->assignRole(TenantRolesEnum::ASSOCIATE->value);

            // Create associate
            $associate = Associate::create([
                'user_id' => $user->id,
                'branch_id' => $data['branch_id'],
                'associate_name' => $data['associate_name'],
                'address' => $data['address'] ?? null,
                'city' => $data['city'] ?? null,
                'state' => $data['state'] ?? null,
                'country_id' => $data['country_id'],
                'phone' => $data['phone'] ?? null,
                'website' => $data['website'] ?? null,
                'category' => $data['category'],
                'term_of_association' => $data['term_of_association'] ?? null,
                'contact_person' => $data['contact_person'],
                'designation' => $data['designation'],
                'contact_phone' => $data['contact_phone'] ?? null,
                'contact_mobile' => $data['contact_mobile'],
                'contact_skype' => $data['contact_skype'] ?? null,
                'contact_email' => $data['contact_email'],
                'is_active' => true,
            ]);
        });
    }
}
