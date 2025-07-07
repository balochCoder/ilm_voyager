<?php

namespace App\Actions\ProcessingOffice;

use App\Http\Resources\ProcessingOfficeResource;
use App\Models\ProcessingOffice;
use App\Models\Country;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class IndexProcessingOfficeAction
{
    public function execute(Request $request): array
    {
        $query = QueryBuilder::for(ProcessingOffice::class)
            ->with(['country', 'user'])
            ->allowedFilters([
                AllowedFilter::callback('keyword', function ($query, $value) {
                    $query->where(function ($q) use ($value) {
                        $q->where('name', 'like', "%{$value}%")
                            ->orWhere('address', 'like', "%{$value}%")
                            ->orWhere('city', 'like', "%{$value}%")
                            ->orWhere('state', 'like', "%{$value}%")
                            ->orWhereHas('user', function ($userQuery) use ($value) {
                                $userQuery->where('name', 'like', "%{$value}%");
                            });
                    });
                }),
                AllowedFilter::callback('status', function ($query, $value) {
                    if ($value === 'active') {
                        $query->where('is_active', true);
                    } elseif ($value === 'inactive') {
                        $query->where('is_active', false);
                    }
                }),
                AllowedFilter::exact('country_id'),
                AllowedFilter::callback('contact_person_email', function ($query, $value) {
                    $query->whereHas('user', function ($userQuery) use ($value) {
                        $userQuery->where('email', 'like', "%{$value}%");
                    });
                }),
            ]);

        $processingOffices = $query->paginate(10)->withQueryString();
        $processingOfficesActive = ProcessingOffice::where('is_active', true)->count();
        $countries = Country::query()->orderBy('name')->get(['id', 'name', 'flag']);

        return [
            'processingOffices' => ProcessingOfficeResource::collection($processingOffices),
            'processingOfficesTotal' => $processingOffices->total(),
            'processingOfficesActive' => $processingOfficesActive,
            'countries' => $countries,
        ];
    }
}
