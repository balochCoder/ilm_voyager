<?php

namespace App\Actions\BranchOffice;

use App\Models\Counsellor;

class ToggleBranchCounsellorStatusAction
{
    public function execute(Counsellor $counsellor): void
    {
        $counsellor->is_active = ! $counsellor->is_active;
        $counsellor->save();
        if ($counsellor->user) {
            $counsellor->user->is_active = $counsellor->is_active;
            $counsellor->user->save();
        }
    }
} 