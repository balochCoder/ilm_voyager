<?php

namespace App\Actions\BranchOffice;

use App\Enums\TenantRolesEnum;
use App\Http\Requests\Counsellor\StoreBranchCounsellorRequest;
use App\Models\Counsellor;
use App\Models\User;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Facades\Hash;

class StoreBranchCounsellorAction
{
    public function __construct(
        private DatabaseManager $database
    ) {}

    public function execute(StoreBranchCounsellorRequest $request, $branch): void
    {
        $data = $request->validated();
        $this->database->transaction(function () use ($data, $branch) {
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

            // Create counsellor for this branch
            $branch->counsellors()->create([
                'user_id' => $user->id,
                'as_processing_officer' => $data['as_processing_officer'] ?? false,
                'is_active' => true,
            ]);
        });
    }
} 