<?php

namespace App\Actions\Branch;

use App\Http\Requests\Branch\UpdateBranchRequest;
use App\Models\Branch;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Facades\Hash;

class UpdateBranchAction
{
    public function __construct(
        private DatabaseManager $database
    ) {}

    public function execute(UpdateBranchRequest $request, Branch $branch): void
    {
        $this->database->transaction(function () use ($request, $branch) {
            // Update branch information
            $branch->update([
                'name' => $request->name,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'country_id' => $request->country_id,
                'time_zone_id' => $request->time_zone_id,
                'phone' => $request->phone,
                'website' => $request->website,
                'email' => $request->email,
            ]);

            // Update user information
            if ($branch->user) {
                $userData = [
                    'name' => $request->contact_name,
                    'email' => $request->user_email,
                    'designation' => $request->designation,
                    'phone' => $request->user_phone,
                    'mobile' => $request->mobile,
                    'whatsapp' => $request->whatsapp,
                    'skype' => $request->skype,
                    'download_csv' => $request->download_csv,
                ];

                // Only update password if provided
                if ($request->filled('password')) {
                    $userData['password'] = Hash::make($request->password);
                }

                $branch->user->update($userData);
            }
        });
    }
}
