<?php

declare(strict_types=1);

namespace App\Actions\RepCountry;

use App\Http\Resources\RepCountryResource;
use App\Models\Country;
use App\Models\RepCountry;
use App\Models\Status;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

final class GetRepCountriesIndexDataAction
{
    /**
     * Get data for the RepCountry index page.
     */
    public function execute(Request $request): array
    {
        $query = QueryBuilder::for(RepCountry::class)
            ->with(['country', 'repCountryStatuses' => function ($query) {
                $query->orderBy('order', 'asc')->with(['subStatuses' => function ($subQuery) {
                    $subQuery->orderBy('order', 'asc');
                }]);
            }])
            ->allowedFilters([
                AllowedFilter::callback('country_id', function ($query, $value) {
                    if ($value !== 'all') {
                        $query->where('country_id', $value);
                    }
                }),
            ])
            ->defaultSort('-created_at');

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
