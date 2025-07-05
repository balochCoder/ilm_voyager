<?php

namespace App\Actions\Counsellor;

use App\Enums\TenantRolesEnum;
use App\Http\Requests\Counsellor\StoreCounsellorRequest;
use App\Models\Counsellor;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StoreCounsellorAction
{
    public function execute(StoreCounsellorRequest $request): void
    {
        DB::transaction(function () use ($request) {
            // Create user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'mobile' => $request->mobile,
                'whatsapp' => $request->whatsapp,
                'download_csv' => $request->download_csv,
                'is_active' => true,
            ]);

            // Assign counsellor role
            $user->assignRole(TenantRolesEnum::COUNSELLOR->value);

            // Create counsellor
            Counsellor::create([
                'user_id' => $user->id,
                'branch_id' => $request->branch_id,
                'as_processing_officer' => $request->as_processing_officer,
                'is_active' => true,
            ]);
        });
    }
}
