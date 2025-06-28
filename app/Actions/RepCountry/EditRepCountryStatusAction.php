<?php

declare(strict_types=1);

namespace App\Actions\RepCountry;

use App\Http\Requests\RepCountry\EditRepCountryStatusRequest;
use App\Models\RepCountryStatus;
use Illuminate\Validation\ValidationException;

final class EditRepCountryStatusAction
{
    /**
     * Edit the rep country status name.
     */
    public function execute(RepCountryStatus $repCountryStatus, EditRepCountryStatusRequest $request): RepCountryStatus
    {
        // Prevent editing if current status name is "New"
        if ($repCountryStatus->status_name === 'New') {
            throw ValidationException::withMessages([
                'status_name' => 'Cannot edit the "New" status. This status is protected and cannot be modified.',
            ]);
        }

        $validated = $request->validated();

        // Prevent changing status name to "New"
        if ($validated['status_name'] === 'New') {
            throw ValidationException::withMessages([
                'status_name' => 'Cannot rename a status to "New". This name is reserved and protected.',
            ]);
        }

        // Check for duplicate status name within the same rep country (excluding current status)
        $existingStatus = $repCountryStatus
            ->where('status_name', $validated['status_name'])
            ->where('id', '!=', $repCountryStatus->id)
            ->first();

        if ($existingStatus) {
            throw ValidationException::withMessages([
                'status_name' => "A status with the name '{$validated['status_name']}' already exists for this country. Please choose a different name.",
            ]);
        }

        $repCountryStatus->update(['status_name' => $validated['status_name']]);

        return $repCountryStatus->fresh();
    }
}
