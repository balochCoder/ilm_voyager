<?php

declare(strict_types=1);

namespace App\Actions\RepCountry;

use App\Http\Resources\RepCountryResource;
use App\Http\Resources\CountryResource;
use App\Models\RepCountry;
use App\Models\Country;
use App\Models\Status;
use Illuminate\Http\Request;

final class GetRepCountriesIndexDataAction
{
    /**
     * Get data for the RepCountry index page.
     */
    public function execute(Request $request): array
    {
        $query = RepCountry::with(['country', 'repCountryStatuses' => function ($query) {
            $query->orderBy('order', 'asc')->with(['subStatuses' => function ($subQuery) {
                $subQuery->orderBy('order', 'asc');
            }]);
        }])->orderBy('created_at', 'desc');

        if ($request->filled('country_id') && $request->country_id !== 'all') {
            $query->where('country_id', $request->country_id);
        }

        $repCountries = RepCountryResource::collection($query->paginate(6));

        $availableCountries = Country::whereHas('repCountry')
            ->orderBy('name')
            ->get(['id', 'name', 'flag']);

        $statuses = Status::ordered()->get();
        $repCountriesTotal = RepCountry::count();
        $repCountriesActive = RepCountry::where('is_active', true)->count();

        return [
            'repCountries' => $repCountries,
            'availableCountries' => $availableCountries,
            'statuses' => $statuses,
            'repCountriesTotal' => $repCountriesTotal,
            'repCountriesActive' => $repCountriesActive,
        ];
    }
}
