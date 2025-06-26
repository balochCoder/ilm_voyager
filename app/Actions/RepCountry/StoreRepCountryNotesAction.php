<?php

namespace App\Actions\RepCountry;

use App\Models\RepCountry;
use Illuminate\Http\Request;

class StoreRepCountryNotesAction
{
    public function execute(Request $request, RepCountry $repCountry): void
    {
        $notes = $request->input('status_notes', []);
        foreach ($notes as $statusName => $note) {
            $repCountry->repCountryStatuses()->where('status_name', $statusName)->update(['notes' => $note]);
        }
    }
} 