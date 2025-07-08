<?php

declare(strict_types=1);

namespace App\Actions\LeadSource;

use App\Models\LeadSource;

class StoreLeadSourceAction
{
    public function execute(array $data, string $userId): LeadSource
    {
        return LeadSource::create([
            'name' => $data['name'],
            'is_active' => $data['is_active'] ?? true,
            'created_by' => $userId,
        ]);
    }
}
