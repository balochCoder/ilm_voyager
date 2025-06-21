<?php

namespace App\Actions\RepCountry;

use App\Models\RepCountry;
use App\Http\Requests\RepCountry\ToggleStatusRequest;

class ToggleStatusAction
{
    /**
     * Toggle the rep country status.
     */
    public function execute(RepCountry $repCountry, ToggleStatusRequest $request): RepCountry
    {
        $validated = $request->validated();

        $repCountry->update(['is_active' => $validated['is_active']]);

        return $repCountry->fresh();
    }
} 