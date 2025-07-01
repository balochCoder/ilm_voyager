<?php

declare(strict_types=1);

namespace App\Actions\SubStatus;

use App\Http\Requests\RepCountry\EditSubStatusRequest;
use App\Models\SubStatus;
use Illuminate\Support\Facades\Log;
use Throwable;

final class EditSubStatusAction
{
    public function execute(EditSubStatusRequest $request, SubStatus $subStatus): SubStatus
    {
        try {
            $validated = $request->validated();
            
            $subStatus->update([
                'name' => $validated['name'],
            ]);

            return $subStatus->fresh();
        } catch (Throwable $e) {
            Log::error('Failed to edit sub-status', [
                'sub_status_id' => $subStatus->id,
                'request' => $request->all(),
                'exception' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
} 