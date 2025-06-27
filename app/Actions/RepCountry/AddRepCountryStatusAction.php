<?php

declare(strict_types=1);

namespace App\Actions\RepCountry;

use App\Models\RepCountry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
