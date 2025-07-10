<?php

namespace App\Actions\BranchOffice;

use App\Http\Requests\Associate\UpdateAssociateRequest;
use App\Models\Associate;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Facades\Hash;

class UpdateBranchAssociateAction
{
    public function __construct(private DatabaseManager $database) {}

    public function execute(UpdateAssociateRequest $request, Associate $associate): void
    {
        $data = $request->validated();
        $this->database->transaction(function () use ($data, $associate) {
            // Update user
            $userData = [
                'name' => $data['contact_person'],
                'email' => $data['contact_email'],
            ];
            if (! empty($data['password'])) {
                $userData['password'] = Hash::make($data['password']);
            }
            $associate->user->update($userData);
            // Update associate
            $associate->update([
                'country_id' => $data['country_id'],
                'category' => $data['category'] ?? null,
            ]);
        });
    }
}
