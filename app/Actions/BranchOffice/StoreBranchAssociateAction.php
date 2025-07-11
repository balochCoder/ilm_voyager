<?php

namespace App\Actions\BranchOffice;

use App\Http\Requests\Associate\StoreAssociateRequest;
use App\Models\Associate;
use App\Models\User;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Facades\Hash;

class StoreBranchAssociateAction
{
    public function __construct(private DatabaseManager $database) {}

    public function execute(StoreAssociateRequest $request, $branch): void
    {
        $data = $request->validated();

        $this->database->transaction(function () use ($data, $branch) {
            // Create user
            $user = User::create([
                'name' => $data['contact_person'],
                'email' => $data['contact_email'],
                'password' => Hash::make($data['password']),
                'is_active' => true,
            ]);
            // Create associate
            Associate::create([
                'user_id' => $user->id,
                'branch_id' => $branch->id,
                'country_id' => $data['country_id'],
                'category' => $data['category'] ?? null,
                'is_active' => true,
                'associate_name' => $data['associate_name'],
                'address' => $data['address'] ?? null,
                'city' => $data['city'] ?? null,
                'state' => $data['state'] ?? null,
                'phone' => $data['phone'] ?? null,
                'website' => $data['website'] ?? null,
                'term_of_association' => $data['term_of_association'] ?? null,
            ]);
        });
    }
}
