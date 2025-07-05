<?php

namespace App\Actions\Counsellor;

use App\Http\Requests\Counsellor\UpdateCounsellorRequest;
use App\Models\Counsellor;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UpdateCounsellorAction
{
    public function execute(UpdateCounsellorRequest $request, Counsellor $counsellor): void
    {
        DB::transaction(function () use ($request, $counsellor) {
            // Update user
            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'mobile' => $request->mobile,
                'whatsapp' => $request->whatsapp,
                'download_csv' => $request->download_csv,
            ];

            // Only update password if provided
            if ($request->filled('password')) {
                $userData['password'] = Hash::make($request->password);
            }

            $counsellor->user->update($userData);

            // Update counsellor
            $counsellor->update([
                'branch_id' => $request->branch_id,
                'as_processing_officer' => $request->as_processing_officer,
            ]);
        });
    }
}
