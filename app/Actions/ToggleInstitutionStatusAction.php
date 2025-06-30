<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Institution;

class ToggleInstitutionStatusAction
{
    public function execute(Institution $institution): Institution
    {
        $institution->is_active = !$institution->is_active;
        $institution->save();
        return $institution;
    }
} 