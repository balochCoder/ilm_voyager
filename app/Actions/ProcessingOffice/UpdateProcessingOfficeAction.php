<?php

namespace App\Actions\ProcessingOffice;

use App\Http\Requests\ProcessingOffice\UpdateProcessingOfficeRequest;
use App\Models\ProcessingOffice;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UpdateProcessingOfficeAction
{
    public function execute(UpdateProcessingOfficeRequest $request, ProcessingOffice $processingOffice): void
    {
        DB::transaction(function () use ($request, $processingOffice) {
            // Update processing office information
            $processingOffice->update([
                'name' => $request->name,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'country_id' => $request->country_id,
                'time_zone_id' => $request->time_zone_id,
                'phone' => $request->phone,
                'whatsapp' => $request->whatsapp,
            ]);

            // Update user information
            if ($processingOffice->user) {
                $userData = [
                    'name' => $request->contact_name,
                    'email' => $request->user_email,
                    'designation' => $request->designation,
                    'phone' => $request->user_phone,
                    'mobile' => $request->mobile,
                    'skype' => $request->skype,
                    'download_csv' => $request->download_csv,
                ];

                // Only update password if provided
                if ($request->filled('password')) {
                    $userData['password'] = Hash::make($request->password);
                }

                $processingOffice->user->update($userData);
            }
        });
    }
}
