<?php

declare(strict_types=1);

namespace App\Actions\Institution;

use App\Models\Institution;
use App\Services\CacheService;

class ToggleInstitutionStatusAction
{
    public function execute(Institution $institution): Institution
    {
        $institution->is_active = ! $institution->is_active;
        $institution->save();
        // Invalidate institution cache
        app(CacheService::class)->flushTags(['institutions']);
        return $institution;
    }
}
