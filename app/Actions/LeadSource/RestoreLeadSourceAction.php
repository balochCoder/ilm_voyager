<?php

declare(strict_types=1);

namespace App\Actions\LeadSource;

use App\Models\LeadSource;

class RestoreLeadSourceAction
{
    public function execute(LeadSource $leadSource): void
    {
        $leadSource->restore();
    }
}
