<?php

declare(strict_types=1);

namespace App\Actions\SubStatus;

use App\Http\Requests\RepCountry\AddSubStatusRequest;
use App\Models\RepCountryStatus;
use App\Models\SubStatus;
use Illuminate\Support\Facades\Log;
use Throwable;

final class AddSubStatusAction
{
    public function execute(AddSubStatusRequest $request, RepCountryStatus $repCountryStatus): SubStatus
    {
        try {
            $validated = $request->validated();

            // Get the maximum order for sub-statuses in this rep country status
            $maxOrder = $repCountryStatus->subStatuses()->max('order') ?? 0;

            $subStatus = $repCountryStatus->subStatuses()->create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'order' => $maxOrder + 1,
                'is_active' => true,
            ]);

            return $subStatus;
        } catch (Throwable $e) {
            Log::error('Failed to add sub-status', [
                'rep_country_status_id' => $repCountryStatus->id,
                'request' => $request->all(),
                'exception' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}
