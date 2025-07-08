<?php

namespace App\Actions\Associate;

use App\Http\Requests\Associate\UpdateAssociateRequest;
use App\Models\Associate;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Facades\Hash;

class UpdateAssociateAction
{
    public function __construct(
        private DatabaseManager $database
    ) {
        // You can inject dependencies here if needed
    }

    public function execute(UpdateAssociateRequest $request, Associate $associate): void
    {
        $data = $request->validated();
        $this->database->transaction(function () use ($data, $request, $associate) {
            // Update user
            $userData = [
                'name' => $data['associate_name'] ?? $associate->associate_name,
                'phone' => $data['contact_phone'] ?? $associate->contact_phone,
                'mobile' => $data['contact_mobile'] ?? $associate->contact_mobile,
            ];
            if (isset($data['contact_email'])) {
                $userData['email'] = $data['contact_email'];
            }
            if (! empty($data['password'])) {
                $userData['password'] = Hash::make($data['password']);
            }
            $associate->user->update($userData);

            // Handle contract file upload
            if ($request->hasFile('contract_file')) {
                $associate->clearMediaCollection('contract_file');
                $associate->addMediaFromRequest('contract_file')->toMediaCollection('contract_file');
            }

            // Update associate
            $associate->update($data);
        });
    }
}
