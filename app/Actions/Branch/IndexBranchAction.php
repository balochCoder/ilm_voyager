<?php

namespace App\Actions\Branch;

use App\Http\Resources\BranchResource;
use App\Models\Branch;
use App\Models\Country;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class IndexBranchAction
{
    public function execute(Request $request): array
    {
        $query = QueryBuilder::for(Branch::class)
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

        $branches = $query->paginate(12)->withQueryString();
        $branchesActive = Branch::where('is_active', true)->count();
        $countries = Country::query()->orderBy('name')->get(['id', 'name', 'flag']);

        return [
            'branches' => BranchResource::collection($branches),
            'branchesTotal' => $branches->total(),
            'branchesActive' => $branchesActive,
            'countries' => $countries,
        ];
    }
}
