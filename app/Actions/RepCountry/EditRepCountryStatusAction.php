<?php

declare(strict_types=1);

namespace App\Actions\RepCountry;

use App\Http\Requests\RepCountry\EditRepCountryStatusRequest;
use App\Models\RepCountryStatus;

final class EditRepCountryStatusAction
{
    /**
     * Edit the rep country status name.
     */
    public function execute(RepCountryStatus $repCountryStatus, EditRepCountryStatusRequest $request): RepCountryStatus
    {
        $validated = $request->validated();

        $repCountryStatus->update(['status_name' => $validated['status_name']]);

        return $repCountryStatus->fresh();
    }
} 