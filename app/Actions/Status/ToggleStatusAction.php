<?php

declare(strict_types=1);

namespace App\Actions\Status;

use App\Http\Requests\RepCountry\ToggleRepCountryStatusRequest;
use App\Models\RepCountryStatus;
use Illuminate\Validation\ValidationException;

final class ToggleStatusAction
{
    /**
     * Toggle the rep country status active state.
     */
    public function execute(RepCountryStatus $repCountryStatus, ToggleRepCountryStatusRequest $request): RepCountryStatus
    {
        // Prevent toggling if status name is "New"
        if ($repCountryStatus->status_name === 'New') {
            throw ValidationException::withMessages([
                'status' => 'Cannot modify the "New" status. This status is protected and cannot be changed.',
            ]);
        }

        $validated = $request->validated();

        $repCountryStatus->update(['is_active' => $validated['is_active']]);

        return $repCountryStatus->fresh();
    }
}
