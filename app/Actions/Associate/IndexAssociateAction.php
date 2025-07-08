<?php

namespace App\Actions\Associate;

use App\Http\Resources\AssociateResource;
use App\Models\Associate;
use App\Models\Country;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class IndexAssociateAction
{
    public function execute($request): array
    {
        $filters = $request->input('filter', []);
        $query = QueryBuilder::for(Associate::class)
            ->with(['branch', 'country'])
            ->allowedFilters([
                AllowedFilter::callback('keyword', function ($query, $value) {
                    $query->where(function ($q) use ($value) {
                        $q->where('associate_name', 'like', "%$value%")
                            ->orWhere('contact_person', 'like', "%$value%")
                            ->orWhere('contact_email', 'like', "%$value%")
                            ->orWhere('contact_mobile', 'like', "%$value%")
                            ->orWhere('phone', 'like', "%$value%")
                            ->orWhere('address', 'like', "%$value%")
                            ->orWhere('city', 'like', "%$value%")
                            ->orWhere('state', 'like', "%$value%")
                            ->orWhere('website', 'like', "%$value%");
                    });
                }),
                AllowedFilter::partial('email', 'contact_email'),
                AllowedFilter::callback('status', function ($query, $value) {
                    if ($value === 'active') {
                        $query->where('is_active', true);
                    } elseif ($value === 'inactive') {
                        $query->where('is_active', false);
                    }
                }),
                AllowedFilter::exact('category'),
                AllowedFilter::exact('country_id'),
            ])
            ->allowedSorts(['created_at', 'associate_name'])
            ->defaultSort('-created_at');

        $associates = $query->paginate(12)->withQueryString();
        $associatesActive = Associate::where('is_active', true)->count();
        $countries = Country::query()->orderBy('name')->get(['id', 'name', 'flag']);
        $statusOptions = [
            ['label' => 'All Status', 'value' => 'all'],
            ['label' => 'Active', 'value' => 'active'],
            ['label' => 'Inactive', 'value' => 'inactive'],
        ];
        $categoryOptions = [
            ['label' => 'All Categories', 'value' => 'all'],
            ['label' => 'A', 'value' => 'A'],
            ['label' => 'B', 'value' => 'B'],
            ['label' => 'C', 'value' => 'C'],
        ];
        $activeFilters = [
            'keyword' => $filters['keyword'] ?? '',
            'email' => $filters['email'] ?? '',
            'status' => $filters['status'] ?? 'all',
            'category' => $filters['category'] ?? 'all',
            'country' => $filters['country_id'] ?? 'all',
        ];

        return [
            'associates' => AssociateResource::collection($associates),
            'associatesTotal' => $associates->total(),
            'associatesActive' => $associatesActive,
            'statusOptions' => $statusOptions,
            'categoryOptions' => $categoryOptions,
            'countries' => $countries,
            'filters' => $activeFilters,
        ];
    }
}
