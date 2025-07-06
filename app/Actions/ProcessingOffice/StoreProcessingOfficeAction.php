<?php

declare(strict_types=1);

namespace App\Actions\ProcessingOffice;

use App\Enums\TenantRolesEnum;
use App\Http\Requests\ProcessingOffice\StoreProcessingOfficeRequest;
use App\Models\ProcessingOffice;
use App\Models\User;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Facades\Hash;

final class StoreProcessingOfficeAction
{
    public function __construct(
        private DatabaseManager $db
    ) {}

    public function execute(StoreProcessingOfficeRequest $request): ProcessingOffice
    {
        $validated = $request->validated();

        return $this->db->transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['contact_name'],
                'email' => $validated['user_email'],
                'password' => Hash::make($validated['password']),
                'designation' => $validated['designation'] ?? null,
                'phone' => $validated['user_phone'] ?? null,
                'mobile' => $validated['mobile'],
                'skype' => $validated['skype'] ?? null,
                'download_csv' => $validated['download_csv'],
            ]);
            $user->assignRole(TenantRolesEnum::PROCESSINGOFFICE->value);

            $processingOffice = ProcessingOffice::create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'address' => $validated['address'] ?? null,
                'city' => $validated['city'] ?? null,
                'state' => $validated['state'] ?? null,
                'country_id' => $validated['country_id'],
                'time_zone_id' => $validated['time_zone_id'],
                'phone' => $validated['phone'] ?? null,
                'whatsapp' => $validated['whatsapp'] ?? null,
            ]);

            return $processingOffice;
        });
    }
}
