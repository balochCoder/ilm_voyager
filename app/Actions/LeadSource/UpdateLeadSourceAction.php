<?php

declare(strict_types=1);

namespace App\Actions\LeadSource;

use App\Models\LeadSource;

class UpdateLeadSourceAction
{
    public function execute(LeadSource $leadSource, array $data): LeadSource
    {
        $leadSource->update([
            'name' => $data['name'],
            'is_active' => $data['is_active'],
        ]);

        return $leadSource;
    }
}
