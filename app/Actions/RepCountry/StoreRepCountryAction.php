<?php

namespace App\Actions\RepCountry;

use App\Models\RepCountry;
use App\Http\Requests\RepCountry\StoreRepCountryRequest;

class StoreRepCountryAction
{
    /**
     * Store a new rep country.
     */
    public function execute(StoreRepCountryRequest $request): RepCountry
    {
        $validated = $request->validated();

        return RepCountry::create($validated);
    }
} 