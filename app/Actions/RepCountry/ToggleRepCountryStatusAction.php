<?php

declare(strict_types=1);

namespace App\Actions\RepCountry;

use App\Http\Requests\RepCountry\ToggleRepCountryStatusRequest;
use App\Models\RepCountryStatus;

final class ToggleRepCountryStatusAction
{
    /**
     * Toggle the rep country status active state.
     */
    public function execute(RepCountryStatus $repCountryStatus, ToggleRepCountryStatusRequest $request): RepCountryStatus
    {
        $validated = $request->validated();

        $repCountryStatus->update(['is_active' => $validated['is_active']]);

        return $repCountryStatus->fresh();
    }
} 