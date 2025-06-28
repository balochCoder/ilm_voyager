<?php

declare(strict_types=1);

namespace App\Actions\RepCountry;

use App\Models\RepCountry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Throwable;

final class AddRepCountryStatusAction
{
    public function execute(Request $request, RepCountry $repCountry): void
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $statusName = $request->name;

            // Prevent creating a status with name "New"
            if ($statusName === 'New') {
                throw ValidationException::withMessages([
                    'name' => 'Cannot create a status with the name "New". This name is reserved and protected.',
                ]);
            }

            // Check for duplicate status name within the same rep country
            $existingStatus = $repCountry->repCountryStatuses()
                ->where('status_name', $statusName)
                ->first();

            if ($existingStatus) {
                throw ValidationException::withMessages([
                    'name' => "A status with the name '{$statusName}' already exists for this country. Please choose a different name.",
                ]);
            }

            $maxOrder = $repCountry->repCountryStatuses()->max('order') ?? 0;
            $repCountry->repCountryStatuses()->create([
                'status_name' => $statusName,
                'order' => $maxOrder + 1,
            ]);
        } catch (Throwable $e) {
            Log::error('Failed to add RepCountry status', [
                'rep_country_id' => $repCountry->id,
                'request' => $request->all(),
                'exception' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}
