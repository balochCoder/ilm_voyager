<?php

namespace App\Actions\RepCountry;

use App\Models\RepCountry;
use Illuminate\Http\Request;

class AddRepCountryStatusAction
{
    public function execute(Request $request, RepCountry $repCountry): void
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $statusName = $request->name;
        $maxOrder = $repCountry->repCountryStatuses()->max('order') ?? 0;
        $repCountry->repCountryStatuses()->create([
            'status_name' => $statusName,
            'order' => $maxOrder + 1,
        ]);
    }
} 