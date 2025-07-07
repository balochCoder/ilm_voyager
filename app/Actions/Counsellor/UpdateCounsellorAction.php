<?php

namespace App\Actions\Counsellor;

use App\Http\Requests\Counsellor\UpdateCounsellorRequest;
use App\Models\Counsellor;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Services\CacheService;

class UpdateCounsellorAction
{
    public function execute(UpdateCounsellorRequest $request, Counsellor $counsellor): void
    {
        $data = $request->validated();
        DB::transaction(function () use ($data, $request, $counsellor) {
            // Prepare user data
            $userData = [
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'mobile' => $data['mobile'] ?? null,
                'whatsapp' => $data['whatsapp'] ?? null,
                'download_csv' => $data['download_csv'],
            ];

            // Update password if provided
            if (array_key_exists('password', $data)) {
                $userData['password'] = Hash::make($data['password']);
            }

            // Update user
            $counsellor->user->update($userData);

            // Update counsellor
            $counsellor->update([
                'branch_id' => $data['branch_id'],
                'as_processing_officer' => $data['as_processing_officer'] ?? false,
            ]);
        });
        // Invalidate counsellor cache
        app(CacheService::class)->flushTags(['counsellors']);
    }
}
