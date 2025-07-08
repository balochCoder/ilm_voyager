<?php

namespace App\Actions\Counsellor;

use App\Http\Requests\Counsellor\UpdateCounsellorRequest;
use App\Models\Counsellor;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Facades\Hash;

class UpdateCounsellorAction
{
    public function __construct(
        private DatabaseManager $database
    ) {}

    public function execute(UpdateCounsellorRequest $request, Counsellor $counsellor): void
    {
        $data = $request->validated();
        $this->database->transaction(function () use ($data, $counsellor) {
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
    }
}
