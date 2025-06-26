<?php

namespace App\Actions\RepCountry;

use App\Models\RepCountry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StoreRepCountryNotesAction
{
    public function execute(Request $request, RepCountry $repCountry): void
    {
        try {
            $notes = $request->input('status_notes', []);
            foreach ($notes as $statusName => $note) {
                $repCountry->repCountryStatuses()->where('status_name', $statusName)->update(['notes' => $note]);
            }
        } catch (\Throwable $e) {
            Log::error('Failed to store RepCountry notes', [
                'rep_country_id' => $repCountry->id,
                'request' => $request->all(),
                'exception' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
} 