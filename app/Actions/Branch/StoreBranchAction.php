<?php

declare(strict_types=1);

namespace App\Actions\Branch;

use App\Enums\TenantRolesEnum;
use App\Http\Requests\Branch\StoreBranchRequest;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Facades\Hash;

final class StoreBranchAction
{
    public function __construct(
        private DatabaseManager $db
    ) {}

    public function execute(StoreBranchRequest $request): Branch
    {
        $validated = $request->validated();

        $branch = $this->db->transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['contact_name'],
                'email' => $validated['user_email'],
                'password' => Hash::make($validated['password']),
                'designation' => $validated['designation'] ?? null,
                'phone' => $validated['user_phone'] ?? null,
                'mobile' => $validated['mobile'],
                'whatsapp' => $validated['whatsapp'] ?? null,
                'skype' => $validated['skype'] ?? null,
                'download_csv' => $validated['download_csv'],
            ]);
            $user->assignRole(TenantRolesEnum::BRANCHOFFICE->value);

            $branch = Branch::create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'address' => $validated['address'] ?? null,
                'city' => $validated['city'] ?? null,
                'state' => $validated['state'] ?? null,
                'country_id' => $validated['country_id'],
                'time_zone_id' => $validated['time_zone_id'],
                'phone' => $validated['phone'] ?? null,
                'website' => $validated['website'] ?? null,
                'email' => $validated['email'] ?? null,
            ]);

            return $branch;
        });
        return $branch;
    }
}
