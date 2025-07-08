<?php

namespace App\Actions\Counsellor;

use App\Enums\TenantRolesEnum;
use App\Http\Requests\Counsellor\StoreCounsellorRequest;
use App\Models\Counsellor;
use App\Models\User;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Facades\Hash;

class StoreCounsellorAction
{
    public function __construct(
        private DatabaseManager $database
    ) {}

    public function execute(StoreCounsellorRequest $request): void
    {
        $data = $request->validated();
        $this->database->transaction(function () use ($data) {
            // Create user
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'phone' => $data['phone'] ?? null,
                'mobile' => $data['mobile'] ?? null,
                'whatsapp' => $data['whatsapp'] ?? null,
                'download_csv' => $data['download_csv'],
                'is_active' => true,
            ]);

            // Assign counsellor role
            $user->assignRole(TenantRolesEnum::COUNSELLOR->value);

            // Create counsellor
            Counsellor::create([
                'user_id' => $user->id,
                'branch_id' => $data['branch_id'],
                'as_processing_officer' => $data['as_processing_officer'] ?? false,
                'is_active' => true,
            ]);
        });
    }
}
