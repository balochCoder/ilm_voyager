<?php

declare(strict_types=1);

namespace App\Actions\Institution;

use App\Http\Resources\InstitutionResource;
use App\Models\Currency;
use App\Models\Institution;
use App\Models\RepCountry;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Services\CacheService;

final class GetInstitutionsIndexDataAction
{
    public function execute(Request $request): array
    {
        $cacheService = app(CacheService::class);
        $cacheKey = 'institutions.index.' . md5(json_encode($request->all()));
        $cacheTags = ['institutions'];
        $ttl = 600; // 10 minutes

        return $cacheService->remember($cacheKey, function () use ($request) {
            $query = QueryBuilder::for(Institution::class)
                ->with(['repCountry.country', 'currency'])
                ->allowedFilters([
                    AllowedFilter::callback('country_id', function ($query, $value) {
                        if ($value !== 'all') {
                            $query->whereHas('repCountry', function ($q) use ($value) {
                                $q->where('rep_country_id', $value);
                            });
                        }
                    }),
                    AllowedFilter::callback('type', function ($query, $value) {
                        if ($value !== 'all') {
                            $query->where('institute_type', $value);
                        }
                    }),
                    AllowedFilter::callback('institution_name', function ($query, $value) {
                        $query->where('institution_name', 'like', "%{$value}%");
                    }),
                    AllowedFilter::callback('contact_person_email', function ($query, $value) {
                        $query->where('contact_person_email', 'like', "%{$value}%");
                    }),
                    AllowedFilter::callback('keyword', function ($query, $value) {
                        $query->where(function ($sub) use ($value) {
                            $sub->where('institution_name', 'like', "%$value%")
                                ->orWhere('contact_person_email', 'like', "%$value%")
                                ->orWhere('contact_person_name', 'like', "%$value%");
                        });
                    }),
                    AllowedFilter::callback('contract_expiry_start', function ($query, $value) {
                        $query->whereDate('contract_expiry_date', '>=', $value);
                    }),
                    AllowedFilter::callback('contract_expiry_end', function ($query, $value) {
                        $query->whereDate('contract_expiry_date', '<=', $value);
                    }),
                ])
                ->defaultSort('-created_at');

            $institutions = InstitutionResource::collection($query->paginate(10)->withQueryString());
            $institutionsTotal = Institution::count();
            $institutionsActive = Institution::where('is_active', true)->count();
            $institutionsDirect = Institution::where('institute_type', 'direct')->count();
            $repCountries = RepCountry::with('country')->where('is_active', true)->orderBy('created_at', 'desc')->get();
            $currencies = Currency::orderBy('name')->get();

            return [
                'institutions' => $institutions,
                'repCountries' => $repCountries,
                'currencies' => $currencies,
                'institutionsTotal' => $institutionsTotal,
                'institutionsActive' => $institutionsActive,
                'institutionsDirect' => $institutionsDirect,
            ];
        }, $ttl, $cacheTags);
    }
}
