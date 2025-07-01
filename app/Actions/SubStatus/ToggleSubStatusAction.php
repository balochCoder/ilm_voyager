<?php

declare(strict_types=1);

namespace App\Actions\SubStatus;

use App\Http\Requests\RepCountry\ToggleSubStatusRequest;
use App\Models\SubStatus;
use Illuminate\Support\Facades\Log;
use Throwable;

final class ToggleSubStatusAction
{
    public function execute(ToggleSubStatusRequest $request, SubStatus $subStatus): SubStatus
    {
        try {
            $validated = $request->validated();
            
            $subStatus->update([
                'is_active' => $validated['is_active'],
            ]);

            return $subStatus->fresh();
        } catch (Throwable $e) {
            Log::error('Failed to toggle sub-status', [
                'sub_status_id' => $subStatus->id,
                'request' => $request->all(),
                'exception' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
} 